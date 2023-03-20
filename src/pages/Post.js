import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RichTextBox } from '../components/RichTextBox';
import { postImage, postThread } from '../firestore';
import { Timestamp } from 'firebase/firestore';

import '../App.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../auth';

function Post({ deepLink }) {
    const navigate = useNavigate();
    const { forumURL } = useParams();
    const previousURL = deepLink ? `/${forumURL}` : -1;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(null);
    const [image, setImage] = useState();
    const [submitLoading, setSubmitLoading] = useState(false);

    const { user, userLoading } = useAuth();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    useEffect(() => {
        if (!userLoading && !user)
            navigate(`/${forumURL}`);
    }, [user, userLoading, navigate, forumURL]);

    const handleSubmit = async () => { // Does not abort if user leaves page
        if (image) {
            var url = await postImage(image);
            if (!url) return;
        }
        const res = await postThread({
            author: user.displayName,
            authorID: user.uid,
            title: title,
            description: description,
            forumID: forumURL,
            createdAt: Timestamp.fromDate(new Date()),
            imageURL: url ? url : null,
            totalComments: 0
        });
        navigate(`/${forumURL}/thread/${res.id}`);
    };

    return !userLoading && user && (
        <div className='modal-div'>
            <div className={`modal ${submitLoading ? 'disabled-input' : ''}`}>
                <h3>Post Thread</h3>
                <span className='flex'>
                    <input
                        type='text'
                        placeholder='Title*'
                        className='mb10'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                </span>
                <RichTextBox
                    getDescription={(value) => setDescription(value)}
                    getImage={(file) => setImage(file)}
                    placeholderText={'Description'}
                    submitEvent={async () => {
                        setSubmitLoading(true);
                        await handleSubmit();
                        setSubmitLoading(false);
                    }}
                    cancelEvent={() => navigate(previousURL)}
                    submitDisabled={title === '' || title.trim().length === 0}
                />
            </div>
            <CircularProgress style={{
                position: 'absolute',
                color: 'gray',
                visibility: submitLoading ? 'visible' : 'hidden'
            }} />
        </div>
    );
}

export default Post;