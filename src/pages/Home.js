import ForumList from "../components/ForumList";

function Home() {
    return (
        <div className='home-page-logo'>
            <h1>Boards:</h1>
            <ForumList />
        </div>
    )
}

export default Home;