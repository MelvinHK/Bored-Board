import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import parse from 'html-react-parser';

import { timeSince } from "../utils";
import Replies from "./Replies";
import '../App.css';

import ReplyIcon from '@mui/icons-material/Reply';
import CommentRichTextBox from "./CommentRichTextBox";
import LinkIcon from '@mui/icons-material/Link';
import { useAuth } from "../auth";
import { deleteComment } from "../firestore";

function Comment({ comment }) {
    const { forumURL } = useParams();
    const { threadID } = useParams();

    const [expandCommentBox, setExpandCommentBox] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [shareText, setShareText] = useState('Share');
    const [editing, setEditing] = useState(false);

    const [author, setAuthor] = useState(null);
    const [date, setDate] = useState(null);
    const [edited, setEdited] = useState(null);
    const [description, setDescription] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [totalReplies, setTotalReplies] = useState(0);
    const [expandComment, setExpandComment] = useState(true);
    const [deleted, setDeleted] = useState(false);

    const [submittedReplies, setSubmittedReplies] = useState([]);

    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setAuthor(comment.author ? comment.author : 'Deleted post');
        setDate(timeSince(comment.createdAt.toDate()));
        setEdited(comment.edited ? '(edited)' : '');
        if (comment.description)
            setDescription(parse(comment.description));
        setImageURL(comment.imageURL);
        setTotalReplies(comment.totalReplies);
    }, [comment]);

    const handleDelete = async () => {
        if (!window.confirm('Delete comment?'))
            return;
        try {
            await deleteComment(comment);
            setAuthor('Deleted post');
            setEdited('');
            setDescription(parse('<p>[deleted]</p>'));
            setImageURL(null);
            setDeleted(true);
        } catch (error) {
            console.log('Error deleting comment: ', error);
        }
    };

    return (<>
        <div onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => { setShowTooltip(false); setShareText('Share'); }}>

            {/* Header */}
            <span className={`f12 flex f-center gray ${!expandComment ? 'mb10 lighten' : ''}`}>

                {/* Hide */}
                <button title={expandComment ? 'Hide' : 'Show'} className='button-link f12 fmono mr5' style={{ height: '20px' }}
                    onClick={() => setExpandComment(!expandComment)}>
                    {expandComment ? '[-]' : '[+]'}
                </button>

                {/* Name/Date */}
                <Link to={`/user/${comment.authorID}`}
                    className={`button-link bold ${expandComment ? '' : 'lighten'} `}>{author}</Link>
                <span title={comment.date}>&nbsp;{date} {edited}</span>

                <span className='flex f-center' style={{ opacity: showTooltip ? '100' : '0' }}>

                    {/* Reply */}
                    <button className={`${expandComment ? 'button-link f12 flex f-center ml10' : 'd-none'}`}
                        onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}
                        onClick={() => {
                            if (user) {
                                setExpandCommentBox(true);
                                setEditing(false);
                            } else
                                navigate('/login', { state: { modalBackground: location } });
                        }}>
                        <ReplyIcon fontSize='small' />&nbsp;Reply
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

                    {!deleted && user && user.uid === comment.authorID && <>
                        {/* Edit */}
                        <button className={`${expandComment ? 'button-link f12 ml10' : 'd-none'}`}
                            style={{ height: '20px' }}
                            onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}
                            onClick={() => { setEditing(true); setExpandCommentBox(false); }}>
                            Edit
                        </button>

                        {/* Delete */}
                        <button className={`${expandComment ? 'button-link f12 ml10' : 'd-none'}`}
                            style={{ height: '20px' }}
                            onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}
                            onClick={() => handleDelete()}>
                            Delete
                        </button>
                    </>}
                </span>
            </span>

            {/* Content */}
            <span className={`${expandComment ? '' : 'd-none'}`}>
                {imageURL &&
                    <a href={imageURL} target='_blank' rel='noopener noreferrer'
                        className={`${expandComment ? '' : 'd-none'}`}>
                        <img className='comment-img' src={imageURL} alt='comment img' />
                    </a>}

                {!editing &&
                    description}
            </span>
        </div>
        <span className={`${expandComment ? '' : 'd-none'}`}>

            {/* Edit Box */}
            {editing && <div className='mb10'>
                <CommentRichTextBox
                    expand={(value) => setEditing(value)}
                    commentID={comment.id}
                    onSubmitted={(updatedComment) => { setDescription(parse(updatedComment)); setEdited('(edited)'); }}
                    placeholderText='Edit comment'
                    imageDisabled={true}
                    editContent={comment.description}
                /></div>}

            {/* Reply Box */}
            {expandCommentBox && <div className='mb10'>
                <CommentRichTextBox
                    expand={(value) => setExpandCommentBox(value)}
                    parentID={comment.id}
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