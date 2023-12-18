/**
 * Client class for connecting to the WebSocket server.
 */
export class Client{
    private static instance: Client;
    private readonly socket!: WebSocket;

    /**
     * @constructor
     */
    public constructor(userId: string, friendId: string) {
        if(Client.instance){
            return Client.instance;
        }

        Client.instance = this;
        this.socket = new WebSocket(`ws://localhost:3000/chat/${userId}/${friendId}`);
    }

    /**
     * Get the WebSocket connection.
     */
    public getSocket(): WebSocket
    {
        return this.socket;
    }

    /**
     * Send a message to the WebSocket server.
     */
    public send(data: {senderId: string, receiverId: string, content: string}): void
    {
        this.socket.send(JSON.stringify(data));
    }

    /**
     * Disconnect from the WebSocket server.
     */
    public disconnect(): void
    {
        if(this.socket.readyState === WebSocket.OPEN)
            this.socket.close();
    }
}