import { useEffect, useState } from "react"
import { getReplies } from "../firestore"
import Comment from "./Comment"

function Replies({ label, parentComment, mounted = false, newReplies }) {
    const [fetched, setFetched] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [repliesSlot, setRepliesSlot] = useState(null)

    const handleGetReplies = async (parentCommentID) => {
        const replies = await getReplies(parentCommentID)
        setFetched(true)
        setRepliesSlot(replies.map((reply) => {
            return (
                <Comment comment={reply} key={reply.id} />
            )
        }))
    }

    return (
        <>
            <button className='comment-replies-btn' onClick={async () => {
                setExpanded(!expanded)
                if (!fetched) {
                    await handleGetReplies(parentComment.id)
                    mounted(true)
                }
                else
                    document.getElementById(parentComment.id).style.display = expanded ? 'none' : 'inherit'
            }}>
                {!expanded ? '\u23F7' : '\u23F6'} {label}
            </button>
            <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                <ul id={parentComment.id} className='list' style={{ display: 'inherit' }} >
                    {newReplies}
                    {repliesSlot}
                </ul>
            </div>
        </>
    )
}

export default Replies