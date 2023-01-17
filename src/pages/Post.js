import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { RichTextBox } from '../components/RichTextBox'
import * as firestore from '../firestore'
import '../App.css'
import { Timestamp } from 'firebase/firestore';

function Post({ deepLink }) {
    const navigate = useNavigate();
    const { forumURL } = useParams()
    const previousURL = deepLink ? `/${forumURL}` : -1

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => document.body.style.overflow = 'unset';
    }, [])

    const handlePost = async () => {
        const res = await firestore.postThread({
            title: title,
            description: description,
            forumID: forumURL,
            createdAt: Timestamp.fromDate(new Date())
        })
        navigate(`/${forumURL}/thread/${res.id}`)
        window.location.reload();
    }

    const postInvalid = () => { // Description validation detailed in '../components/RichTextBox'
        if (title === '' || title.trim().length === 0 || description === '')
            return true
        return false
    }

    return (
        <div className='modalDiv'>
            <div className='modal'>
                <div className='modal-container'>
                    <h3>Post Thread</h3>
                    <input
                        placeholder='Title'
                        style={{ marginBottom: '10px', width: '100%' }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <RichTextBox getContent={(value) => setDescription(value)} />
                    <div style={{ textAlign: 'right' }}>
                        <button
                            onClick={handlePost}
                            style={{ marginRight: '10px' }}
                            disabled={postInvalid()}
                        >
                            Submit
                        </button>
                        <button onClick={() => navigate(previousURL)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post