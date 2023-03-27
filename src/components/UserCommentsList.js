import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCommentsByUserID } from "../firestore";
import { timeSince } from "../utils";
import parse from 'html-react-parser';
import '../App.css';

function UserCommentsList() {
    const { userID } = useParams();

    const [comments, setComments] = useState([]);
    const [moreComments, setMoreComments] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const handleGetUserComments = async () => {
            const commentsData = await getCommentsByUserID(userID);
            if (commentsData[10]) {
                commentsData.pop();
                setMoreComments(true);
            }
            setComments(commentsData);
            setDataLoading(false);
        };
        handleGetUserComments();
    }, [userID]);

    const getMoreComments = async () => {
        if (moreComments) {
            const nextComments = await getCommentsByUserID(userID, comments[comments.length - 1].id);
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

    if (comments.length === 0)
        return (
            <>
                <h3 className='mt10'>It's empty...</h3>
                <span className='f15'>No comments posted yet</span>
            </>
        );

    return (
        <>
            <div className='comments list'>
                {comments.map((comment) => {
                    return (
                        <div key={comment.id} className='mb20'>
                            <span className='f12 gray'>
                                <Link className='button-link' to={`/${comment.forumID}`}>/{comment.forumID}</Link>
                                <Link to={`/${comment.forumID}/thread/${comment.threadID}/comment/${comment.id}`}
                                    title={comment.date} className='button-link'>
                                    &nbsp;{timeSince(comment.createdAt.toDate())}
                                </Link>
                            </span>
                            {parse(comment.description)}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default UserCommentsList;