import { MongoController } from "./MongoController.ts";
import { ApiOperation } from "../types";

export class ApiRequestHandler
{
    private static sessionIds: string[] = [];

    /**
     * Handle API operation requests like GET /users or POST /save-message.
     */
    public static async handle(pathname: string): Promise<Response>
    {
        console.log(`API operation[${pathname}] requested.`);
        const params = pathname.split("/api/")[1].split("/");
        try {
            switch (params[0]) // params[0] will always be the operation name (e.g. api/get-users, api/search-users, etc.)
            {
                case ApiOperation.GetUsers:
                    return await this.getUsers();
                case ApiOperation.GetUser:
                    return await this.getUser(params[1]); // api/get-user/1234567890
                case ApiOperation.GetLastMessage:
                    return await this.getLastMessage(params[1], params[2], params[3]); // api/get-last-message/1234567890/0987654321
                case ApiOperation.SearchUsers:
                    return await this.searchUsers(params[1]); // api/search-users/John
                case ApiOperation.GetSessionId:
                    return new Response(this.createSessionId(), { status: 200 });
                case ApiOperation.CheckSessionId:
                    return new Response(this.checkSessionId(params[1]) ? params[1] : "false", { status: 200 });
                default:
                    return new Response("Requested API operation not found.", {status: 404});
            }
        } catch (e) {
            console.error(e);
            return new Response("Unexpected error while handling API operation.", {status: 500});
        }
    }

    /**
     * Get all users.
     */
    private static async getUsers(): Promise<Response>
    {
        return await MongoController.getAllUsers().then(r => {
            return this.formatResponse(r);
        });
    }

    /**
     * Get a user by id.
     */
    private static async getUser(id: string): Promise<Response>
    {
        return await MongoController.getUserById(id).then(r => {
            return this.formatResponse(r[0]);
        });
    }

    /**
     * Get the last message between two users.
     */
    private static async getLastMessage(sessionId: string, senderOrReceiverId: string, receiverOrSenderId: string): Promise<Response>
    {
        return await MongoController.getLastMessageBetweenUsers(sessionId, senderOrReceiverId, receiverOrSenderId).then(r => {
            return this.formatResponse(r);
        });
    }

    /**
     * Search users by name.
     */
    private static async searchUsers(name: string): Promise<Response>
    {
        return await MongoController.searchUsersByName(name).then(r => {
            return this.formatResponse(r);
        });
    }

    /**
     * Create a random unique session ID that is used to identify
     * the user in the WebSocket server(24 characters long).
     */
    private static createSessionId(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';

        for (let i = 0; i < 24; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters.charAt(randomIndex);
        }

        if(this.sessionIds.includes(id))
            return this.createSessionId();

        this.sessionIds.push(id);
        return id;
    }

    /**
     * Check if the session ID is valid.
     */
    private static checkSessionId(sessionId: string): boolean {
        return this.sessionIds.includes(sessionId);
    }

    /**
     * Format the response to be sent to the client.
     */
    private static formatResponse(data: any = null): Response
    {
        if(data instanceof Array)
            data.map((user: any) => { user._id = user._id.toString() });
        return new Response(JSON.stringify(data), { status: 200 });
    }
}