import { User, Message, MessageType } from "./types";
import type { Server, ServerWebSocket } from "bun";
import { Mongo } from "./classes/MongoController";

// Connect to Mongo
Mongo.connect();

// Initialize Variables
let rooms: { [roomId: string]: Message[] } = {};
const users: User[] = await Mongo.getAllUsers();
users.map(user => { user._id = user._id.toString() });
users.sort((a, b) => { return a._id < b._id ? -1 : (a._id > b._id ? 1 : 0) });

/**
 * Handle API operation requests like GET /users or POST /save-message.
 */
async function handleApiOperation(pathname: string): Promise<Response>
{
    const params = pathname.split("/api/")[1].split("/");
    params.shift();
    if(pathname.includes("/get-users"))
    {
        return await Mongo.getAllUsers().then(r => {
            r.map((user: any) => { user._id = user._id.toString() });
            return new Response(JSON.stringify(r), { status: 200 });
        });
    }
    else if (pathname.includes("/get-user"))
    {
        // params[0] = userId
        return await Mongo.getUserById(params[0]).then(r => {
            r._id = r._id.toString();
            return new Response(JSON.stringify(r), { status: 200 });
        });
    }
    else if(pathname.includes("/search-users"))
    {
        // params[0] = searchedName
        return await Mongo.searchUsersByName(params[0]).then(r => {
            r.map((user: any) => {
                user._id = user._id.toString();
            });
            return new Response(JSON.stringify(r), { status: 200 });
        });
    }
    else
    {
        return new Response("Requested API operation not found.", { status: 404 });
    }
}

/**
 * Create a WebSocket server that listens on /chat/:senderId/:receiverId.
 * @example /chat/1/2
 */
const server = Bun.serve<{ userId: string, friendId: string, roomId: string }>({
    async fetch(req: Request, server: Server): Promise<Response | undefined> {
        const url = new URL(req.url);

        // Handle API operations
        if (url.pathname.includes("/api/"))
        {
            console.log(`API operation[${url.pathname}] requested.`)
            return handleApiOperation(url.pathname);
        }

        // Create friendship rooms for each user(because all users are friends with each other)
        const params = req.url.split("/chat/")[1].split("/");
        const userId: string = params[0];
        const friendId: string = params[1];
        const roomId: string = [userId, friendId].sort().join("-");
        if (!rooms[roomId])
            rooms[roomId] = [];

        const success: boolean = server.upgrade(req, { data: { userId, friendId, roomId } });
        if (success) {
            console.log(`User[${userId}] connected to the server.`);
            return undefined;
        }

        // handle HTTP request normally
        return new Response("Not found", {status: 404});
    },
    websocket: {
        open(ws: ServerWebSocket<{ userId: string, friendId: string, roomId: string }>): void
        {
            if(ws.data.userId === undefined)
                return;

            console.log(`User[${ws.data.userId}] connected to the WebSocket server.`);

            // Subscribe to the rooms that the user is in
            for(const room in rooms)
            {
                if(room.includes(ws.data.userId)){
                    console.log(`User[${ws.data.userId}] subscribed to room[${room}].`);
                    ws.subscribe(room);

                    // Send the last message in the room to the user(these messages will showing at bottom of the user on the sidebar).
                    if(rooms[room].length > 0)
                        ws.send(JSON.stringify({type: MessageType.LastMessage, data: rooms[room][rooms[room].length - 1]}));
                }
            }

            // Send the current messages in the room to the user.
            console.log("Current messages in room: ", rooms[ws.data.roomId]);
            if(rooms[ws.data.roomId].length > 0){
                /*
                // TODO: Burada rooms tamamen kaldırılacağından concat a gerek kalmayacak.
                const messages = await Mongo.getMessagesBetweenUsers(ws.data.userId, ws.data.friendId);
                messages.map((message: any) => {
                    message._id = message._id.toString();
                    message.senderId = message.senderId.toString();
                    message.receiverId = message.receiverId.toString();
                    message.sentDate = message.sentDate.toString();
                });
                messages = messages.concat(rooms[ws.data.roomId]);
                ws.send(JSON.stringify({type: MessageType.CurrentMessages, data: messages}));*/
                ws.send(JSON.stringify({type: MessageType.CurrentMessages, data: rooms[ws.data.roomId]}));
            }
        },
        async message(ws: ServerWebSocket<{ userId: string }>, message: string | Buffer): Promise<void>
        {
            /**
             * When a client sends a message, find the room that the message belongs to
             * and publish the message to that room.
             */
            const data: Message = JSON.parse(message as string);
            const roomId: string = [data.senderId, data.receiverId].sort().join("-");
            console.log(`Publishing message to room[${roomId}]:`, data);
            ws.publish(roomId, JSON.stringify({type: MessageType.NewMessage, data: data}));
            rooms[roomId].push(data); // NOTE: This is not a good way to store messages. Use a database instead.

            // TODO: Save the message to the database
            // FIXME: yine burada rooms kaldırılacak.
            // await Mongo.saveMessage(data.senderId, data.receiverId, data.content);

            console.log(`Current messages in room[${roomId}]:`, rooms[roomId]);
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
