import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { RichTextBox } from '../components/RichTextBox'
import { postThread } from '../firestore'
import { getBlobURLFromHTML, replaceBlobURLWithFirebaseURL, getFileBlob } from '../utils';
import '../App.css'
import { Timestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

function Post({ deepLink }) {
    const navigate = useNavigate();
    const { forumURL } = useParams()
    const previousURL = deepLink ? `/${forumURL}` : -1

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState(null)

    // Hide background page's scrollbar
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => document.body.style.overflow = 'unset';
    }, [])

    const handleSubmit = async () => {
        const blobURL = getBlobURLFromHTML(description)
        var updatedDescription = null
        async function handleUpload() {
            if (blobURL) {
                const storage = getStorage()
                const filepath = `/images/${blobURL.substring(blobURL.lastIndexOf('/') + 1)}`
                const storageRef = ref(storage, filepath)
                getFileBlob(blobURL, blob => {
                    console.log("1")
                    uploadBytes(storageRef, blob).then(() => {
                        console.log("2")
                        getDownloadURL(storageRef).then((url) => {
                            console.log("3")
                            updatedDescription = replaceBlobURLWithFirebaseURL(description, url)
                        })
                    })
                })
            }
        }
        await handleUpload()
        console.log("4")
        // const res = await postThread({
        //     title: title,
        //     description: updatedDescription ? updatedDescription : description,
        //     forumID: forumURL,
        //     createdAt: Timestamp.fromDate(new Date())
        // })
        // navigate(`/${forumURL}/thread/${res.id}`)
        // window.location.reload();
    }

    const postInvalid = () => { // Description validation detailed in '../components/RichTextBox'
        if (title === '' || title.trim().length === 0 || description === null)
            return true
        return false
    }

    return (
        <div className='modalDiv'>
            <div className='modal'>
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
                        onClick={handleSubmit}
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
    )
}

export default Post