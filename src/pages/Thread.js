import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import NotFound from '../components/NotFound'
import parse from 'html-react-parser'
import { getThread, getComments, getTotalComments, getComment } from '../firestore'
import '../App.css'
import Comment from '../components/Comment'
import CommentRichTextBox from '../components/CommentRichTextBox'
import { setPageTitle } from '../utils'

function Thread() {
    const { threadID } = useParams()
    const { commentID } = useParams()
    const navigate = useNavigate()

    const [thread, setThread] = useState()
    const [loading, setLoading] = useState(true)

    const [expandCommentBox, setExpandCommentBox] = useState(false)

    const [comments, setComments] = useState([])
    const [totalComments, setTotal] = useState(0)
    const [queried, setQueried] = useState(false)

    const handleGetThread = async () => {
        const threadData = await getThread(threadID)
        setThread(threadData)
    }

    const handleGetComments = async () => {
        if (commentID) {
            var commentsData = await getComment(commentID)
            if (!commentsData || commentsData[0].threadID !== threadID)
                return setComments(null)
            else
                setQueried(true)
        } else
            var commentsData = await getComments(threadID)
        setComments(commentsData)
    }

    const handleGetTotalComments = async () => {
        const total = await getTotalComments(threadID)
        setTotal(total)
    }

    const loadData = async () => {
        await handleGetThread()
        await handleGetComments()
        await handleGetTotalComments()
        setLoading(false)
    }

    useEffect(() => {
        setQueried(false)
        loadData()
    }, [commentID])

    useEffect(() => {
        if (thread) setPageTitle(thread.title)
    }, [thread])

    // Root comments bottomless scrolling
    window.onscroll = async (ev) => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            const nextComments = await getComments(threadID, comments[comments.length - 1].id)
            if (!nextComments)
                return
            setComments(comments.concat(nextComments))
        }
    }

    if (loading)
        return

    if (!thread)
        return <NotFound error={"Thread does not exist"} />

    return (
        <>
            <h3>{thread.title}</h3>
            <p>{thread.date}</p>
            {parse(thread.description)}
            <h3 style={{ marginTop: '30px' }}>
                {totalComments} Comment{totalComments !== 1 && 's'}
            </h3>
            {!expandCommentBox &&
                <div className='comment-box-unexpanded' onClick={() => setExpandCommentBox(true)}>
                    Leave a comment
                </div>}
            {expandCommentBox &&
                <CommentRichTextBox
                    expand={(value) => setExpandCommentBox(value)}
                    onSubmitted={(value) => {
                        setComments([value, ...comments])
                    }}
                />}
            {comments ?
                <ul className='list'>
                    {comments.map((comment) => {
                        return (
                            <div key={comment.id} style={{ marginTop: '30px' }}>
                                <Comment comment={comment} />
                            </div>
                        )
                    })}
                </ul>
                :
                <p style={{ marginTop: '30px' }}>Comment does not exist</p>
            }
            {queried ?
                <p onClick={() => { navigate(`./`) }} className='gray-link' style={{ marginTop: '30px' }}>
                    View full thread
                </p>
                : ''}
        </>
    )
}

export default Thread