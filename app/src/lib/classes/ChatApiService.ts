import type { User } from "$lib/types";
import { droid } from "$lib/classes/Droid";
import { PUBLIC_SERVER_ADDRESS as SERVER_ADDRESS } from "$env/static/public";

/**
 * This class is used for getting data from the server.
 */
export class ChatApiService
{
    /**
     * Get data from the server by using the api.
     */
    private static async fetch(endpoint: string): Promise<Response>
    {
        return fetch(`${SERVER_ADDRESS}/api/${endpoint}`, { method: "GET" });
    }

    /**
     * Create a Session ID for chatting with the friend.
     */
    public static async createSessionId(): Promise<string>
    {
        return ChatApiService.fetch("create-session-id").then(res => res.text());
    }

    /**
     * Save session ID of the user.
     */
    public static async checkSessionId(id: string): Promise<boolean>
    {
        return ChatApiService.fetch(`check-session-id/${id}`).then(res => res.json()) as Promise<boolean>;
    }

    /**
     * Get all users from the server by using the api.
     */
    public static async getUsers(): Promise<User[]>
    {
        return ChatApiService.fetch("get-users").then(res => res.json()) as Promise<User[]>;
    }

    /**
     * Get all users from the server by using the api and add droid to the end of the array.
     */
    public static async getUsersWithDroid(): Promise<User[]>
    {
        return this.getUsers().then((users) => { return users.concat(droid) });
    }

    /**
     * Get a user from the server by using the api.
     */
    public static async getUserById(id: string): Promise<User | undefined>
    {
        return ChatApiService.fetch(`get-user/${id}`).then(res => res.json()) as Promise<User | undefined>;
    }

    /**
     * Get a user from the server by using the api.
     */
    public static async searchUsersByName(name: string): Promise<User[] | undefined>
    {
        return ChatApiService.fetch(`search-users/${name}`).then(res => res.json()) as Promise<User[] | undefined>;
    }
}
