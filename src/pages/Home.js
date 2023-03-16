import ForumList from "../components/ForumList";
import { setPageTitle } from "../utils";

function Home() {
    setPageTitle();

    return (
        <div className='home-page-logo'>
            <div className='mw700'>
                <h1>Boards:</h1>
                <ForumList />
            </div>
        </div>
    );
}

export default Home;