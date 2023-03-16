import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import parse from 'html-react-parser';

import { timeSince } from "../utils";
import Replies from "./Replies";
import '../App.css';

import ReplyIcon from '@mui/icons-material/Reply';
import CommentRichTextBox from "./CommentRichTextBox";
import LinkIcon from '@mui/icons-material/Link';
import { useAuth } from "../auth";

function Comment({ comment }) {
    const { forumURL } = useParams();
    const { threadID } = useParams();

    const [expandCommentBox, setExpandCommentBox] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [shareText, setShareText] = useState('Share');

    const [date, setDate] = useState(null);
    const [totalReplies, setTotalReplies] = useState(0);
    const [expandComment, setExpandComment] = useState(true);

    const [submittedReplies, setSubmittedReplies] = useState([]);

    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        setTotalReplies(comment.totalReplies);
        setDate(timeSince(comment.createdAt.toDate()));
    }, [comment]);

    return (<>
        <li onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => { setShowTooltip(false); setShareText('Share'); }}>

            {/* Header */}
            <span className={`f12 flex f-center gray ${!expandComment ? 'mb10' : ''}`}>
                <span>
                    <span className='author'>{comment.author}</span> <span title={comment.date}>{date}</span>
                </span>
                <span className='flex f-center' style={{ opacity: showTooltip ? '100' : '0' }}>

                    {/* Hide */}
                    <button className='button-link f12 flex f-center ml10' style={{ height: '20px' }}
                        onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}
                        onClick={() => setExpandComment(!expandComment)}>
                        {expandComment ? 'Hide' : 'Show'}
                    </button>

                    {/* Share */}
                    <button className={`${expandComment ? 'button-link f12 flex f-center ml10' : 'd-none'}`}
                        onFocus={() => setShowTooltip(true)} onBlur={() => { setShowTooltip(false); setShareText('Share'); }}
                        onClick={() => {
                            setShareText('Link copied!');
                            navigator.clipboard.writeText(`${window.location.origin}/${forumURL}/thread/${threadID}/comment/${comment.id}`);
                        }}>
                        <LinkIcon fontSize='small' />&nbsp;{shareText}
                    </button>

                    {/* Reply */}
                    {user ?
                        <button className={`${expandComment ? 'button-link f12 flex f-center ml10' : 'd-none'}`}
                            onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}
                            onClick={() => setExpandCommentBox(true)}>
                            <ReplyIcon fontSize='small' />&nbsp;Reply
                        </button>
                        :
                        <Link to='/login' state={{ postModalBackground: location, authError: 'You must log in to reply!' }}
                            className={`${expandComment ? 'button-link f12 flex f-center ml10 gray' : 'd-none'}`}>
                            <ReplyIcon fontSize='small' />&nbsp;Reply
                        </Link>}
                </span>
            </span>

            {/* Content */}
            <span className={`${expandComment ? '' : 'd-none'}`}>
                {comment.imageURL &&
                    <a href={comment.imageURL} target='_blank' rel='noopener noreferrer'
                        className={`${expandComment ? '' : 'd-none'}`}>
                        <img className='comment-img' src={comment.imageURL} alt='comment img' />
                    </a>}
                {parse(comment.description)}
            </span>
        </li>
        <span className={`${expandComment ? '' : 'd-none'}`}>

            {/* Comment Box */}
            {expandCommentBox && <div className='mb10'>
                <CommentRichTextBox
                    expand={(value) => setExpandCommentBox(value)}
                    parentCommentID={comment.id}
                    onSubmitted={(res) => {
                        setSubmittedReplies([...submittedReplies, res]);
                    }}
                    placeholderText='Leave a reply'
                /></div>}

            {/* No. Replies Button */}
            {totalReplies > 0 &&
                <Replies
                    parentComment={comment}
                    label={`${totalReplies} repl${totalReplies === 1 ? 'y' : 'ies'}`}
                    ignoreSubmittedReplies={submittedReplies}
                />}

            {/* Replies that the user just submitted are appended here */}
            {submittedReplies.length > 0 &&
                <div className='reply-line'>
                    {submittedReplies.map((reply) =>
                        <Comment comment={reply} key={reply.id} />
                    )}
                </div>}
        </span>
    </>);
}

export default Comment;