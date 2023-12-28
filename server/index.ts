import { User, Message, MessageType } from "./types";
import type { Server, ServerWebSocket } from "bun";
import { MongoController } from "./classes/MongoController";
import { ApiRequestHandler } from "./classes/ApiRequestHandler.ts";

// Connect to Mongo
MongoController.connect();

// Initialize Variables
const users: User[] = (await MongoController.getAllUsers()).map(user => { user._id = user._id.toString(); return user; });

/**
 * Get all room IDs that the user is in.
 */
function getRoomIds(userId: string): string[] {
    return users.map(user => {
        return [userId, user._id].sort().join("-");
    })
}

/**
 * Create a WebSocket server that listens on /chat/:senderId/:receiverId.
 * @example /chat/1/2
 */
const server = Bun.serve<{ userId: string, friendId: string, roomId: string }>({
    async fetch(req: Request, server: Server): Promise<Response | undefined>
    {
        const url = new URL(req.url);

        /**
         * Handle API operations if the request is for /api/, also if the request is for /get-users,
         * return all users that already fetched from the database.
         */
        if (url.pathname.includes("/api/"))
            return !url.pathname.includes("/get-users") ? ApiRequestHandler.handle(url.pathname) : new Response(JSON.stringify(users), { status: 200 });

        // Get values from the URL
        const [userId, friendId] = req.url.split("/chat/")[1].split("/");
        const roomId: string = [userId, friendId].sort().join("-");

        // Upgrade the HTTP request to WebSocket
        const success: boolean = server.upgrade(req, { data: { userId, friendId, roomId } });
        if (success)
            return undefined;

        // handle HTTP request normally
        return new Response("Not found", { status: 404 });
    },
    websocket: {
        async open(ws: ServerWebSocket<{ userId: string, friendId: string, roomId: string }>): Promise<void>
        {
            try
            {
                if(ws.data.userId === undefined)
                    return;

                console.log(`User[${ws.data.userId}] connected to the WebSocket server.`);

                // Subscribe to the rooms that the user is in
                console.log(getRoomIds(ws.data.userId));
                for(const room of getRoomIds(ws.data.userId))
                {
                    ws.subscribe(room);
                    console.log(`User[${ws.data.userId}] subscribed to room[${room}].`);
                }

                // Send the current messages in the room to the user.
                await MongoController.getMessagesBetweenUsers(ws.data.userId, ws.data.friendId).then(messages => {
                    if(messages.length > 0){
                        ws.send(JSON.stringify({type: MessageType.CurrentMessages, data: messages}));
                        console.log(`Current messages of room[${ws.data.roomId}] sent to user[${ws.data.userId}].`);
                    }
                });
            }
            catch(e)
            {
                console.error(e);
                ws.close(500, "Unexpected error while opening WebSocket connection.");
            }
        },
        async message(ws: ServerWebSocket<{ userId: string }>, message: string | Buffer): Promise<void>
        {
            try{
                /**
                 * When a client sends a message, find the room that the message belongs to
                 * and publish the message to that room.
                 */
                const data: Message = JSON.parse(message as string);
                const roomId: string = [data.senderId, data.receiverId].sort().join("-");
                ws.publish(roomId, JSON.stringify({type: MessageType.NewMessage, data: data}));
                console.log(`Publishing message to room[${roomId}]:`, data);
                await MongoController.saveMessage(data.senderId, data.receiverId, data.content);
            }catch(e){
                console.error(e);
                ws.close(500, "Unexpected error while handling message.");
            }
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
