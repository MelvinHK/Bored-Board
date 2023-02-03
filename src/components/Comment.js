import { timeSince } from "../utils"
import parse from 'html-react-parser'
import Replies from "./Replies"
import { useState } from "react"
import ReplyIcon from '@mui/icons-material/Reply';
import '../App.css'
import CommentRichTextBox from "./CommentRichTextBox";

function Comment({ comment }) {
    const [showTooltip, setShowTooltip] = useState(false)
    const [expandCommentBox, setExpandCommentBox] = useState(false)
    const [totalReplies, setTotalReplies] = useState(comment.totalReplies)

    const [repliesMounted, setRepliesMounted] = useState(false)
    const [newReplies, setNewReplies] = useState([])

    return (
        <>
            <li onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <span className='comment-header'>
                    <span title={comment.date}>
                        {timeSince(comment.createdAt.toDate())}
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
                    submittedComment={(value) => {
                        setTotalReplies(totalReplies + 1)
                        if (repliesMounted)
                            setNewReplies([value, ...newReplies])
                    }}
                />}
            {totalReplies > 0 ?
                <Replies
                    parentComment={comment}
                    mounted={(value) => setRepliesMounted(value)}
                    label={`${totalReplies} repl${totalReplies === 1 ? 'y' : 'ies'}`}
                    newReplies={newReplies.map((reply) => <Comment comment={reply} />)}
                />
                : ''
            }
        </>
    )
}

export default Comment