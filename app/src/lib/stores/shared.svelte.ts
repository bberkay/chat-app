import type { User, Friend, Message } from '$lib/types';
import type { ChatSocket } from '$lib/classes/ChatSocket';

export enum SharedStoreKeys {
    sessionId="sessionId",
    profile="profile",
    friends="friends",
    searchResults="searchResults",
    messages="messages",
    chatSocket="chatSocket",
}

interface ISharedStore {
    [SharedStoreKeys.sessionId]: string;
    [SharedStoreKeys.profile]: User | undefined;
    [SharedStoreKeys.friends]: Friend[];
    [SharedStoreKeys.searchResults]: Friend[];
    [SharedStoreKeys.messages]: Message[];
    [SharedStoreKeys.chatSocket]: ChatSocket | undefined;
}

export const DefaultSharedStore: { [K in SharedStoreKeys]: ISharedStore[K] } = {
    [SharedStoreKeys.sessionId]: "",
    [SharedStoreKeys.profile]: undefined,
    [SharedStoreKeys.friends]: [],
    [SharedStoreKeys.searchResults]: [],
    [SharedStoreKeys.messages]: [],
    [SharedStoreKeys.chatSocket]: undefined,
}

let nonSharedState = $state(DefaultSharedStore);

export class SharedStore {

    /**
     * Getters
     */

    public static get sessionId(): string { return nonSharedState[SharedStoreKeys.sessionId] }
    public static get profile(): User | undefined { return nonSharedState[SharedStoreKeys.profile] }
    public static get friends(): Friend[] { return nonSharedState[SharedStoreKeys.friends] }
    public static get searchResults(): Friend[] { return nonSharedState[SharedStoreKeys.searchResults] }
    public static get messages(): Message[] { return nonSharedState[SharedStoreKeys.messages] }
    public static get chatSocket(): ChatSocket | undefined { return nonSharedState[SharedStoreKeys.chatSocket] }

    /**
     * Setters
     */

    public static set sessionId(sessionId: string) {
        nonSharedState[SharedStoreKeys.sessionId] = sessionId;
    }

    public static set profile(profile: User) {
        nonSharedState[SharedStoreKeys.profile] = profile;
    }

    public static set friends(friends: Friend[]) {
        nonSharedState[SharedStoreKeys.friends] = friends;
    }

    public static set searchResults(searchResults: Friend[]) {
        nonSharedState[SharedStoreKeys.searchResults] = searchResults;
    }

    public static set messages(messages: Message[]) {
        nonSharedState[SharedStoreKeys.messages] = messages;
    }

    public static set chatSocket(chatSocket: ChatSocket) {
        nonSharedState[SharedStoreKeys.chatSocket] = chatSocket;
    }

    /* Custom Methods */

    public static keys(): SharedStoreKeys[]
    {
        return Object.values(SharedStoreKeys);
    }

    public static toString(): string
    {
        return JSON.stringify(nonSharedState, null, 2);
    }

    public static reset(...keys: SharedStoreKeys[]) {
        if (keys.length === 0) {
            keys = SharedStore.keys();
        }

        for (const key of keys) {
            // @ts-ignore
            SharedStore[key] = DefaultSharedStore[key];
        }
    }
}
