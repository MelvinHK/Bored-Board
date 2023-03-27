import { useState } from "react";
import { postComment, incrementReplies, postImage, editComment, getComment } from "../firestore";
import { useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import RichTextBox from "./RichTextBox";
import { useAuth } from "../auth";

function CommentRichTextBox({ expand, onSubmitted, commentID, parentID, placeholderText = 'Leave a comment', imageDisabled = false, editContent }) {
    const { threadID } = useParams();
    const { forumURL } = useParams();

    const [comment, setComment] = useState(null);
    const [image, setImage] = useState();
    const [submitLoading, setSubmitLoading] = useState(false);

    const { user } = useAuth();

    const handleSubmitComment = async (parentID) => { // If parentID is given, it is a reply to a comment, otherwise it is a root comment.
        if (parentID) {
            const checkParent = await getComment(parentID);
            if (!checkParent)
                return window.alert(`Comment doesn't exist, it may have been deleted.`);
        }
        try {
            if (image) {
                var url = await postImage(image);
                if (!url) return;
            }
            const res = await postComment({
                author: user.displayName,
                authorID: user.uid,
                description: comment,
                threadID: threadID,
                forumID: forumURL,
                totalReplies: 0,
                parentID: parentID === undefined ? null : parentID,
                createdAt: Timestamp.fromDate(new Date()),
                imageURL: url ? url : null,
                edited: false
            });
            if (parentID)
                await incrementReplies(parentID, 1);
            onSubmitted(res); // Return comment to parent
        } catch (error) {
            window.alert('Error: Something went wrong with the upload...');
        }
    };

    const handleEditComment = async (commentID) => {
        try {
            await editComment(commentID, comment);
        } catch (error) {
            window.alert('Error: Unable to edit this comment. You may be unauthorised to do so.');
        }
        onSubmitted(comment);
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
                    if (editContent)
                        await handleEditComment(commentID);
                    else
                        await handleSubmitComment(parentID);
                    setSubmitLoading(false);
                    expand(false);
                    setComment(null);
                }}
                imageDisabled={imageDisabled}
                cancelEvent={() => { expand(false); setComment(null); }}
                editContent={editContent}
            />
        </div>
    );
}

export default CommentRichTextBox;