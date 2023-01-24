import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RichTextBox } from '../components/RichTextBox'
import { postThread } from '../firestore'
import { getBlobURLFromHTML, replaceBlobURLWithFirebaseURL, getFileBlob } from '../utils'
import '../App.css'
import { Timestamp } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import CircularProgress from '@mui/material/CircularProgress'

function Post({ deepLink }) {
    const navigate = useNavigate()
    const { forumURL } = useParams()
    const previousURL = deepLink ? `/${forumURL}` : -1

    const [title, setTitle] = useState('')
    var [description, setDescription] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'unset' }
    }, [])

    const handleSubmit = async () => { // Does not abort if user leaves page
        const blobURL = getBlobURLFromHTML(description)
        if (blobURL) {
            const storage = getStorage()
            const filepath = `/images/${blobURL.substring(blobURL.lastIndexOf('/') + 1)}`
            const storageRef = ref(storage, filepath)
            const blob = await getFileBlob(blobURL)
            try {
                await uploadBytes(storageRef, blob)
                const url = await getDownloadURL(storageRef)
                description = replaceBlobURLWithFirebaseURL(description, url)
            } catch (e) {
                setSubmitLoading(false)
                window.alert("Invalid file. Must be a JPEG/PNG and less than 8MB.")
                return
            }
        }
        const res = await postThread({
            title: title,
            description: description,
            forumID: forumURL,
            createdAt: Timestamp.fromDate(new Date())
        })
        navigate(`/${forumURL}/thread/${res.id}`)
        window.location.reload();
    }

    const postInvalid = () => { // Description validation detailed in '../components/RichTextBox'
        if (title === '' || title.trim().length === 0 || description === null)
            return true
        return false
    }

    return (
        <div className='modal-div'>
            <div className={`modal ${submitLoading ? 'disabled-input' : ''}`}>
                <h3>Post Thread</h3>
                <input
                    placeholder='Title'
                    style={{ marginBottom: '10px', width: '100%' }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <RichTextBox
                    getContent={(value) => setDescription(value)}
                    enableHeading={true}
                    enableImage={true}
                    placeholderText={'Description'}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => { handleSubmit(); setSubmitLoading(true) }}
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
            <CircularProgress style={{
                position: 'absolute',
                color: 'gray',
                visibility: submitLoading ? 'visible' : 'hidden'
            }} />
        </div>
    )
}

export default Post