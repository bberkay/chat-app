import { User, Message } from "./types";
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
    else if(pathname.includes("/get-messages"))
    {
        // params[0] = senderId, params[1] = receiverId
        return await Mongo.getMessagesBetweenUsers(params[0], params[1]).then(r => {
            r.map((message: any) => {
                message._id = message._id.toString();
                message.senderId = message.senderId.toString();
                message.receiverId = message.receiverId.toString();
                message.sentDate = message.sentDate.toString();
            });
            return new Response(JSON.stringify(r), { status: 200 });
        });

    }
    else if(pathname.includes("/save-message"))
    {
        // params[0] = senderId, params[1] = receiverId, params[2] = message
        return await Mongo.saveMessage(params[0], params[1], params[2]).then(r => {
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
const server = Bun.serve<{ userId: string }>({
    async fetch(req: Request, server: Server): Promise<Response | undefined> {
        const url = new URL(req.url);

        // Handle API operations
        if (url.pathname.includes("/api/"))
        {
            console.log(`API operation[${url.pathname}] requested.`)
            return handleApiOperation(url.pathname);
        }

        // Create friendship rooms for each user(because all users are friends with each other)
        const userId: string = req.url.split("/chat/")[1];
        for (const user of users) {
            if (user._id === userId)
                continue;

            const roomId: string = `${userId}-${user._id}`;
            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }
        }

        const success: boolean = server.upgrade(req, {data: userId});
        if (success) {
            // Bun automatically returns a 101 Switching Protocols if the upgrade succeeds
            return undefined;
        }

        // handle HTTP request normally
        return new Response("Not found", {status: 404});
    },
    websocket: {
        open(ws: ServerWebSocket<{ userId: string }>): void
        {
            if(ws.data.userId === undefined)
                return;

            // Subscribe to the rooms that the user is in
            for(const room in rooms[ws.data.userId])
            {
                if(room.includes(ws.data.userId))
                    ws.subscribe(room);
            }
            console.log(`${ws.data.userId} connected to the server`);
        },
        async message(ws: ServerWebSocket<{ userId: string }>, message: string | Buffer): Promise<void>
        {
            /**
             * When a client sends a message, find the room that the message belongs to
             * and publish the message to that room.
             */
            const data: Message = JSON.parse(message as string);
            const roomId: string = [data.senderId, data.receiverId].sort().join("-");
            console.log("Data extracted from message:", data);
            ws.publish(roomId, JSON.stringify(data));
            rooms[roomId].push(data);
            console.log("Current messages in room:", rooms[roomId]);
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
