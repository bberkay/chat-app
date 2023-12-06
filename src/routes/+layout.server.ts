import { MongoDB } from '$lib/database/mongodb';

export async function load({ cookies }: {cookies: any}): Promise<{theme: string, users: Array<{name: string, avatar: string}>}>
{
    // Get all users from the database
    const db = new MongoDB();
    const users = await db.getAllDocuments('users');

    // Get the theme from the cookies
    let theme = cookies.get('theme');

    // If the theme is not defined, set the theme to dark
    if (!theme) {
        theme = 'dark';
        cookies.set('theme', theme, { path: '/' });
    }

    return {
        theme: theme,
        users: users
    };
}
