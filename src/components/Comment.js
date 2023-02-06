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
    const [totalReplies, setTotalReplies] = useState(0)

    const [submittedReplies, setSubmittedReplies] = useState([])

    useEffect(() => {
        setTotalReplies(comment.totalReplies)
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
                    onSubmitted={(res) => {
                        setSubmittedReplies([...submittedReplies, res])
                    }}
                />}
            {totalReplies > 0 &&
                <Replies
                    parentComment={comment}
                    label={`${totalReplies} repl${totalReplies === 1 ? 'y' : 'ies'}`}
                    ignoreSubmittedReplies={submittedReplies}
                />}
            {submittedReplies.length > 0 &&
                <div style={{ marginLeft: '20px' }}>
                    {submittedReplies.map((reply) =>
                        <Comment comment={reply} key={reply.id} />
                    )}
                </div>}
        </>
    )
}

export default Comment