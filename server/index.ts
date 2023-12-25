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
    else if (pathname.includes("/get-last-message"))
    {
        // params[0] = user1, params[1] = user2
        const roomId: string = [params[0], params[1]].sort().join("-");
        if(!rooms[roomId] || rooms[roomId].length === 0)
            return new Response('', { status: 200 });

        const lastMessage: string = rooms[roomId][rooms[roomId].length - 1].content;
        return new Response(lastMessage, { status: 200 });
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
 * Create random 24 character string that starts with 657.
 */
function createMessageId(): string
{
    const chars: string = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result: string = "657";
    for(let i = 0; i < 21; i++)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
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
            try{
                return handleApiOperation(url.pathname);
            }catch(e){
                return new Response("Unexpected error while handling API operation.", { status: 500 });
            }
        }

        // Create friendship rooms for each user(because all users are friends with each other)
        const params = req.url.split("/chat/")[1].split("/");
        const userId: string = params[0];
        const friendId: string = params[1];
        const roomId: string = [userId, friendId].sort().join("-");
        if (!rooms[roomId])
            rooms[roomId] = [];

        const success: boolean = server.upgrade(req, { data: { userId, friendId, roomId } });
        if (success)
            return undefined;

        // handle HTTP request normally
        return new Response("Not found", {status: 404});
    },
    websocket: {
        open(ws: ServerWebSocket<{ userId: string, friendId: string, roomId: string }>): void
        {
            try
            {
                if(ws.data.userId === undefined)
                    return;

                console.log(`User[${ws.data.userId}] connected to the WebSocket server.`);

                // Subscribe to the rooms that the user is in
                for(const room in rooms)
                {
                    if(room.includes(ws.data.userId)){
                        ws.subscribe(room);
                        console.log(`User[${ws.data.userId}] subscribed to room[${room}].`);
                    }
                }

                // Send the current messages in the room to the user.
                if(rooms[ws.data.roomId].length > 0){
                    ws.send(JSON.stringify({type: MessageType.CurrentMessages, data: rooms[ws.data.roomId]}));
                    console.log(`Sending current messages to user[${ws.data.userId}]:`, rooms[ws.data.roomId]);
                }
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
                data._id = createMessageId();
                data.sentDate = new Date();
                const roomId: string = [data.senderId, data.receiverId].sort().join("-");
                ws.publish(roomId, JSON.stringify({type: MessageType.NewMessage, data: data}));
                console.log(`Publishing message to room[${roomId}]:`, data);
                rooms[roomId].push(data);
            }catch(e){
                console.error(e);
                ws.close(500, "Unexpected error while handling message.");
            }
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
