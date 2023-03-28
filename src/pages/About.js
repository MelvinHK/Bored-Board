import { setPageTitle } from "../utils";

function About() {
    setPageTitle('About');

    return (<div className='mw700'>
        <h1>About</h1>
        <p>Bored Bored is a simple messsage board site where you can post comments and share images.
            A few discussion boards with dedicated topics are available.</p>

        <h3>Posting Requirements</h3>
        <p>When posting a thread and commenting, a title and description/image is required.
            File types allowed: jpeg, png, gif, and &lt; 8mb. </p>

        <h3>Deletion Rules</h3>
        <p>Deleting a thread/comment with no replies removes it from the database.</p>
        <p>Otherwise, its associated account information is removed, and description replaced with [deleted].
            It may still be accessed via URL. Such deleted threads are not displayed in forums.</p>
    </div>);
}

export default About;