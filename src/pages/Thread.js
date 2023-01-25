import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from "react"
import NotFound from '../components/NotFound'
import parse from 'html-react-parser'
import { Timestamp } from 'firebase/firestore'
import { getThread, getComments, postComment } from '../firestore'
import RichTextBox from '../components/RichTextBox'
import '../App.css'
import { timeSince } from '../utils'
import CircularProgress from '@mui/material/CircularProgress'

function Thread() {
    const { threadID } = useParams()
    const [thread, setThread] = useState()
    const [loading, setLoading] = useState(true)

    const [expandCommentBox, setExpandCommentBox] = useState(false)
    const [comment, setComment] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    const [comments, setComments] = useState([])

    const handleGetThread = async () => {
        const threadData = await getThread(threadID)
        setThread(threadData)
    }

    const handleGetComments = async () => {
        const commentsData = await getComments(threadID)
        setComments(commentsData)
    }

    const loadData = async () => {
        await handleGetThread()
        await handleGetComments()
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const toggleCommentBox = () => {
        setExpandCommentBox(!expandCommentBox)
    }

    const handleSubmitComment = async () => {
        const res = await postComment({
            description: comment,
            threadID: threadID,
            childrenIDs: [],
            parentID: null,
            createdAt: Timestamp.fromDate(new Date())
        })
        setComments([res, ...comments])
        setExpandCommentBox(false)
        setComment(null)
        setSubmitLoading(false)
    }

    const commentInvalid = () => { // Description validation detailed in '../components/RichTextBox'
        if (comment === null)
            return true
        return false
    }

    if (loading)
        return

    if (!thread)
        return <NotFound error={"Thread does not exist"} />

    return (
        <div>
            <h3>{thread.title}</h3>
            <p>{thread.date}</p>
            {parse(thread.description)}
            <h3 style={{ marginTop: '30px' }}>
                {comments.length || '0'} Comment{comments.length !== 1 ? 's' : ''}
            </h3>
            {
                !expandCommentBox &&
                <div className='comment-box-unexpanded' onClick={toggleCommentBox}>
                    Leave a comment
                </div>
            }
            {
                expandCommentBox &&
                <div className={`comment-box ${submitLoading ? 'disabled-input' : ''}`}>
                    <RichTextBox
                        getContent={(value) => setComment(value)}
                        placeholderText={'Leave a comment'}
                        autofocus={true}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CircularProgress
                            size={30}
                            style={{
                                color: 'lightgray', marginTop: '15px', marginRight: '10px',
                                visibility: submitLoading ? 'visible' : 'hidden',
                            }}
                        />
                        <button
                            style={{ marginRight: '10px' }}
                            onClick={() => { handleSubmitComment(); setSubmitLoading(true) }}
                            disabled={commentInvalid()}
                        >
                            Submit
                        </button>
                        <button onClick={() => { toggleCommentBox(); setComment(null) }}>
                            Cancel
                        </button>
                    </div>
                </div>
            }
            {
                comments &&
                <ul className='list'>
                    {comments.map((comment) =>
                        <li key={comment.id} style={{ marginTop: '30px' }}>
                            {parse(comment.description)}
                            <span style={{ fontSize: '12px' }} title={comment.date}>{timeSince(comment.createdAt.toDate())}</span>
                        </li>
                    )}
                </ul>
            }
        </div >
    )
}

export default Thread