/**
 * Client class for connecting to the WebSocket server.
 */
export class Client{
    private static instance: Client;
    private socket: WebSocket | undefined;

    /**
     * @constructor
     */
    public constructor() {
        if(Client.instance){
            return Client.instance;
        }

        Client.instance = this;
    }

    /**
     * Connect to the WebSocket server.
     */
    public connect(senderId: string, receiverId: string): void
    {
        this.socket = new WebSocket(`ws://localhost:3000/chat/${senderId}/${receiverId}`);
    }

    /**
     * Disconnect from the WebSocket server.
     */
    public disconnect(): void
    {
        if(this.socket){
            this.socket.close();
        }
    }

    /**
     * Get the WebSocket connection.
     */
    public getSocket(): WebSocket | undefined
    {
        return this.socket;
    }

    /**
     * Send a message to the WebSocket server.
     */
    public send(data: {senderId: string, receiverId: string, content: string}): void
    {
        if(this.socket){
            this.socket.send(JSON.stringify(data));
        }
    }
}