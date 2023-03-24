import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByUserID } from "../firestore";
import parse from 'html-react-parser';

function UserCommentsList() {
    const { userID } = useParams();

    const [comments, setComments] = useState([]);
    const [moreComments, setMoreComments] = useState(false);

    useEffect(() => {
        const handleGetUserComments = async () => {
            const commentsData = await getCommentsByUserID(userID);
            if (commentsData[10]) {
                commentsData.pop();
                setMoreComments(true);
            }
            setComments(commentsData);
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
    });

    return (
        <>
            <div className='comments list mt20'>
                {comments.map((comment) => {
                    return (
                        <div key={comment.id} className='mt20'>
                            {parse(comment.description)}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default UserCommentsList;