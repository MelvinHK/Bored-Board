import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react"
import NotFound from '../components/NotFound'
import parse from 'html-react-parser'
import * as firestore from '../firestore'

function Thread() {
    const { threadID } = useParams()
    const [thread, setThread] = useState()
    const [loading, setLoading] = useState(true)

    const handleGetThread = async () => {
        const threadData = await firestore.getThread(threadID)
        setThread(threadData)
        setLoading(false)
    }

    useEffect(() => {
        handleGetThread()
    }, [])

    if (loading)
        return

    if (!thread)
        return <NotFound error={"Thread does not exist"} />

    return (
        <div>
            <h3>{thread.title}</h3>
            <p>{thread.date}</p>
            {parse(thread.description)}
        </div>
    )
}

export default Thread