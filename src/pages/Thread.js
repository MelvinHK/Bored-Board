import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from "react"
import NotFound from '../components/NotFound'
import parse from 'html-react-parser'
import { getThread } from '../firestore'
import RichTextBox from '../components/RichTextBox'

function Thread() {
    const { threadID } = useParams()
    const [thread, setThread] = useState()
    const [loading, setLoading] = useState(true)

    const [expandCommentBox, setExpandCommentBox] = useState(false)
    var [comment, setComment] = useState(null)

    const handleGetThread = async () => {
        const threadData = await getThread(threadID)
        setThread(threadData)
        setLoading(false)
    }

    useEffect(() => {
        handleGetThread()
    }, [])

    if (loading)
        return

    if (!thread)
        return <NotFound error={"Thread does not exist"} />

    return (
        <div>
            <h3>{thread.title}</h3>
            <p>{thread.date}</p>
            {parse(thread.description)}
            <div className='comment-box'> 
                <RichTextBox
                    getContent={(value) => setComment(value)}
                    placeholderText={'Leave a comment'}
                    heightPx={'200px'}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={{ marginRight: '10px' }}>
                        Submit
                    </button>
                    <button>
                        Cancel
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Thread