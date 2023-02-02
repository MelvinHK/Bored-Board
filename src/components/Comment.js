import { timeSince } from "../utils"
import parse from 'html-react-parser'
import Replies from "./Replies"

function Comment({ comment }) {
    const replyLength = comment.childrenIDs.length
    return (
        <li>
            <span className='comment-date' title={comment.date}>
                {timeSince(comment.createdAt.toDate())}
            </span>
            {parse(comment.description)}
            {replyLength > 0 ?
                <Replies parentComment={comment}
                    label={`${replyLength} repl${replyLength === 1 ? 'y' : 'ies'}`} />
                : ''
            }
        </li>
    )
}

export default Comment