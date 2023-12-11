import { MONGO_URL } from '$env/static/private';
import { MongoClient, ObjectId } from 'mongodb';
import type { Filter, Document } from 'mongodb';

export class Mongo {
    private static instance: Mongo;
    private client: MongoClient = new MongoClient(MONGO_URL);
    private dbName: string = MONGO_URL.split("@")[1].split(".")[0];

    /**
     * @constructor
     */
    public constructor() {
        if(Mongo.instance){
            return Mongo.instance;
        }

        Mongo.instance = this;
    }

    /**
     * Connect to Mongo
     */
    public connect(): void
    {
        this.client.connect().then(r => {
            console.log('Connected to Mongo');
        });
    }

    /**
     * Disconnect from Mongo
     */
    public disconnect(): void
    {
        this.client.close().then(r => {
            console.log('Disconnected from Mongo');
        });
    }

    /**
     * Get All Documents
     */
    private async getAllDocuments(collectionName: string): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find().toArray();
    }

    /**
     * Get Document by ID
     */
    private async getDocumentById(collectionName: string, id: string): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find({_id: new ObjectId(id)}).toArray();
    }

    /**
     * Search Document with Filter
     */
    private async searchDocumentWithFilter(collectionName: string, filter: Filter<Document>): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find(filter).toArray();
    }

    /**
     * Get All Users
     */
    public async getAllUsers(): Promise<any>
    {
        return await this.getAllDocuments("users");
    }

    /**
     * Get User by ID
     */
    public async getUserById(id: string): Promise<any>
    {
        return await this.getDocumentById("users", id);
    }

    /**
     * Search User by Name
     */
    public async searchUserByName(name: string): Promise<any>
    {
        return await this.searchDocumentWithFilter("users", {name: {$regex:name, $options:'i'}});
    }

    /**
     * Get Messages between Users
     */
    public async getMessagesBetweenUsers(senderId: string | ObjectId, receiverId: string | ObjectId): Promise<any>
    {
        senderId = senderId instanceof ObjectId ? senderId : new ObjectId(senderId);
        receiverId = receiverId instanceof ObjectId ? receiverId : new ObjectId(receiverId);
        return await this.searchDocumentWithFilter("messages", {$or: [{senderId: senderId, receiverId: receiverId}, {senderId: receiverId, receiverId: senderId}]});
    }

}