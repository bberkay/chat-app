<script lang="ts">
    import { type Message, MessageType, type Friend, type User } from "$lib/types";
    import { ChatSocket } from "$lib/classes/ChatSocket";
    import { page } from "$app/state";
    import { SharedStore } from "$lib/stores/shared.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { onMount } from "svelte";
    import { sortFriendsByLastMessage } from "$lib/utils";


    interface Props {
        // Data from the server(+layout.server.ts)
        data: {
            theme: "dark" | "light",
            friends: Friend[],
            sessionId: string,
            profile: User
        };
        children?: import('svelte').Snippet;
    }

    let { data, children }: Props = $props();
    SharedStore.friends = data.friends;
    SharedStore.profile = data.profile;
    SharedStore.sessionId = data.sessionId;
    SharedStore.searchResults = data.friends;

    let chatSocket = new ChatSocket();
    onMount(() => {
        $effect(() => {
            SharedStore.sessionId; // Trigger reactivity
            setupChatSocket();
        });
    });

    /**
     * Connect to Server with Client and store it in the chatSocketStore for
     * use in other components.
     */
    function setupChatSocket() {
        SharedStore.messages = [];
        const messagesParams = page.url.pathname.split("/messages/");
        const friendId = messagesParams.length > 1 ? messagesParams[1] : "";
        chatSocket.connect(
            SharedStore.sessionId,
            SharedStore.profile!._id,
            friendId
        );
        SharedStore.chatSocket = chatSocket;

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
            SharedStore.messages = [
                ...SharedStore.messages,
                ...[message.data as Message],
            ];
        } else if (message.type === MessageType.AllRoomMessages) {
            SharedStore.messages = [
                ...SharedStore.messages,
                ...(message.data as Message[]),
            ];
        }

        // Update searchResultsStore
        if (
            message.type === MessageType.NewRoomMessage ||
            message.type === MessageType.NewExternalMessage
        ) {
            SharedStore.searchResults = SharedStore.searchResults.map(
                (friend) => {
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
                }
            );
        } else if (message.type === MessageType.LastMessagesFromFriends) {
            SharedStore.searchResults = SharedStore.searchResults.map(
                (friend) => {
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
                }
            );
        }

        sortFriendsByLastMessage(SharedStore.searchResults);
    }
</script>

<main>
    <Navbar theme={data.theme} />
    <Sidebar />

    <!-- Content -->
    {@render children?.()}
    <!-- Content End -->
</main>

<style>
    main {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }
</style>
