import { setPageTitle } from "../utils"

function About() {
    setPageTitle('About')

    return (
        <div className='grid-container'>
            <h2>About</h2>
            <p>A discussion/image board site inpsired by Reddit/4chan.</p>
        </div>
    )
}

export default About