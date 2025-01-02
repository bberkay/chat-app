import { User, Message, MessageType } from "./types";
import type { Server, ServerWebSocket } from "bun";
import { MongoController } from "./classes/MongoController";
import { ApiRequestHandler } from "./classes/ApiRequestHandler.ts";
import { createSimpleLog, generatePersonalChannelId } from "./utils";

MongoController.connect();

// https://www.iana.org/assignments/websocket/websocket.xhtml#close-code-number
const WsCloseCodes = {
    InternalError: 1011,
}

/**
 * Create a WebSocket server that listens on /chat/:senderId/:receiverId.
 * @example /chat/1/2
 */
const server = Bun.serve<{ sessionId: string, userId: string, personalChannel: string, friendId?: string }>({
    async fetch(req: Request, server: Server): Promise<Response | undefined>
    {
        const url = new URL(req.url);

        /**
         * Handle API operations if the request is for /api/.
         */
        if (url.pathname.includes("/api/"))
            return ApiRequestHandler.handle(url.pathname);

        // Get values from the URL
        const chatParams = req.url.split("/chat/");
		if (chatParams.length < 2)
		    return undefined;

		const [ sessionId, userId, friendId ] = chatParams[1].split("/");
        const personalChannel = generatePersonalChannelId(sessionId, userId);

        // Upgrade the HTTP request to WebSocket
        const success: boolean = server.upgrade(req, { data: { sessionId, userId, personalChannel, friendId } });
        if (success)
            return undefined;

        // handle HTTP request normally
        return new Response("Not found", { status: 404 });
    },
    websocket: {
        async open(ws: ServerWebSocket<{ sessionId: string, userId: string, personalChannel: string, friendId?: string }>): Promise<void>
        {
            try
            {
                if(ws.data.userId === undefined)
                    return;

                console.log(createSimpleLog(`User[${ws.data.userId}] connected to the WebSocket server.`, ws.data.sessionId));

                // Subscribe to the personal channel
                ws.subscribe(ws.data.personalChannel);
                console.log(createSimpleLog(`User[${ws.data.userId}] subscribed to personal room[${ws.data.personalChannel}].`, ws.data.sessionId));

                // Send the last messages to the user
                await MongoController.getLastMessages(ws.data.sessionId, ws.data.userId).then(lastMessages => {
                    if(lastMessages.length > 0){
                        ws.send(JSON.stringify({type: MessageType.LastMessagesFromFriends, data: lastMessages}));
                        console.log(createSimpleLog(`Last messages of user[${ws.data.userId}] sent[${ws.data.personalChannel}].`, ws.data.sessionId));
                    }
                })

                // Send the current messages in the room to the user.
                if (ws.data.friendId) {
                    await MongoController.getMessagesBetweenUsers(ws.data.sessionId, ws.data.userId, ws.data.friendId).then(messages => {
                        if(messages.length > 0){
                            ws.send(JSON.stringify({type: MessageType.AllRoomMessages, data: messages}));
                            console.log(createSimpleLog(`Current messages of user[${ws.data.userId}] sent to friend[${ws.data.friendId}}].`, ws.data.sessionId));
                        }
                    });
                }
            }
            catch(e)
            {
                console.error(e);
                ws.close(WsCloseCodes.InternalError, createSimpleLog(`Unexpected error while opening WebSocket connection.`, ws.data.sessionId));
            }
        },
        async message(ws: ServerWebSocket<{ sessionId: string, userId: string, personalChannel: string }>, message: string | Buffer): Promise<void>
        {
            try{
                // Send message to user itself.
                const data: Message = JSON.parse(message as string);
                ws.send(JSON.stringify({type: MessageType.NewRoomMessage, data: data}));
                console.log(createSimpleLog(`Publishing message to personal room[${ws.data.personalChannel}]`, ws.data.sessionId));

                // Send message to friend.
                const receiverPersonalChannel = generatePersonalChannelId(ws.data.sessionId, data.receiverId);
                ws.publish(receiverPersonalChannel, JSON.stringify({type: MessageType.NewExternalMessage, data: data}));
                console.log(createSimpleLog(`Publishing message to friend personal room[${receiverPersonalChannel}]`, ws.data.sessionId));

                await MongoController.saveMessage(data.sessionId, data.senderId, data.receiverId, data.content);
            }catch(e){
                console.error(e);
                ws.close(WsCloseCodes.InternalError, createSimpleLog(`Unexpected error while handling message.`, ws.data.sessionId));
            }
        },
    },
});

console.log(createSimpleLog(`Listening on ${server.hostname}:${server.port}`));
