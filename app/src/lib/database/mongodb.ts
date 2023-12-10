import { MONGO_URL } from '$env/static/private';
import { MongoClient, ObjectId } from 'mongodb';

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
     * Get All Documents(Users)
     */
    public async getAllDocuments(collectionName: string): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find().toArray();
    }

    /**
     * Get Document(User) by ID
     */
    public async getDocumentById(collectionName: string, id: string): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find({_id: new ObjectId(id)}).toArray();
    }

    /**
     * Search Document(User) by Name
     */
    public async searchDocumentByName(collectionName: string, name: string): Promise<any>
    {
        return await this.client.db(this.dbName).collection(collectionName).find({name: {$regex:name, $options:'i'}}).toArray();
    }
}