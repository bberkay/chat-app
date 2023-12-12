import { writable } from 'svelte/store';

/**
 * @description Store for the selected user id in the profile page for
 * changing the selected user in real time.
 */
export const selectedUserId = writable('');

/**
 * @description Store for the search results that is used to
 * display the search results in real time.
 */
export const searchResults = writable([]);