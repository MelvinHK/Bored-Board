import ForumList from "../components/ForumList";
import { setPageTitle } from "../utils";

function Home() {
    setPageTitle()

    return (
        <div className='home-page-logo'>
            <h1>Boards:</h1>
            <ForumList />
        </div>
    )
}

export default Home;