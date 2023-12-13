import type { User } from '$lib/types'

/**
 * Droid class
 * This droid is using as simple chatbot. It will respond to some messages.
 */
export class Droid {
    public readonly _id: string = this.createID();
    private _name: string;
    private _avatar: string;

    constructor(name: string, avatar: string){
        this._name = name;
        this._avatar = avatar;
    }

    /**
     * Convert the droid to JSON
     * returns same object as User
     */
    public toJSON(): User {
        return {
            _id: this._id,
            name: this._name,
            avatar: this._avatar
        };
    }

    /**
     * Get the name of the droid
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Get the avatar of the droid
     */
    public get avatar(): string {
        return this._avatar;
    }

    /**
     * Create a random ID for the droid like object id's in MongoDB
     */
    private createID(): string {
        // Create a 24 character random string with numbers and letters
        let id = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 24; i++)
            id += characters.charAt(Math.floor(Math.random() * charactersLength));
        return id;
    }
}