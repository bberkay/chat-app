import { Mongo } from '$lib/classes/Mongo';
import type { User } from '$lib/types';

export async function load({ cookies }: {cookies: any}): Promise<{theme: string, users: Array<User>, profile: User}>
{
    // Get all users from the classes
    const db = new Mongo();
    const users = await db.getAllUsers();
    users.map((user: User) => {
        user._id = user._id.toString();
    });

    // Get the profile from the cookies. If the profile is not defined, set the profile to the first user
    let profile = cookies.get('profile');
    if (!profile || profile === 'undefined') {
        profile = JSON.stringify(users[2]);
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
