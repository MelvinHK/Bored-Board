import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import NotFound from '../components/NotFound'
import parse from 'html-react-parser'
import { getThread, getComments, getComment } from '../firestore'
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
    const [queried, setQueried] = useState(false)
    const [moreComments, setMoreComments] = useState(false)

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
        if (commentsData[10]) {
            commentsData.pop()
            setMoreComments(true)
        }
        setComments(commentsData)
    }

    const loadData = async () => {
        await handleGetThread()
        await handleGetComments()
        setLoading(false)
    }

    useEffect(() => {
        setQueried(false)
        loadData()
    }, [commentID])

    useEffect(() => {
        if (thread) setPageTitle(thread.title)
    }, [thread])

    const getMoreComments = async () => {
        if (moreComments) {
            const nextComments = await getComments(threadID, comments[comments.length - 1].id)
            if (nextComments.length < 11)
                setMoreComments(false)
            setComments(comments.concat(nextComments))
        }
    }

    useEffect(() => {
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                    getMoreComments()
            })
        })
        observer.observe(document.getElementById('bottom'))
    })

    if (loading)
        return

    if (!thread)
        return <NotFound error={"Thread does not exist"} />

    return (<>
        <h3 className='mt0 mb10'>{thread.title}</h3>
        <p className='mb30 gray'>{thread.date}</p>
        {thread.description && parse(thread.description)}
        {thread.imageURL && <img className='center-img' src={thread.imageURL} />}
        <h4 className='mt30'>
            {thread.totalComments} Comment{thread.totalComments !== 1 && 's'}
        </h4>
        {!expandCommentBox ?
            <div className='comment-box-unexpanded'
                onClick={(e) => { if (e.type === 'click') setExpandCommentBox(true) }}>
                <span tabIndex={0} onFocus={() => setExpandCommentBox(true)} />
                Leave a comment
            </div>
            :
            <CommentRichTextBox
                expand={(value) => setExpandCommentBox(value)}
                onSubmitted={(value) => {
                    setComments([value, ...comments])
                }}
            />}
        {comments ?
            <ul className='comments list mt30'>
                {comments.map((comment) => {
                    return (
                        <div key={comment.id} className='mt10'>
                            <Comment comment={comment} />
                        </div>
                    )
                })}
            </ul>
            :
            <p className='mt30'>Comment does not exist</p>}
        {queried &&
            <button onClick={() => { navigate('./') }} className='button-link'>
                View full thread
            </button>}
    </>)
}

export default Thread