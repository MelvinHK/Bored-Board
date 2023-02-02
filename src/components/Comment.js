import { timeSince } from "../utils"
import parse from 'html-react-parser'
import Replies from "./Replies"
import { useState } from "react"
import ReplyIcon from '@mui/icons-material/Reply';

function Comment({ comment }) {
    const replyLength = comment.childrenIDs.length

    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <>
            <li onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <span className='comment-date' title={comment.date}>
                    {timeSince(comment.createdAt.toDate())}
                </span>
                <ReplyIcon style={{ visibility: showTooltip ? 'visible' : 'hidden' }} />
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