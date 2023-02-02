import { timeSince } from "../utils"
import parse from 'html-react-parser'
import Replies from "./Replies"
import { useState } from "react"
import ReplyIcon from '@mui/icons-material/Reply';
import '../App.css'

function Comment({ comment }) {
    const replyLength = comment.childrenIDs.length

    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <>
            <li onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <span className='comment-header'>
                    <span title={comment.date}>
                        {timeSince(comment.createdAt.toDate())}
                    </span>
                    <span style={{ visibility: showTooltip ? 'visible' : 'hidden', cursor: 'pointer' }}>
                        <ReplyIcon className='reply-btn' fontSize='small'/>
                        Reply
                    </span>
                </span>
                {parse(comment.description)}
            </li>
            {replyLength > 0 ?
                <Replies parentComment={comment}
                    label={`${replyLength} repl${replyLength === 1 ? 'y' : 'ies'}`} />
                : ''
            }
        </>
    )
}

export default Comment