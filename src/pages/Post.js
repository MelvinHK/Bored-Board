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
    const [image, setImage] = useState()
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'unset' }
    }, [])

    const handleSubmit = async () => { // Does not abort if user leaves page
        if (image) {
            const storage = getStorage()
            const filepath = `/images/${image.name}`
            const storageRef = ref(storage, filepath)
            try {
                await uploadBytes(storageRef, image)
                var url = await getDownloadURL(storageRef)
            } catch (error) {
                switch (error.code) {
                    case 'storage/unauthorized':
                        window.alert("Invalid file. Must be JPEG/PNG and less than 8MB.")
                        return
                    default:
                        window.alert("An unknown error occured, please try again.")
                        return
                }
            }
        }
        const res = await postThread({
            title: title,
            description: description,
            forumID: forumURL,
            createdAt: Timestamp.fromDate(new Date()),
            imageURL: url ? url : null
        })
        navigate(`/${forumURL}/thread/${res.id}`)
        window.location.reload()
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
                    autoFocus
                />
                <RichTextBox
                    getDescription={(value) => setDescription(value)}
                    getImage={(file) => setImage(file)}
                    enableHeading={true}
                    enableImage={true}
                    placeholderText={'Description'}
                    submitEvent={async () => {
                        setSubmitLoading(true)
                        await handleSubmit()
                        setSubmitLoading(false)
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
    )
}

export default Post