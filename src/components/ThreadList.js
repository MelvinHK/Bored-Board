import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import * as firestore from '../firestore'

function ThreadList({ postThreadModal }) {
    const [threads, setThreads] = useState([])
    const { forumURL } = useParams()

    const handleGetThreads = async () => {
        const data = await firestore.getThreads(forumURL)
        setThreads(data)
    }

    useEffect(() => {
        handleGetThreads()
    }, [])

    // Bottomless scrolling
    window.onscroll = async (ev) => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            const nextThreads = await firestore.getThreads(forumURL, threads[threads.length - 1].id)
            if (!nextThreads)
                return
            setThreads(threads.concat(nextThreads))
        }
    }

    if (!threads)
        return (
            <ul>
                <li>No threads posted yet...</li>
                {postThreadModal}
            </ul>
        )

    return (
        <ul style={{ padding: '0', listStyleType: 'none', }}>
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