<script lang="ts">
    import { type Message, MessageType } from "$lib/types";
    import { ChatSocket } from "$lib/classes/ChatSocket";
    import { page } from "$app/stores";
    import { get } from "svelte/store";
    import { chatSocketStore, messagesStore } from "$lib/stores";
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import {
        profileStore,
        sessionIdStore,
        friendsStore,
        searchResultsStore,
    } from "$lib/stores";
    import { onMount } from "svelte";
    import { sortFriendsByLastMessage } from "$lib/utils";

    // Data from the server(+layout.server.ts)
    export let data;
    friendsStore.set(data.friends);
    profileStore.set(data.profile);
    sessionIdStore.set(data.sessionId);
    searchResultsStore.set(data.friends);

    let chatSocket = new ChatSocket();
    onMount(() => {
        sessionIdStore.subscribe(setupChatSocket);
    });

    /**
     * Connect to Server with Client and store it in the chatSocketStore for
     * use in other components.
     */
    function setupChatSocket() {
        messagesStore.set([]);
        const messagesParams = $page.url.pathname.split("/messages/");
        const friendId = messagesParams.length > 1 ? messagesParams[1] : "";
        chatSocket.connect(
            get(sessionIdStore),
            get(profileStore)._id,
            friendId
        );
        chatSocketStore.set(chatSocket);

        // Listen to messages from friend and also store the last messages.
        chatSocket
            .getSocket()
            .removeEventListener("message", updateIncomingMessages);
        chatSocket
            .getSocket()
            .addEventListener("message", updateIncomingMessages);
    }

    /**
     * Update messages store with incoming messages.
     */
    function updateIncomingMessages(event: MessageEvent) {
        let message: { type: MessageType; data: Message | Message[] } =
            JSON.parse(event.data);

        // Convert string dates to Date objects
        if (message.data instanceof Array) {
            message.data = message.data.map((msg: Message) => {
                if (
                    Object.hasOwn(msg, "sentAt") &&
                    typeof msg.sentAt === "string"
                )
                    msg.sentAt = new Date(msg.sentAt);
                return msg;
            });
        } else {
            if (
                Object.hasOwn(message.data, "sentAt") &&
                typeof message.data.sentAt === "string"
            ) {
                message.data.sentAt = new Date(message.data.sentAt);
            }
        }

        // Update messagesStore
        if (
            message.type === MessageType.NewRoomMessage ||
            (message.type === MessageType.NewExternalMessage &&
                (message.data as Message).senderId ===
                    chatSocket.getChattingFriendId())
        ) {
            messagesStore.update((messages) => [
                ...messages,
                ...[message.data as Message],
            ]);
        } else if (message.type === MessageType.AllRoomMessages) {
            messagesStore.update((messages) => [
                ...messages,
                ...(message.data as Message[]),
            ]);
        }

        // Update searchResultsStore
        if (
            message.type === MessageType.NewRoomMessage ||
            message.type === MessageType.NewExternalMessage
        ) {
            searchResultsStore.update((friends) => {
                return friends.map((friend) => {
                    const messageData = message.data as Message;
                    if (
                        friend._id === messageData.senderId ||
                        friend._id === messageData.receiverId
                    ) {
                        friend.lastMessage = {
                            senderId: messageData.senderId,
                            sentAt: messageData.sentAt,
                            content: messageData.content,
                        };
                    }
                    return friend;
                });
            });
        } else if (message.type === MessageType.LastMessagesFromFriends) {
            searchResultsStore.update((friends) => {
                return friends.map((friend) => {
                    (message.data as Message[]).forEach((message: Message) => {
                        if (
                            friend._id === message.senderId ||
                            friend._id === message.receiverId
                        ) {
                            friend.lastMessage = {
                                senderId: message.senderId,
                                sentAt: message.sentAt,
                                content: message.content,
                            };
                        }
                    });
                    return friend;
                });
            });
        }

        sortFriendsByLastMessage(get(searchResultsStore));
    }
</script>

<main>
    <Navbar theme={data.theme} />
    <Sidebar />

    <!-- Content -->
    <slot />
    <!-- Content End -->
</main>

<style>
    main {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }
</style>
