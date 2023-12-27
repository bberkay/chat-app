import type { User } from "$lib/types";
import { droid } from "$lib/classes/Droid";
import { PUBLIC_SERVER_ADDRESS as SERVER_ADDRESS } from "$env/static/public";

/**
 * This class is used for getting data from the server.
 */
export class Server
{
    /**
     * Get all users from the server by using the api.
     */
    public static async getUsers(): Promise<User[]>
    {
        return fetch(`${SERVER_ADDRESS}/api/get-users`).then((res) => res.json()) as Promise<User[]>;
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
        return fetch(`${SERVER_ADDRESS}/api/get-user/${id}`).then(res => res.json()) as Promise<User | undefined>;
    }

    /**
     * Get the last message between two users from the server by using the api.
     */
    public static async getLastMessageBetweenUsers(user1: string, user2: string): Promise<string | undefined>
    {
        return fetch(`${SERVER_ADDRESS}/api/get-last-message/${user1}/${user2}`).then(res => res.text());
    }

    /**
     * Get a user from the server by using the api.
     */
    public static async searchUsersByName(name: string): Promise<User[] | undefined>
    {
        return fetch(`${SERVER_ADDRESS}/api/search-users/${name}`).then(res => res.json()) as Promise<User[] | undefined>;
    }
}