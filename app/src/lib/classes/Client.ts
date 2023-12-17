/**
 * Client class for connecting to the WebSocket server.
 */
export class Client{
    private static instance: Client;
    private static socket: WebSocket | undefined;

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
    public static connect(senderId: string, receiverId: string): void
    {
        Client.socket = new WebSocket(`ws://localhost:3000/chat/${senderId}/${receiverId}`);
    }

    /**
     * Disconnect from the WebSocket server.
     */
    public static disconnect(): void
    {
        if(this.socket){
            this.socket.close();
        }
    }

    /**
     * Get the WebSocket connection.
     */
    public static getSocket(): WebSocket | undefined
    {
        return this.socket;
    }

    /**
     * Send a message to the WebSocket server.
     */
    public static send(data: {senderId: string, receiverId: string, content: string}): void
    {
        if(this.socket){
            this.socket.send(JSON.stringify(data));
        }
    }
}