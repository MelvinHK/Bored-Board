import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { getThreadsByForumURL, getThreadsByUserID } from '../firestore';
import { timeSince } from "../utils";

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// import SearchIcon from '@mui/icons-material/Search';
import ImagePreview from "./ImagePreview";

function ThreadList() {
    const { forumURL } = useParams();
    const { userID } = useParams();
    const [threads, setThreads] = useState([]);
    const [moreThreads, setMoreThreads] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const handleGetThreads = async () => {
            if (forumURL)
                var data = await getThreadsByForumURL(forumURL);
            if (userID)
                data = await getThreadsByUserID(userID);
            if (data[10]) {
                data.pop();
                setMoreThreads(true);
            }
            setThreads(data);
            setDataLoading(false);
        };

        handleGetThreads();
    }, [forumURL, userID]);

    // Bottomless Scrolling
    const getMoreThreads = async () => {
        if (moreThreads) {
            if (forumURL)
                var nextThreads = await getThreadsByForumURL(forumURL, threads[threads.length - 1].id);
            if (userID)
                nextThreads = await getThreadsByUserID(userID, threads[threads.length - 1].id);
            if (nextThreads.length < 11)
                setMoreThreads(false);
            setThreads(threads.concat(nextThreads));
        }
    };

    useEffect(() => {
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                    getMoreThreads();
            });
        });
        observer.observe(document.getElementById('bottom'));
        return () => observer.disconnect();
    });

    if (dataLoading)
        return;

    if (threads.length === 0)
        return (
            <>
                <h3 className='mt10'>It's empty...</h3>
                <span className='f15'>No threads posted yet</span>
            </>
        );

    return (<>
        {/* <div className='flex f-center'>
            <SearchIcon className='p-abs ml10' color='action' />
            <input type='text' placeholder={'Search'} className='searchbar' />
        </div> */}
        <ul id='threadList' className='list'>
            {threads.map((thread) =>
                <li key={thread.id}>
                    <h4 className='mt30 mb10'>
                        <Link className='black-link' to={`/${thread.forumID}/thread/${thread.id}`}>
                            {thread.title}
                        </Link>
                    </h4>
                    <span className='flex f-start f-center f-wrap mt15 gray f15'>
                        {userID && // If thread list is on a user profile, show the forum it was posted in
                            <Link to={`/${thread.forumID}`} className='button-link'>/{thread.forumID}</Link>
                        }
                        {forumURL && // If thread list is on a forum, show the user it was posted by
                            <Link to={`/user/${thread.authorID}`} className='button-link'>{thread.author}</Link>
                        }
                        <span title={thread.date}>&nbsp;{'\u2022'} {timeSince(thread.createdAt.toDate())}</span>
                        <ChatBubbleOutlineIcon className='chat-icon' fontSize='small' />
                        {thread.totalComments}
                        {thread.imageURL && <ImagePreview imageURL={thread.imageURL} />}
                    </span>
                </li>
            )}
        </ul>
    </>);
}

export default ThreadList;