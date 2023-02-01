import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react"
import NotFound from '../components/NotFound'
import parse from 'html-react-parser'
import { Timestamp } from 'firebase/firestore'
import { getThread, getComments, postComment, getTotalComments } from '../firestore'
import RichTextBox from '../components/RichTextBox'
import Replies from '../components/Replies'
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

    const handleSubmitComment = async () => {
        const res = await postComment({
            description: comment,
            threadID: threadID,
            childrenIDs: [],
            parentID: null,
            createdAt: Timestamp.fromDate(new Date())
        })
        setComments([res, ...comments])
        setTotal(totalComments += 1)
    }

    const commentInvalid = () => { // Description validation detailed in '../components/RichTextBox'
        return comment === null ? true : false
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
                {totalComments} Comment{comments.length !== 1 ? 's' : ''}
            </h3>
            {!expandCommentBox &&
                <div className='comment-box-unexpanded' onClick={() => setExpandCommentBox(true)}>
                    Leave a comment
                </div>}
            {expandCommentBox &&
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
                            onClick={async () => {
                                setSubmitLoading(true)
                                await handleSubmitComment()
                                setSubmitLoading(false)
                                setExpandCommentBox(false)
                                setComment(null)
                            }}
                            disabled={commentInvalid()}
                        >
                            Submit
                        </button>
                        <button onClick={() => { setExpandCommentBox(false); setComment(null) }}>
                            Cancel
                        </button>
                    </div>
                </div>}
            <ul className='list'>
                {comments.map((comment) => {
                    const replyLength = comment.childrenIDs.length
                    return (
                        <li key={comment.id} style={{ marginTop: '30px' }}>
                            <span className='comment-date' title={comment.date}>
                                {timeSince(comment.createdAt.toDate())}
                            </span>
                            {parse(comment.description)}
                            {replyLength > 0 ?
                                <Replies rootComment={comment}>
                                    {`${replyLength} repl${replyLength === 1 ? 'y' : 'ies'}`}
                                </Replies>
                                : ''
                            }
                        </li>
                    )
                })}
            </ul>
        </div >
    )
}

export default Thread