import { Global } from '$lib/classes/Global';
import type { User } from '$lib/types'

export async function load({ cookies }: {cookies: any}): Promise<{theme: string, users: Array<User>, profile: User}>
{
    // Get the profile from the cookies. If the profile is not defined, theme the profile to the first user
    let profile = cookies.get('profile');
    if (!profile || profile === 'undefined') {
        profile = JSON.stringify(Global.users[2]);
        cookies.set('profile', profile, { path: '/' });
    }

    // Get the theme from the cookies
    let theme = cookies.get('theme');

    // If the theme is not defined, theme the theme to dark
    if (!theme){
        theme = 'dark';
        cookies.set('theme', theme, { path: '/' });
    }

    return {
        theme: theme,
        users: Global.users.concat(Global.droid.toJSON()),
        profile: JSON.parse(profile)
    };
}