let rooms: { [roomId: string]: any } = {};
const server = Bun.serve<{ senderId: string, roomId: string }>({
    fetch(req, server) {
        const url: string[] = req.url.split("/chat/")[1].split("/");
        const senderId: string = url[0];
        const receiverId: string = url[1];
        const roomId: string = url.sort().join("-");

        if (!rooms[roomId])
            rooms[roomId] = [];

        const success: boolean = server.upgrade(req, { data: { senderId, receiverId, roomId }});
        if (success) {
            // Bun automatically returns a 101 Switching Protocols
            // if the upgrade succeeds
            return undefined;
        }

        // handle HTTP request normally
        return new Response("Hello world!");
    },
    websocket: {
        open(ws) {
            ws.subscribe(ws.data.roomId);
            console.log(`Subscribed to ${ws.data.roomId} as ${ws.data.senderId} and currently has ${JSON.stringify(rooms[ws.data.roomId])} messages`);
            ws.publish(ws.data.roomId, JSON.stringify(rooms[ws.data.roomId]));
        },
        // this is called when a message is received
        async message(ws, message) {
            const data = JSON.parse(message as string);
            const content = { senderId: ws.data.senderId, message: data.message };
            ws.publish(ws.data.roomId, JSON.stringify(content));
            rooms[ws.data.roomId].push(content);
            console.log(`Received message from ${ws.data.senderId} in ${ws.data.roomId} with content ${JSON.stringify(content)}`);
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
