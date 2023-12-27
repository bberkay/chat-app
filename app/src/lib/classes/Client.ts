import { profileStore } from "$lib/stores";
import { get } from "svelte/store";
import { PUBLIC_SERVER_ADDRESS as SERVER_ADDRESS } from "$env/static/public";

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
    public connect(friendId: string): void
    {
        if(this.socket)
            throw new Error("Socket is already defined, please disconnect from the WebSocket server with client.disconnect()");
        else if(!get(profileStore))
            throw new Error("Profile store is not defined yet, please connect to the WebSocket server after the profile store is defined");

        this.socket = new WebSocket(`ws://${SERVER_ADDRESS}/chat/${get(profileStore)._id}/${friendId}`);
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
     * Send a message to the WebSocket server.
     */
    public send(data: {senderId: string, receiverId: string, content: string}): void
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