import { setPageTitle } from "../utils";

function About() {
    setPageTitle('About');

    return (<div className='mw700'>
        <h2>About</h2>
        <p>Bored Bored is a simple messsage board site where you can post comments and share images.
            A few discussion boards with dedicated topics are available.</p>

        <h3>Posting Requirements</h3>
        <p>When posting a thread, a title and an attached image is required (jpeg, png, gif, &lt; 8mb). When commenting, an image is not required.</p>
    </div>);
}

export default About;