import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import NotFound from '../components/NotFound';
import { getForum } from '../firestore';
import '../App.css';
import { setPageTitle } from "../utils";

function Forum() {
    const [forum, setForum] = useState();
    const [loading, setLoading] = useState(true);
    const { forumURL } = useParams();
    const { threadID } = useParams();
    const location = useLocation();

    useEffect(() => {
        const handleGetForum = async () => {
            const data = await getForum(forumURL);
            setForum(data);
            setLoading(false);
        };
        handleGetForum();
    }, [forumURL]);

    useEffect(() => {
        if (forum)
            setPageTitle(forum.title);
    }, [forum, threadID]);

    if (loading)
        return;

    if (!forum)
        return <NotFound error={"Board does not exist"} />;

    return (<>
        <div className='left-column'>
            <h2>
                <Link style={{ color: 'black', textDecoration: 'none' }} to={`/${forum.id}`}>
                    {forum.title}
                    <img src={forum.logo} alt='logo' className='forum-logo center-img'></img>
                </Link>
            </h2>
            <p>{forum.description}</p>
            <Link to={`/${forumURL}/post`} state={{ postModalBackground: location }} tabIndex={-1}>
                <button style={{ width: '100%' }}>
                    Post Thread
                </button>
            </Link>
        </div>
        <div className='flex'>
            <div className='spacer' />
            <div className='main-column'>
                <Outlet />
                <div id='bottom' className='column-bottom' />
            </div>
        </div>
    </>);
}

export default Forum;