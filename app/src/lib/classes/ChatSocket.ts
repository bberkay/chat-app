import { PUBLIC_WS_ADDRESS as WS_ADDRESS } from "$env/static/public";

/**
 * Client class for connecting to the WebSocket server.
 */
export class ChatSocket{
    private static _instance: ChatSocket;
    private socket: WebSocket | undefined;

    /**
     * @constructor
     */
    public constructor() {
        if(ChatSocket._instance){
            return ChatSocket._instance;
        }

        ChatSocket._instance = this;
    }

    /**
     * Connect to the WebSocket server.
     */
    public connect(sessionId: string, profileId: string, friendId: string | null = null): void
    {
        if(this.socket)
            throw new Error("Socket is already defined, please disconnect from the WebSocket server with client.disconnect()");

        this.socket = new WebSocket(`${WS_ADDRESS}/chat/${sessionId}/${profileId}/${friendId || ''}`);
    }

    /**
     * Check if the client is connected to the WebSocket server.
     */
    public isConnected(): boolean
    {
        return this.socket !== undefined;
    }

    /**
     * Get the WebSocket connection.
     */
    public getSocket(): WebSocket
    {
        if(!this.socket)
            throw new Error("Socket is not defined, please connect to the WebSocket server with client.connect()");

        return this.socket;
    }

    /**
     * Get the friend id that the client is chatting with.
     */
    public getChattingFriendId(): string | undefined
    {
        if(!this.socket)
            return undefined;

        const [ , , friendId ] = this.socket.url.split("/chat/")[1].split("/");
        return friendId;
    }

    /**
     * Send a message to the WebSocket server.
     */
    public send(data: {sessionId: string, senderId: string, receiverId: string, content: string}): void
    {
        if(!this.socket)
            throw new Error("Socket is not defined, please connect to the WebSocket server with client.connect()");

        this.socket.send(JSON.stringify(data));
    }

    /**
     * Disconnect from the WebSocket server.
     */
    public disconnect(): void
    {
        if(!this.socket)
            throw new Error("Socket is not defined, please connect to the WebSocket server with client.connect()");

        if(this.socket.readyState === WebSocket.OPEN)
            this.socket.close();
    }
}
