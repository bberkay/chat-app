import { Credentials, Message } from "./types";
import type { Server, ServerWebSocket } from "bun";

/**
 * Rooms is a map of roomId to an array of messages.
 */
let rooms: { [roomId: string]: Message[] } = {};

/**
 * Extract the senderId, receiverId and roomId from the URL.
 * @example /chat/1/2 -> { senderId: "1", receiverId: "2", roomId: "1-2" }
 * @example /chat/2/1 -> { senderId: "1", receiverId: "2", roomId: "1-2" }
 */
function getDataFromUrl(url: string): Credentials
{
    const data: string[] = url.split("/chat/")[1].split("/");
    return { senderId: data[0], receiverId: data[1], roomId: data.sort().join("-") };
}

/**
 * Create a WebSocket server that listens on /chat/:senderId/:receiverId.
 * @example /chat/1/2
 */
const server = Bun.serve<Credentials>({
    fetch(req: Request, server: Server): Response | undefined
    {
        const credentials: Credentials = getDataFromUrl(req.url);

        // If room doesn't exist, create it.
        if (!rooms[credentials.roomId])
            rooms[credentials.roomId] = [];

        const success: boolean = server.upgrade(req, { data: credentials });
        if (success) {
            // Bun automatically returns a 101 Switching Protocols if the upgrade succeeds
            return undefined;
        }

        // handle HTTP request normally
        return new Response("Not found", { status: 404 });
    },
    websocket: {
        open(ws: ServerWebSocket<Credentials>): void
        {
            /**
             * When a client connects, subscribe to the room and publish the
             * current messages in the room.
             */
            ws.subscribe(ws.data.roomId);
            console.log(`Subscribed to ${ws.data.roomId} as ${ws.data.senderId} and currently has ${JSON.stringify(rooms[ws.data.roomId])} messages`);
            ws.publish(ws.data.roomId, JSON.stringify(rooms[ws.data.roomId]));
        },
        async message(ws: ServerWebSocket<Credentials>, message: string | Buffer): Promise<void>
        {
            /**
             * When a client sends a message, publish it to the room.
             */
            const data: Message = JSON.parse(message as string);
            console.log("Data extracted from message:", data);
            ws.publish(ws.data.roomId, JSON.stringify(data));
            rooms[ws.data.roomId].push(data);
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
