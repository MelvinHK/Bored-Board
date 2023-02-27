import { useEffect, useState } from "react"
import { getReplies, replyAmount } from "../firestore"
import Comment from "./Comment"

function Replies({ label, parentComment, ignoreSubmittedReplies, expandDefault = false }) {
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

    const expandOnRender = async () => {
        await handleGetReplies(parentComment.id)
        setExpanded(true)
    }

    useEffect(() => {
        if (expandDefault)
            expandOnRender()
    }, [])

    return (<>
        <button className='button-link' onClick={async () => {
            setExpanded(!expanded)
            if (!fetched)
                await handleGetReplies(parentComment.id)
        }}>
            {!expanded ? '\u23F7' : '\u23F6'} {label}
        </button>
        <div className='reply-line mt10'>
            <ul className={`list ${expanded ? '' : 'd-none'}`}>
                {previousReplies.map((reply) => <Comment comment={reply} key={reply.id} />)}
                {replies.map((reply, index) => {
                    if (index === replyAmount - 1)
                        return (
                            <button
                                onClick={async () => {
                                    setReplies(replies.slice(0, -1))
                                    await handleGetReplies(parentComment.id, reply.id)
                                    setPreviousReplies(previousReplies.concat(replies))
                                }}
                                className='button-link'
                                key={reply.id}>
                                Show more replies
                            </button>
                        )
                    return (
                        <Comment comment={reply} key={reply.id} />
                    )
                })}
            </ul>
        </div>
    </>)
}

export default Replies