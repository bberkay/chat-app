import { writable } from 'svelte/store';

/**
 * @description Store for the search results that is used to
 * display the search results in real time.
 */
export const searchResults = writable([]);