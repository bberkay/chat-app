import { MongoDB } from '$lib/database/mongodb';
import type { User } from '$lib/database/types';

export async function load({ cookies }: {cookies: any}): Promise<{theme: string, users: Array<User>, profile: User}>
{
    // Get all users from the database
    const db = new MongoDB();
    const users = await db.getAllDocuments('users');
    users.map((user: User) => {
        user._id = user._id.toString();
    });

    // Get the profile from the cookies. If the profile is not defined, set the profile to the first user
    let profile = cookies.get('profile');
    if (!profile || profile === 'undefined') {
        profile = JSON.stringify(users[0]);
        cookies.set('profile', profile, { path: '/' });
    }

    // Get the theme from the cookies
    let theme = cookies.get('theme');

    // If the theme is not defined, set the theme to dark
    if (!theme) {
        theme = 'dark';
        cookies.set('theme', theme, { path: '/' });
    }

    return {
        theme: theme,
        users: users,
        profile: JSON.parse(profile)
    };
}
