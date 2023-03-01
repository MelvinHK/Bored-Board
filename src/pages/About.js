import { setPageTitle } from "../utils"

function About() {
    setPageTitle('About')

    return (<div style={{ maxWidth: '700px' }}>
        <h2>About</h2>
        <p>Bored Bored is a simple messsage board site where anyone can post comments and share images.
            A variety of discussion boards with dedicated topics are available ranging from anime, videogames, etc.</p>

        <h3>Anonymous Posting</h3>
        <p>All posting is anonymous, so account registration is not available.
            Instead, by default, users post under the username, 'Anonymous'.
            You may still input any username you wish to author yourself as.</p>
        <p>If you wish to uniquely identify yourself, a tripcode can be appended to the end of your username.
            Following your username input, add a hashtag followed by your desired password (i.e. username#password).
            Upon submission, a hash of the password is generated and appended to the username, which can be used to help identify users.</p>

        <h3>Posting Requirements</h3>
        <p>When posting a thread, a title and an attached image is required. When commenting, an image is not required.</p>
    </div>)
}

export default About