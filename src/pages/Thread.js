import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react"
import NotFound from '../components/NotFound'
import parse from 'html-react-parser'
import { getThread, getComments, getTotalComments } from '../firestore'
import '../App.css'
import Comment from '../components/Comment'
import CommentRichTextBox from '../components/CommentRichTextBox'

function Thread() {
    const { threadID } = useParams()
    const [thread, setThread] = useState()
    const [loading, setLoading] = useState(true)

    const [expandCommentBox, setExpandCommentBox] = useState(false)

    const [comments, setComments] = useState([])
    var [totalComments, setTotal] = useState(0)

    const handleGetThread = async () => {
        const threadData = await getThread(threadID)
        setThread(threadData)
    }

    const handleGetComments = async () => {
        const commentsData = await getComments(threadID)
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
        loadData()
    }, [])

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
                {totalComments} Comment{comments.length !== 1 ? 's' : ''}
            </h3>
            {!expandCommentBox &&
                <div className='comment-box-unexpanded' onClick={() => setExpandCommentBox(true)}>
                    Leave a comment
                </div>}
            {expandCommentBox &&
                <CommentRichTextBox expand={(value) => setExpandCommentBox(value)}
                    submittedComment={(value) => {
                        setComments([value, ...comments])
                    }}
                />}
            <ul className='list'>
                {comments.map((comment) => {
                    return (
                        <div key={comment.id} style={{ marginTop: '30px' }}>
                            <Comment comment={comment} />
                        </div>
                    )
                })}
            </ul>
        </>
    )
}

export default Thread