import { writable } from 'svelte/store';

/**
 * @description Store for messages
 * [{ senderId: string, receiverId: string, message: string }]
 */
export const messages = writable([]);