import { timeSince } from "../utils"
import parse from 'html-react-parser'
import Replies from "./Replies"
import { useEffect, useState } from "react"
import ReplyIcon from '@mui/icons-material/Reply';
import '../App.css'
import CommentRichTextBox from "./CommentRichTextBox";
import LinkIcon from '@mui/icons-material/Link'
import { useParams } from "react-router-dom";

function Comment({ comment }) {
    const { forumURL } = useParams()
    const { threadID } = useParams()

    const [expandCommentBox, setExpandCommentBox] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const [shareText, setShareText] = useState('Share')

    const [date, setDate] = useState(null)
    const [totalReplies, setTotalReplies] = useState(0)

    const [submittedReplies, setSubmittedReplies] = useState([])

    useEffect(() => {
        setTotalReplies(comment.totalReplies)
        setDate(timeSince(comment.createdAt.toDate()))
    }, [])

    return (
        <>
            <li onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => { setShowTooltip(false); setShareText('Share') }}>
                <span className='comment-header'>
                    <span title={comment.date} >
                        {date}
                    </span>
                    <span style={{ opacity: showTooltip ? '100' : '0' }}>
                        <button className='button-link comment-tooltip'
                            onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}
                            onClick={() => setExpandCommentBox(true)}>
                            <ReplyIcon className='align-icon' fontSize='small' />
                            Reply
                        </button>
                        <button className='button-link comment-tooltip'
                            onFocus={() => setShowTooltip(true)} onBlur={() => { setShowTooltip(false); setShareText('Share') }}
                            onClick={() => {
                                setShareText('Link copied!')
                                navigator.clipboard.writeText(`${window.location.origin}/${forumURL}/thread/${threadID}/comment/${comment.id}`)
                            }}>
                            <LinkIcon className='align-icon' fontSize='small' />
                            {shareText}
                        </button>
                    </span>
                </span>
                {parse(comment.description)}
            </li>
            {
                expandCommentBox &&
                <CommentRichTextBox
                    expand={(value) => setExpandCommentBox(value)}
                    parentCommentID={comment.id}
                    onSubmitted={(res) => {
                        setSubmittedReplies([...submittedReplies, res])
                    }}
                    placeholderText='Leave a reply'
                />
            }
            {
                totalReplies > 0 &&
                <Replies
                    parentComment={comment}
                    label={`${totalReplies} repl${totalReplies === 1 ? 'y' : 'ies'}`}
                    ignoreSubmittedReplies={submittedReplies}
                />
            }
            {
                submittedReplies.length > 0 &&
                <div style={{ marginLeft: '20px' }}>
                    {submittedReplies.map((reply) =>
                        <Comment comment={reply} key={reply.id} />
                    )}
                </div>
            }
        </>
    )
}

export default Comment