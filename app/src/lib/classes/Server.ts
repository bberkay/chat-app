import { Global } from "$lib/classes/Global";
import type { User } from "$lib/types";
import { droid } from "$lib/classes/Droid";

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
        return fetch(`http://${Global.SERVER_ADDRESS}/api/get-users`).then((res) => res.json());
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
        return fetch(`http://${Global.SERVER_ADDRESS}/api/get-user/${id}`).then(res => res.json());
    }

    /**
     * Get a user from the server by using the api.
     */
    public static async searchUsersByName(name: string): Promise<User[] | undefined>
    {
        return fetch(`http://${Global.SERVER_ADDRESS}/api/search-users/${name}`).then(res => res.json());
    }
}