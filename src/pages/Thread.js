import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import NotFound from '../components/NotFound'
import parse from 'html-react-parser'
import { Timestamp } from 'firebase/firestore'
import { getThread, getComments, postComment, getReplies } from '../firestore'
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
    }

    const commentInvalid = () => { // Description validation detailed in '../components/RichTextBox'
        if (comment === null)
            return true
        return false
    }

    const handleGetReplies = async (commentID) => {
        const replies = await getReplies(commentID)
        document.getElementById(commentID + '-replies').innerHTML = renderToStaticMarkup(replies.map((reply) => {
            return (
                <li key={reply.id}>
                    <span style={{ fontSize: '12px' }} title={reply.date}>
                        {timeSince(reply.createdAt.toDate())}
                    </span>
                    {parse(reply.description)}
                </li>
            )
        }))
    }

    const toggleReplies = (commentID) => {
        if (document.getElementById(commentID).style.display === 'inherit') {
            document.getElementById(commentID).style.display = 'none'
            return false
        }
        document.getElementById(commentID).style.display = 'inherit'
        return true
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
            {!expandCommentBox &&
                <div className='comment-box-unexpanded' onClick={toggleCommentBox}>
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
                        <button onClick={() => { toggleCommentBox(); setComment(null) }}>
                            Cancel
                        </button>
                    </div>
                </div>}
            <ul className='list'>
                {comments.map((comment) => {
                    const replyLength = comment.childrenIDs.length
                    var replyButtonText = `${replyLength} repl${replyLength === 1 ? 'y' : 'ies'}`
                    return (
                        <li key={comment.id} style={{ marginTop: '30px' }}>
                            <span style={{ fontSize: '12px' }} title={comment.date}>
                                {timeSince(comment.createdAt.toDate())}
                            </span>
                            {parse(comment.description)}
                            {replyLength > 0 ?
                                <div>
                                    <button className='comment-replies-btn' onClick={(e) => {
                                        if (document.getElementById(`${comment.id}-replies`).getElementsByTagName('li').length === 0) {
                                            handleGetReplies(comment.id)
                                        } else {
                                            if (!toggleReplies(`${comment.id}-replies`))
                                               return e.target.innerHTML = '\u23F7 ' + replyButtonText
                                        }
                                        e.target.innerHTML = '\u23F6 ' + replyButtonText
                                    }}>
                                        {'\u23F7 ' + replyButtonText}
                                    </button>
                                    <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                                        <ul id={`${comment.id}-replies`}
                                            className='list' style={{ display: 'inherit' }} />
                                    </div>
                                </div>
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