import type { User } from '$lib/types'

/**
 * Droid class
 * This droid is using as simple chatbot. It will respond to some messages.
 */
export class Droid {
    public readonly _id: string = "droid";
    public readonly name: string = "C-3PO";
    public readonly avatar: string = "https://i.ibb.co/DgCBV68/c-3po.jpg";

    /**
     * Convert the droid to JSON
     * returns same object as User
     */
    public toJSON(): User {
        return {
            _id: this._id,
            name: this.name,
            avatar: this.avatar
        };
    }
}