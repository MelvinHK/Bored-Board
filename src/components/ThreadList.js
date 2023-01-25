import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { getThreads } from '../firestore'
import { timeSince } from "../utils"

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
            <ul className='list'>
                <li>
                    <h3>It's empty...</h3>
                    No threads posted yet
                </li>
            </ul>
        )

    return (
        <ul className='list'>
            {threads.map((thread) =>
                <li key={thread.id}>
                    <h3>
                        <Link to={`/${forumURL}/thread/${thread.id}`}>
                            {thread.title}
                        </Link>
                    </h3>
                    <span title={thread.date}>{timeSince(thread.createdAt.toDate())}</span>
                </li>
            )}
        </ul>
    )
}

export default ThreadList