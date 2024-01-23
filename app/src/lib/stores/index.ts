import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Client } from '$lib/classes/Client';
import type { User } from '$lib/types';

/**
 * @description Session ID store.
 */
export const sessionIdStore: Writable<string> = writable();

/**
 * @description Store for the selected user id in the profile page for
 * changing the selected user in real time.
 */
export const profileStore: Writable<User> = writable();

/**
 * @description Store for all users.
 */
export const usersStore: Writable<User[]> = writable([]);

/**
 * @description Store for the search results that is used to
 * display the search results in real time.
 */
export const searchResultsStore: Writable<User[]> = writable([]);

/**
 * @description Store for the current messages that is used to
 * display the messages between users in real time.
 */
export const messagesStore: Writable<string[]> = writable([]);

/**
 * @description Store for the socket that is used to
 * send and receive messages in real time.
 */
export const clientStore: Writable<Client> = writable();