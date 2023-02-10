import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { getThreads } from '../firestore'
import { timeSince } from "../utils"
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';

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
        <>
            <div>
                <SearchIcon className='align-icon' style={{ position: 'absolute', transform: 'translateY(28px)' }} color='action' />
                <input placeholder={'Search'} style={{ marginTop: '20px', width: '100%', paddingLeft: '40px' }}></input>
            </div>
            <ul className='list' style={{ marginLeft: '10px' }}>
                {threads.map((thread) =>
                    <li key={thread.id}>
                        <h3 style={{ marginTop: '30px', marginBottom: '10px' }}>
                            <Link className='black-link' to={`/${forumURL}/thread/${thread.id}`}>
                                {thread.title}
                            </Link>
                        </h3>
                        <span title={thread.date} style={{ color: 'gray' }}>
                            {timeSince(thread.createdAt.toDate())}
                            <ChatBubbleOutlineIcon className="align-icon" fontSize="small" color='action' style={{ marginLeft: '10px' }} />
                            {thread.totalComments}
                        </span>
                    </li>
                )}
            </ul>
        </>
    )
}

export default ThreadList