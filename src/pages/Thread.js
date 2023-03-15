import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import NotFound from '../components/NotFound';
import parse from 'html-react-parser';
import { getThread, getComments, getComment } from '../firestore';
import '../App.css';
import Comment from '../components/Comment';
import CommentRichTextBox from '../components/CommentRichTextBox';
import { setPageTitle } from '../utils';

function Thread() {
    const { threadID } = useParams();
    const { commentID } = useParams();

    const [thread, setThread] = useState();
    const [loading, setLoading] = useState(true);

    const [expandCommentBox, setExpandCommentBox] = useState(false);

    const [comments, setComments] = useState([]);
    const [queried, setQueried] = useState(false);
    const [moreComments, setMoreComments] = useState(false);

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
            setLoading(false);
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
    });

    if (loading)
        return;

    if (!thread)
        return <NotFound error={"Thread does not exist"} />;

    return (<>
        <h3 className='mt0 mb10'>{thread.title}</h3>
        <p className='mb30 gray'><span className='author'>{thread.author}</span> {thread.date}</p>
        {thread.imageURL &&
            <a href={thread.imageURL} target='_blank' rel='noopener noreferrer'>
                <img className='center-img' src={thread.imageURL} alt='thread img' />
            </a>}
        {thread.description && parse(thread.description)}
        <h4 className='mt30'>
            {thread.totalComments} Comment{thread.totalComments !== 1 && 's'}
        </h4>
        {!expandCommentBox ?
            <div className='comment-box-unexpanded'
                onClick={(e) => { if (e.type === 'click') setExpandCommentBox(true); }}>
                <span tabIndex={0} onFocus={() => setExpandCommentBox(true)} />
                Leave a comment
            </div>
            :
            <CommentRichTextBox
                expand={(value) => setExpandCommentBox(value)}
                onSubmitted={(value) => {
                    setComments([value, ...comments]);
                }}
            />}
        {comments ?
            <ul className='comments list mt20'>
                {comments.map((comment) => {
                    return (
                        <div key={comment.id} className='mt20'>
                            <Comment comment={comment} />
                        </div>
                    );
                })}
            </ul>
            :
            <p className='mt30'>Comment does not exist</p>}
        {queried &&
            <Link to='./' tabIndex={-1}>
                <button className='button-link'>
                    View full thread
                </button>
            </Link>}
    </>);
}

export default Thread;