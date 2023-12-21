import { MongoClient, ObjectId } from 'mongodb';
import type { Filter, Document } from 'mongodb';
import type { User } from '../types';

/**
 * Mongo class for connecting to the MongoDB.
 */
export class Mongo {
    private static client: MongoClient = new MongoClient(Bun.env.MONGO_URL!);
    private static readonly dbName: string = Bun.env.MONGO_URL!.split("@")[1].split(".")[0];

    /**
     * Connect to Mongo
     */
    public static connect(): void
    {
        this.client.connect().then(r => {
            console.log('Connected to Mongo');
        });
    }

    /**
     * Disconnect from Mongo
     */
    public static disconnect(): void
    {
        this.client.close().then(r => {
            console.log('Disconnected from Mongo');
        });
    }

    /**
     * Get All Documents
     */
    private static async getAllDocuments(collectionName: string): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find().toArray();
    }

    /**
     * Get Document by ID
     */
    private static async getDocumentById(collectionName: string, id: string): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find({_id: new ObjectId(id)}).toArray();
    }

    /**
     * Search Document with Filter
     */
    private static async searchDocumentWithFilter(collectionName: string, filter: Filter<Document>): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find(filter).toArray();
    }

    /**
     * Get All Users
     */
    public static async getAllUsers(): Promise<User[]>
    {
        return await this.getAllDocuments("users");
    }

    /**
     * Get User by ID
     */
    public static async getUserById(id: string): Promise<User>
    {
        const users = await this.getDocumentById("users", id)
        return users[0];
    }

    /**
     * Search User by Name
     */
    public static async searchUsersByName(name: string): Promise<User[]>
    {
        return await this.searchDocumentWithFilter("users", {name: {$regex:name, $options:'i'}});
    }

    /**
     * Get Messages between Users
     */
    public static async getMessagesBetweenUsers(senderId: string | ObjectId, receiverId: string | ObjectId): Promise<string[]>
    {
        senderId = senderId instanceof ObjectId ? senderId : new ObjectId(senderId);
        receiverId = receiverId instanceof ObjectId ? receiverId : new ObjectId(receiverId);
        return await this.searchDocumentWithFilter("messages", {$or: [{senderId: senderId, receiverId: receiverId}, {senderId: receiverId, receiverId: senderId}]});
    }

    /**
     * Save Message
     */
    public static async saveMessage(senderId: string | ObjectId, receiverId: string | ObjectId, message: string): Promise<any>
    {
        senderId = senderId instanceof ObjectId ? senderId : new ObjectId(senderId);
        receiverId = receiverId instanceof ObjectId ? receiverId : new ObjectId(receiverId);
        return await this.client.db(this.dbName).collection("messages").insertOne({senderId: senderId, receiverId: receiverId, message: message});
    }
}