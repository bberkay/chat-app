export function load({ cookies }: {cookies: any}): {theme: "light" | "dark"}
{
    let theme = cookies.get('theme');

    // If the theme is not defined, set the theme to dark
    if (!theme) {
        theme = 'dark';
        cookies.set('theme', theme, { path: '/' });
    }

    return {
        theme: theme
    };
};
