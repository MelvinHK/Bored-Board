import { useState } from "react";
import { postComment, incrementReplies, postImage } from "../firestore";
import { useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import RichTextBox from "./RichTextBox";
import { useAuth } from "../auth";

function CommentRichTextBox({ expand, onSubmitted, parentCommentID, placeholderText = 'Leave a comment' }) {
    const { threadID } = useParams();
    const [comment, setComment] = useState(null);
    const [image, setImage] = useState();
    const [submitLoading, setSubmitLoading] = useState(false);

    const { user } = useAuth();

    const handleSubmitComment = async (parentID) => {
        if (image) {
            var url = await postImage(image);
            if (!url) return;
        }
        const res = await postComment({
            author: user.displayName,
            description: comment,
            threadID: threadID,
            totalReplies: 0,
            parentID: parentID === undefined ? null : parentID,
            createdAt: Timestamp.fromDate(new Date()),
            imageURL: url ? url : null
        });
        if (parentID)
            await incrementReplies(parentID, 1);
        onSubmitted(res); // Return comment to parent
    };

    return (
        <div className={`comment-box ${submitLoading ? 'disabled-input' : ''}`}>
            <RichTextBox
                getDescription={(value) => setComment(value)}
                getImage={(file) => setImage(file)}
                placeholderText={placeholderText}
                autofocus={true}
                submitEvent={async () => {
                    setSubmitLoading(true);
                    await handleSubmitComment(parentCommentID);
                    setSubmitLoading(false);
                    expand(false);
                    setComment(null);
                }}
                imageRequired={false}
                cancelEvent={() => { expand(false); setComment(null); }}
            />
        </div>
    );
}

export default CommentRichTextBox;