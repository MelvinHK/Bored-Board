import { timeSince } from "../utils"
import parse from 'html-react-parser'
import Replies from "./Replies"
import { useState } from "react"
import ReplyIcon from '@mui/icons-material/Reply';
import '../App.css'
import CommentRichTextBox from "./CommentRichTextBox";

function Comment({ comment }) {
    var [numReplies, setNumReplies] = useState(comment.childrenIDs.length)

    const [showTooltip, setShowTooltip] = useState(false)
    const [expandCommentBox, setExpandCommentBox] = useState(false)

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
                        setNumReplies(numReplies += 1)
                    }}
                />}
            {numReplies > 0 ?
                <Replies parentComment={comment}
                    label={`${numReplies} repl${numReplies === 1 ? 'y' : 'ies'}`} />
                : ''
            }
        </>
    )
}

export default Comment