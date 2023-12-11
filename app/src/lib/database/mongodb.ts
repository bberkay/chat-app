import { MONGO_URL } from '$env/static/private';
import { MongoClient, ObjectId } from 'mongodb';
import type { Filter, Document } from 'mongodb';

export class MongoDB{
    private static instance: MongoDB;
    private client: MongoClient = new MongoClient(MONGO_URL);
    private dbName: string = MONGO_URL.split("@")[1].split(".")[0];

    /**
     * @constructor
     */
    public constructor() {
        if(MongoDB.instance){
            return MongoDB.instance;
        }

        MongoDB.instance = this;
    }

    /**
     * Connect to MongoDB
     */
    public connect(): void
    {
        this.client.connect().then(r => {
            console.log('Connected to MongoDB');
        });
    }

    /**
     * Disconnect from MongoDB
     */
    public disconnect(): void
    {
        this.client.close().then(r => {
            console.log('Disconnected from MongoDB');
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
    public async getMessagesBetweenUsers(senderId: string, receiverId: string): Promise<any>
    {
        return await this.searchDocumentWithFilter("messages", {$or: [{senderId: senderId, receiverId: receiverId}, {senderId: receiverId, receiverId: senderId}]});
    }

}