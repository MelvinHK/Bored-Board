import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { createContext, useEffect, useState } from "react";
import NotFound from '../components/NotFound';
import parse from 'html-react-parser';
import { getThread, getComments, getComment } from '../firestore';
import '../App.css';
import Comment from '../components/Comment';
import CommentRichTextBox from '../components/CommentRichTextBox';
import { setPageTitle } from '../utils';
import { useAuth } from '../auth';

export const ThreadContext = createContext();

function Thread() {
    const { threadID } = useParams();
    const { commentID } = useParams();

    const [thread, setThread] = useState();
    const [dataLoading, setDataLoading] = useState(true);

    const [expandCommentBox, setExpandCommentBox] = useState(false);

    const [comments, setComments] = useState([]);
    const [queried, setQueried] = useState(false);
    const [moreComments, setMoreComments] = useState(false);

    const { user, userLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleGetThread = async () => {
            const threadData = await getThread(threadID);
            setThread(threadData);
        };

        const handleGetComments = async () => {
            if (commentID) {
                var commentsData = await getComment(commentID);
                if (!commentsData || commentsData[0].threadID !== threadID)
                    return setComments(null);
                else
                    setQueried(true);
            } else
                commentsData = await getComments(threadID);
            if (commentsData[10]) {
                commentsData.pop();
                setMoreComments(true);
            }
            setComments(commentsData);
        };

        const loadData = async () => {
            await handleGetThread();
            await handleGetComments();
            setDataLoading(false);
        };

        setQueried(false);
        loadData();
    }, [commentID, threadID]);

    useEffect(() => {
        if (thread) setPageTitle(thread.title);
    }, [thread]);

    const getMoreComments = async () => {
        if (moreComments) {
            const nextComments = await getComments(threadID, comments[comments.length - 1].id);
            if (nextComments.length < 11)
                setMoreComments(false);
            setComments(comments.concat(nextComments));
        }
    };

    useEffect(() => {
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                    getMoreComments();
            });
        });
        observer.observe(document.getElementById('bottom'));
        return () => observer.disconnect();
    });

    if (dataLoading)
        return;

    if (!thread)
        return <NotFound error={"Thread does not exist"} />;

    return !userLoading && (
        <ThreadContext.Provider value={thread}>
            {/* Thread content */}
            <h3 className='mt0 mb10'>{thread.title}</h3>
            <p className='mb30 gray'>
                <Link to={`/user/${thread.authorID}`} className='button-link'>{thread.author}</Link> {'\u2022'} {thread.date}</p>
            {thread.imageURL &&
                <a href={thread.imageURL} target='_blank' rel='noopener noreferrer'>
                    <img className='center-img' src={thread.imageURL} alt='thread img' />
                </a>}
            {thread.description && parse(thread.description)}

            {/* Comments counter */}
            <h4 className='mt30'>
                {thread.totalComments} Comment{thread.totalComments !== 1 && 's'}
            </h4>

            {/* Leave a comment on the thread */}
            {!expandCommentBox ?
                <button className='comment-box-unexpanded'
                    onClick={() => {
                        if (user)
                            setExpandCommentBox(true);
                        else
                            navigate('/login', { state: { modalBackground: location } });
                    }}>
                    Leave a comment
                </button>
                :
                <CommentRichTextBox
                    expand={(value) => setExpandCommentBox(value)}
                    onSubmitted={(value) => {
                        setComments([value, ...comments]);
                    }}
                />}

            {/* Comments list */}
            {comments ?
                <div className='comments list mt20'>
                    {comments.map((comment) => {
                        return (
                            <div key={comment.id} className='mt20'>
                                <Comment comment={comment} />
                            </div>
                        );
                    })}
                </div>
                :
                <p className='mt30'>Comment does not exist. The URL is incorrect or the comment was deleted.</p>}

            {/* If thread is being viewed from a shared-comment link: */}
            {queried &&
                <Link to='./' tabIndex={-1}>
                    <button className='button-link'>
                        View full thread
                    </button>
                </Link>}
        </ThreadContext.Provider>
    );
}

export default Thread;