import { useState } from "react"
import { getReplies, replyAmount } from "../firestore"
import Comment from "./Comment"

function Replies({ label, parentComment, ignoreSubmittedReplies }) {
    const [fetched, setFetched] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const [replies, setReplies] = useState([])
    const [previousReplies, setPreviousReplies] = useState([])

    const handleGetReplies = async (parentCommentID, lastReplyID = undefined) => {
        const data = await getReplies(parentCommentID, lastReplyID)
        const filtered = data.filter((fetchedReply) =>
            !ignoreSubmittedReplies.find((ignoredReply) =>
                ignoredReply.id === fetchedReply.id
            ))
        setReplies(filtered)
        setFetched(true)
    }

    return (
        <>
            <button className='gray-link' onClick={async () => {
                setExpanded(!expanded)
                if (!fetched)
                    await handleGetReplies(parentComment.id)
                else
                    document.getElementById(parentComment.id).style.display = expanded ? 'none' : 'inherit'
            }}>
                {!expanded ? '\u23F7' : '\u23F6'} {label}
            </button>
            <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                <ul id={parentComment.id} className='list' style={{ display: 'inherit' }} >
                    {previousReplies.map((reply) => <Comment comment={reply} key={reply.id} />)}
                    {replies.map((reply, index) => {
                        if (index === replyAmount - 1)
                            return (
                                <span
                                    onClick={async () => {
                                        setReplies(replies.slice(0, -1))
                                        await handleGetReplies(parentComment.id, reply.id)
                                        setPreviousReplies(previousReplies.concat(replies))
                                    }}
                                    className='gray-link'
                                    key={reply.id}>
                                    Show more replies
                                </span>
                            )
                        return <Comment comment={reply} key={reply.id} />
                    })}
                </ul>
            </div>
        </>
    )
}

export default Replies