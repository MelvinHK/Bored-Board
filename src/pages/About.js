import { setPageTitle } from "../utils"

function About() {
    setPageTitle('About')

    return (<div style={{ maxWidth: '700px' }}>
        <h2>About</h2>
        <p>Bored Bored is a simple messsage board site where anyone can post comments and share images.
            A variety of discussion boards with dedicated topics are available ranging from anime, videogames, etc.</p>

        <h3>Posting Requirements</h3>
        <p>When posting a thread, a title and an attached image is required. When commenting, an image is not required.</p>
    </div>)
}

export default About