import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import * as firestore from '../firestore'

function ThreadList({ postThreadModal }) {
    const [threads, setThreads] = useState([])
    const { forumURL } = useParams()

    useEffect(() => {
        const handleGetThreads = async () => {
            const data = await firestore.getThreads(forumURL)
            setThreads(data)
        }
        handleGetThreads()
    }, [])

    if (!threads)
        return (
            <ul>
                <li>No threads posted yet...</li>
                {postThreadModal}
            </ul>
        )

    return (
        <ul>
            {threads.map((thread) =>
                <li key={thread.id}>
                    <h3>
                        <Link to={`/${forumURL}/thread/${thread.id}`}>
                            {thread.title}
                        </Link>
                    </h3>
                    {thread.date}
                </li>
            )}
            {postThreadModal}
        </ul>
    )
}

export default ThreadList