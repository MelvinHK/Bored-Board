import { timeSince } from "../utils"
import parse from 'html-react-parser'
import Replies from "./Replies"
import { useEffect, useState } from "react"
import ReplyIcon from '@mui/icons-material/Reply';
import '../App.css'
import CommentRichTextBox from "./CommentRichTextBox";

function Comment({ comment }) {
    const [showTooltip, setShowTooltip] = useState(false)
    const [expandCommentBox, setExpandCommentBox] = useState(false)

    const [date, setDate] = useState(null)
    const [totalReplies, setTotalReplies] = useState(comment.totalReplies)

    const [repliesMounted, setRepliesMounted] = useState(false)
    const [newReplies, setNewReplies] = useState([])

    useEffect(() => {
        setDate(timeSince(comment.createdAt.toDate()))
    }, [])

    return (
        <>
            <li onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <span className='comment-header'>
                    <span title={comment.date}>
                        {date}
                    </span>
                    <span style={{ visibility: showTooltip ? 'visible' : 'hidden', cursor: 'pointer' }}
                        onClick={() => setExpandCommentBox(true)}>
                        <ReplyIcon className='reply-btn' fontSize='small' />
                        Reply
                    </span>
                </span>
                {parse(comment.description)}
            </li>
            {expandCommentBox &&
                <CommentRichTextBox
                    expand={(value) => setExpandCommentBox(value)}
                    parentCommentID={comment.id}
                    onSubmitted={(value) => {
                        setTotalReplies(totalReplies + 1)
                        // If replies have already been loaded, render the new reply from newReplies state
                        if (repliesMounted)
                            setNewReplies([...newReplies, value])
                    }}
                />}
            {totalReplies > 0 ?
                <Replies
                    parentComment={comment}
                    mounted={(value) => setRepliesMounted(value)}
                    label={`${totalReplies} repl${totalReplies === 1 ? 'y' : 'ies'}`}
                    newRepliesSlot={newReplies.map((reply) => <Comment comment={reply} />)}
                />
                : ''
            }
        </>
    )
}

export default Comment