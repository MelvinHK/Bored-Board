import { useState } from "react"
import { postComment, addCommentChild } from "../firestore"
import { useParams } from "react-router-dom"
import { Timestamp } from "firebase/firestore"
import RichTextBox from "./RichTextBox"
import CircularProgress from '@mui/material/CircularProgress'


function CommentRichTextBox({ expand, submittedComment, parentCommentID }) {
    const { threadID } = useParams()
    const [comment, setComment] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    const handleSubmitComment = async (parentID) => {
        const res = await postComment({
            description: comment,
            threadID: threadID,
            childrenIDs: [],
            parentID: parentID === undefined ? null : parentID,
            createdAt: Timestamp.fromDate(new Date())
        })
        if (parentID)
            await addCommentChild(parentID, res.id)
        submittedComment(res)
    }

    const commentInvalid = () => { // Description validation detailed in '../components/RichTextBox'
        return comment === null ? true : false
    }

    return (
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
                        await handleSubmitComment(parentCommentID)
                        setSubmitLoading(false)
                        expand(false)
                        setComment(null)
                    }}
                    disabled={commentInvalid()}
                >
                    Submit
                </button>
                <button onClick={() => { expand(false); setComment(null) }}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default CommentRichTextBox