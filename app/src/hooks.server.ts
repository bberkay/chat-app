import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
    const theme = event.cookies.get("theme") || "system";
	return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%data-theme%', theme)
	});
};
