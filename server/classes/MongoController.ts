import { MongoClient, ObjectId } from "mongodb";
import type { Filter, Document } from "mongodb";
import type { User, Message } from "../types";

/**
 * Mongo class for connecting to the MongoDB.
 */
export class MongoController {
    private static client: MongoClient = new MongoClient(Bun.env.MONGO_URL!);
    private static readonly dbName: string = Bun.env
        .MONGO_URL!.split("@")[1]
        .split(".")[0];

    /**
     * Connect to Mongo
     */
    public static connect(): void {
        this.client
            .connect()
            .then((r) => {
                console.log(
                    `${new Date().toLocaleTimeString()} Connected to Mongo`
                );
            })
            .catch((e) => {
                console.error(e);
            });
    }

    /**
     * Disconnect from Mongo
     */
    public static disconnect(): void {
        this.client.close().then((r) => {
            console.log(
                `${new Date().toLocaleTimeString()} Disconnected from Mongo`
            );
        });
    }

    /**
     * Get All Documents
     */
    private static async getAllDocuments(collectionName: string): Promise<any> {
        return await this.client
            .db(this.dbName)
            .collection(collectionName)
            .find()
            .toArray();
    }

    /**
     * Get Document by ID
     */
    private static async getDocumentById(
        collectionName: string,
        id: string
    ): Promise<any> {
        return await this.client
            .db(this.dbName)
            .collection(collectionName)
            .find({ _id: new ObjectId(id) })
            .toArray();
    }

    /**
     * Search Document with Filter
     */
    private static async searchDocumentWithFilter(
        collectionName: string,
        filter: Filter<Document>
    ): Promise<any> {
        return await this.client
            .db(this.dbName)
            .collection(collectionName)
            .find(filter);
    }

    /**
     * Get All Users
     */
    public static async getAllUsers(): Promise<User[]> {
        return await this.getAllDocuments("users");
    }

    /**
     * Get User by ID
     */
    public static async getUserById(id: string): Promise<User[]> {
        return await this.getDocumentById("users", id);
    }

    /**
     * Search User by Name
     */
    public static async searchUsersByName(name: string): Promise<User[]> {
        return await this.searchDocumentWithFilter("users", {
            name: { $regex: name, $options: "i" },
        }).then((r) => r.toArray());
    }

    /**
     * Get Messages between Users
     */
    public static async getMessagesBetweenUsers(
        sessionId: string,
        senderId: string,
        receiverId: string
    ): Promise<Message[]> {
        return await this.searchDocumentWithFilter("messages", {
            $or: [
                {
                    sessionId: sessionId,
                    senderId: senderId,
                    receiverId: receiverId,
                },
                {
                    sessionId: sessionId,
                    senderId: receiverId,
                    receiverId: senderId,
                },
            ],
        }).then((r) => r.toArray());
    }

    /**
     * Get the last messages of the user for each friend.
     */
    public static async getLastMessages(
        sessionId: string,
        userId: string
    ): Promise<any> {
        return await this.client
            .db(this.dbName)
            .collection("messages")
            .aggregate([
                {
                    $match: {
                        sessionId: sessionId,
                        $or: [
                            { senderId: userId },
                            { receiverId: userId },
                        ],
                    },
                },
                {
                    $addFields: {
                        friendId: {
                            $cond: [
                                { $eq: ["$senderId", userId] },
                                "$receiverId",
                                "$senderId",
                            ],
                        },
                    },
                },
                {
                    $sort: { sentAt: -1 },
                },
                {
                    $group: {
                        _id: "$friendId",
                        lastMessage: { $first: "$$ROOT" },
                    },
                },
                {
                    $replaceRoot: { newRoot: "$lastMessage" },
                },
            ])
            .toArray();
    }


    /**
     * Get Last Message between Users
     */
    public static async getLastMessageBetweenUsers(
        sessionId: string,
        senderId: string,
        receiverId: string
    ): Promise<any> {
        return await this.client
            .db(this.dbName)
            .collection("messages")
            .find({
                $or: [
                    {
                        sessionId: sessionId,
                        senderId: senderId,
                        receiverId: receiverId,
                    },
                    {
                        sessionId: sessionId,
                        senderId: receiverId,
                        receiverId: senderId,
                    },
                ],
            })
            .limit(1)
            .sort({ sentAt: -1 })
            .toArray();
    }

    /**
     * Save Message
     */
    public static async saveMessage(
        sessionId: string | ObjectId,
        senderId: string,
        receiverId: string,
        message: string,
        sentAt: Date
    ): Promise<any> {
        return await this.client
            .db(this.dbName)
            .collection("messages")
            .insertOne({
                sessionId: sessionId,
                senderId: senderId,
                receiverId: receiverId,
                content: message,
                sentAt: sentAt
            });
    }
}
