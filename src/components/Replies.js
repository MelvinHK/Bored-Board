import { useState } from "react"
import { getReplies } from "../firestore"
import { renderToStaticMarkup } from "react-dom/server"
import { timeSince } from "../utils"
import parse from 'html-react-parser'

function Replies({ children, rootComment }) {
    const [arrow, setArrow] = useState('\u23F7')
    const [fetched, setFetched] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const handleGetReplies = async (rootCommentID) => {
        const replies = await getReplies(rootCommentID)
        setFetched(true)
        document.getElementById(rootCommentID).innerHTML = renderToStaticMarkup(replies.map((reply) => {
            return (
                <li key={reply.id}>
                    <span className='comment-date' title={reply.date}>
                        {timeSince(reply.createdAt.toDate())}
                    </span>
                    {parse(reply.description)}
                </li>
            )
        }))
    }

    const toggleReplies = (rootCommentID) => {
        if (expanded)
            document.getElementById(rootCommentID).style.display = 'none'
        else
            document.getElementById(rootCommentID).style.display = 'inherit'
    }

    return (
        <div>
            <button className='comment-replies-btn' onClick={() => {
                setExpanded(!expanded)
                setArrow(!expanded ? '\u23F6' : '\u23F7')
                if (!fetched)
                    handleGetReplies(rootComment.id)
                else
                    toggleReplies(rootComment.id)
            }}>
                {arrow} {children}
            </button>
            <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                <ul id={rootComment.id}
                    className='list' style={{ display: 'inherit' }} />
            </div>
        </div>
    )
}

export default Replies