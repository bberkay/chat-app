export function load({ cookies }) {
    let theme = cookies.get('theme');

    // If the theme is not defined, set the theme to dark
    if (!theme) {
        theme = 'dark';
        cookies.set('theme', theme, { path: '/' });
    }

    return {
        theme: theme
    };
}