export class Client{
    private static instance: Client;
    private socket: WebSocket = new WebSocket("ws://localhost:3000");

    /**
     * @constructor
     */
    public constructor() {
        if(Client.instance){
            return Client.instance;
        }

        Client.instance = this;
    }
}