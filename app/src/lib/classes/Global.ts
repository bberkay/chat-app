import type { User, Droid } from "$lib/types";
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
     * Chatbot of the application.
     */
    public readonly droid: Droid = {
        _id: "droid",
        name: "C-3P0",
        avatar: "https://i.ibb.co/DgCBV68/c-3po.jpg",
        readyMessages: [
            "I am C-3P0, human-cyborg relations.",
            "I am a protocol droid, not a therapist.",
            "I am fluent in over six million forms of communication.",
            "I am well-versed in etiquette, protocol, and translation.",
            "Sometimes, I Just Don't Understand Human Behavior",
            "I'm Not Supposed To Know A Power Socket From A Computer Terminal",
            "It's Against My My Programming To Impersonate A Diety",
            "Help! I think I'm melting! This is all your fault!",
        ]
    }

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