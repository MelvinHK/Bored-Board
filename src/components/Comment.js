import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import parse from 'html-react-parser'

import { timeSince } from "../utils"
import Replies from "./Replies"
import '../App.css'

import ReplyIcon from '@mui/icons-material/Reply';
import CommentRichTextBox from "./CommentRichTextBox";
import LinkIcon from '@mui/icons-material/Link'
import AddIcon from '@mui/icons-material/Add';

function Comment({ comment }) {
    const { forumURL } = useParams()
    const { threadID } = useParams()

    const [expandCommentBox, setExpandCommentBox] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const [shareText, setShareText] = useState('Share')

    const [date, setDate] = useState(null)
    const [totalReplies, setTotalReplies] = useState(0)
    const [expandComment, setExpandComment] = useState(true)

    const [submittedReplies, setSubmittedReplies] = useState([])

    useEffect(() => {
        setTotalReplies(comment.totalReplies)
        setDate(timeSince(comment.createdAt.toDate()))
    }, [])

    return (<>
        <li onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => { setShowTooltip(false); setShareText('Share') }}>
            <span className={`f12 flex f-center gray ${!expandComment ? 'mb10' : ''}`}>
                <span>
                    <span className='author'>{comment.author}</span> <span title={comment.date}>{date}</span>
                </span>
                <span className='flex f-center' style={{ opacity: showTooltip ? '100' : '0' }}>
                    <button className={`${expandComment ? 'button-link f12 flex f-center ml10' : 'd-none'}`}
                        onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}
                        onClick={() => setExpandCommentBox(true)}>
                        <ReplyIcon fontSize='small' />&nbsp;Reply
                    </button>
                    <button className={`${expandComment ? 'button-link f12 flex f-center ml10' : 'd-none'}`}
                        onFocus={() => setShowTooltip(true)} onBlur={() => { setShowTooltip(false); setShareText('Share') }}
                        onClick={() => {
                            setShareText('Link copied!')
                            navigator.clipboard.writeText(`${window.location.origin}/${forumURL}/thread/${threadID}/comment/${comment.id}`)
                        }}>
                        <LinkIcon fontSize='small' />&nbsp;{shareText}
                    </button>
                    <button className='button-link f12 flex f-center ml10' style={{ height: '20px' }}
                        onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}
                        onClick={() => setExpandComment(!expandComment)}>
                        {expandComment ? 'Hide' : 'Show'}
                    </button>
                </span>
            </span>
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
            {expandCommentBox && <div className='mb10'>
                <CommentRichTextBox
                    expand={(value) => setExpandCommentBox(value)}
                    parentCommentID={comment.id}
                    onSubmitted={(res) => {
                        setSubmittedReplies([...submittedReplies, res])
                    }}
                    placeholderText='Leave a reply'
                />
            </div>}
            {totalReplies > 0 &&
                <Replies
                    parentComment={comment}
                    label={`${totalReplies} repl${totalReplies === 1 ? 'y' : 'ies'}`}
                    ignoreSubmittedReplies={submittedReplies}
                    expandDefault={totalReplies < 6}
                />}
            {submittedReplies.length > 0 &&
                <div className='reply-line'>
                    {submittedReplies.map((reply) =>
                        <Comment comment={reply} key={reply.id} />
                    )}
                </div>}
        </span>
    </>)
}

export default Comment