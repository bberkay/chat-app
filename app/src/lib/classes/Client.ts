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
     * Send a message to the WebSocket server.
     */
    public send(data: {senderId: string, receiverId: string, content: string}): void
    {
        if(this.socket){
            this.socket.send(JSON.stringify(data));
        }
    }

    /**
     * Listen for messages from the WebSocket server.
     */
    public listen(callback: (message: any) => void): void
    {
        if(this.socket){
            this.socket.addEventListener('message', (event: MessageEvent) => {
                callback(event.data);
            });
        }
    }
}