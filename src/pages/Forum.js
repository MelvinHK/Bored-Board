import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import NotFound from '../components/NotFound';
import { getForum } from '../firestore';
import '../App.css';
import { setPageTitle } from "../utils";
import { useAuth } from "../auth";

function Forum() {
    const [forum, setForum] = useState();
    const [dataLoading, setDataLoading] = useState(true);
    const { forumURL } = useParams();
    const { threadID } = useParams();
    const location = useLocation();

    const { user, userLoading } = useAuth();

    useEffect(() => {
        const handleGetForum = async () => {
            const data = await getForum(forumURL);
            setForum(data);
            setDataLoading(false);
        };
        handleGetForum();
    }, [forumURL]);

    useEffect(() => {
        if (forum)
            setPageTitle(forum.title);
    }, [forum, threadID]);

    if (dataLoading)
        return;

    if (!forum)
        return <NotFound error={"Board does not exist"} />;

    return !userLoading && (<>
        <div className='left-column'>
            <h2>
                <Link style={{ color: 'black', textDecoration: 'none' }} to={`/${forum.id}`}>
                    {forum.title}
                    <img src={forum.logo} alt='logo' className='forum-logo center-img'></img>
                </Link>
            </h2>
            <p>{forum.description}</p>
            <Link to={user ? `/${forumURL}/post` : '/login'}
                state={{ modalBackground: location }} className='btn a-btn w100'>
                Post Thread
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