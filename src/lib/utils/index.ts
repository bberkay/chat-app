import { type Friend } from "$lib/types";

export function sortFriendsByLastMessage(friends: Friend[]) {
    friends.sort((a, b) => {
        const dateA = a.lastMessage?.sentAt.getTime() ?? -Infinity;
        const dateB = b.lastMessage?.sentAt.getTime() ?? -Infinity;
        return dateB - dateA;
    });
}
