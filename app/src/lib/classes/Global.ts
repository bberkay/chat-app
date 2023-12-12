import type { User } from "$lib/types";
import { Mongo } from "$lib/classes/Mongo";

/**
 * This class is used to store data that is used in
 * multiple components and pages.
 */
class GlobalStore
{
    // Instance
    private static instance: GlobalStore;
    private mongo: Mongo = new Mongo();

    /**
     * All the users in the database are stored here.
     */
    private _users: User[] = [];

    /**
     * All the messages in the database are stored here.
     */
    private _messages: string[] = [];

    /**
     * Initialize the global variables.
     */
    constructor() {
        if (GlobalStore.instance) {
            return GlobalStore.instance;
        }

        GlobalStore.instance = this;
    }

    /**
     * Get the all the users of the database.
     */
    public get users(): User[]
    {
        return this._users;
    }

    /**
     * Get the all the messages of the database.
     */
    public get messages(): string[]
    {
        return this._messages;
    }

    /**
     * Initialize the global variables.
     */
    public async initialize(): Promise<void>
    {
        this._users = await this.mongo.getAllUsers();
        this._users.map((user: User) => {
            user._id = user._id.toString();
        });
    }
}

export const Global = new GlobalStore();