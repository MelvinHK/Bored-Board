import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { getThreads } from '../firestore'

function ThreadList() {
    const [threads, setThreads] = useState([])
    const { forumURL } = useParams()

    const handleGetThreads = async () => {
        const data = await getThreads(forumURL)
        setThreads(data)
    }

    useEffect(() => {
        handleGetThreads()
    }, [])

    // Bottomless scrolling
    window.onscroll = async (ev) => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            const nextThreads = await getThreads(forumURL, threads[threads.length - 1].id)
            if (!nextThreads)
                return
            setThreads(threads.concat(nextThreads))
        }
    }

    if (!threads)
        return (
            <ul style={{ padding: '0', listStyleType: 'none' }}>
                <li>
                    <h3>It's empty...</h3>
                    No threads posted yet
                </li>
            </ul>
        )

    return (
        <ul style={{ padding: '0', listStyleType: 'none' }}>
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
        </ul>
    )
}

export default ThreadList