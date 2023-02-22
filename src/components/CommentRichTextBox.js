import { useState } from "react"
import { postComment, incrementReplies } from "../firestore"
import { useParams } from "react-router-dom"
import { Timestamp } from "firebase/firestore"
import RichTextBox from "./RichTextBox"

function CommentRichTextBox({ expand, onSubmitted, parentCommentID, placeholderText = 'Leave a comment' }) {
    const { threadID } = useParams()
    const [comment, setComment] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    const handleSubmitComment = async (parentID) => {
        const res = await postComment({
            description: comment,
            threadID: threadID,
            totalReplies: 0,
            parentID: parentID === undefined ? null : parentID,
            createdAt: Timestamp.fromDate(new Date())
        })
        if (parentID)
            await incrementReplies(parentID, 1)
        onSubmitted(res)
    }

    return (
        <div className={`comment-box ${submitLoading ? 'disabled-input' : ''}`}>
                <RichTextBox
                    getDescription={(value) => setComment(value)}
                    placeholderText={placeholderText}
                    autofocus={true}
                    submitEvent={async () => {
                        setSubmitLoading(true)
                        await handleSubmitComment(parentCommentID)
                        setSubmitLoading(false)
                        expand(false)
                        setComment(null)
                    }}
                    cancelEvent={() => { expand(false); setComment(null) }}
                />
        </div>
    )
}

export default CommentRichTextBox