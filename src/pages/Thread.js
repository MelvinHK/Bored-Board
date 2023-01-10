import { Link, useParams, Navigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import NotFound from '../components/NotFound'
import * as firestore from '../firestore'

function Thread() {
    const { threadID } = useParams()
    const [thread, setThread] = useState([])

    useEffect(() => {
        const handleGetThreadAndForum = async () => {
            const threadData = await firestore.getThread(threadID)
            setThread(threadData)
        }
        handleGetThreadAndForum()
    }, [])

    if (!thread)
        return <NotFound error={"Thread does not exist"}/>
        
    return (
        <div>
            <h3>{thread.title}</h3>
            <p>{thread.date}</p>
            <p>{thread.description}</p>
        </div>
    )
}

export default Thread