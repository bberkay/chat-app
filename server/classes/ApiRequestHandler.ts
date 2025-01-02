import { MongoController } from "./MongoController.ts";
import { ApiOperation } from "../types";
import { SessionManager } from "./SessionManager.ts";
import { createSimpleLog } from "../utils.ts";

export class ApiRequestHandler
{
    private static _sessionManager = new SessionManager();

    /**
     * Handle API operation requests like GET /users or POST /save-message.
     */
    public static async handle(pathname: string): Promise<Response>
    {
        console.log(createSimpleLog(`API operation[${pathname}] requested.`));
        const params = pathname.split("/api/")[1].split("/");
        try {
            switch (params[0]) // params[0] will always be the operation name (e.g. api/get-users, api/search-users, etc.)
            {
                case ApiOperation.GetUsers:
                    return await this.getUsers();
                case ApiOperation.GetUser:
                    return await this.getUser(params[1]); // api/get-user/1234567890<userId>
                case ApiOperation.SearchUsers:
                    return await this.searchUsers(params[1]); // api/search-users/John
                case ApiOperation.CreateSessionId:
                    return this.createSessionId();
                case ApiOperation.CheckSessionId:
                    return this.checkSessionId(params[1]); // api/check-session-id/1234567890<sessionId>
                default:
                    return new Response("Requested API operation not found.", {status: 404});
            }
        } catch (e) {
            console.error(e);
            return new Response("Unexpected error while handling API operation.", {status: 500});
        }
    }

    /**
     * Create a new session id.
     */
    private static createSessionId(): Response
    {
        return this.formatResponse(this._sessionManager.create(), false);
    }

    /**
     * Check if the session id is valid.
     */
    private static checkSessionId(sessionId: string): Response
    {
        return this.formatResponse(this._sessionManager.check(sessionId));
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
     * Search users by name.
     */
    private static async searchUsers(name: string): Promise<Response>
    {
        return await MongoController.searchUsersByName(name).then(r => {
            return this.formatResponse(r);
        });
    }

    /**
     * Format the response to be sent to the client.
     */
    private static formatResponse(data: any, stringify: boolean = true): Response
    {
        if (data instanceof Array) {
            data.map((user: any) => {
                if(user && Object.hasOwn(user, "_id"))
                    user._id = user._id.toString()
                return user;
            });
        }

        return new Response(stringify ? JSON.stringify(data) : data, { status: 200 });
    }
}
