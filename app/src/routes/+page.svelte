<section id = "home">
    <h1>Welcome</h1>
    <p>
        This is a simple chat application with SvelteKit, Bun, and MongoDB. It's designed to demonstrate how these technologies can seamlessly
        integrate to create a real-time, user-friendly chat experience as easily as possible.
    </p>
    <p>
        <b>Tip: </b> To testing real-time chat, open this page on another browser/device and sync them with the session ID in the profile section
        at the bottom left of the app.
    </p>
    <i><a href = "https://github.com/bberkay/sveltekit-bun-mongodb" target = "_blank">For more information and source code...</a></i>
</section>

<style>
    #home{
        padding: 1rem 1rem 1rem 3rem;
        line-height: 1.5rem;
    }

    #home h1{
        font-size: 3rem;
        margin-bottom: 3rem;
    }

    @media only screen and (min-width: 768px) {
        #home{
            width:40%;
        }
    }

    @media only screen and (max-width: 769px) {
        #home{
            width:100%;
        }
    }
</style>