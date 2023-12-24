export async function POST({ request, cookies }: {request: Request, cookies: any}): Promise<any>
{
    try
    {
        // Get the body from the request
        const currentTheme = cookies.get("theme");

        // Set the profile cookie to the selected user
        cookies.set('theme', currentTheme === "dark" ? "light" : "dark", { path: '/' });

        // Return a 200 response
        return new Response("Theme changed successfully.", {
            status: 200,
        });
    }
    catch (e)
    {
        console.error(e);
        return new Response("Failed to set theme.", { status: 500 });
    }
}