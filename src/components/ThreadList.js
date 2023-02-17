import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { getThreads } from '../firestore'
import { isElementInView, timeSince } from "../utils"
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SearchIcon from '@mui/icons-material/Search'

function ThreadList() {
    const { forumURL } = useParams()
    const [threads, setThreads] = useState([])
    const [moreThreads, setMoreThreads] = useState(false)

    const handleGetThreads = async () => {
        const data = await getThreads(forumURL)
        if (data[10]) {
            data.pop()
            setMoreThreads(true)
        }
        setThreads(data)
    }

    useEffect(() => {
        handleGetThreads()
    }, [])

    // Bottomless Scrolling
    const getMoreThreads = async () => {
        if (moreThreads) {
            const nextThreads = await getThreads(forumURL, threads[threads.length - 1].id)
            if (nextThreads.length < 11)
                setMoreThreads(false)
            setThreads(threads.concat(nextThreads))
        }
    }

    useEffect(() => {
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                    getMoreThreads()
            })
        })
        observer.observe(document.getElementById('bottom'))
    })

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
                <SearchIcon className='align-icon'
                    style={{ position: 'absolute', transform: 'translateY(28px)', marginLeft: '10px' }} color='action' />
                <input placeholder={'Search'} style={{ marginTop: '20px', width: '100%', paddingLeft: '40px' }}></input>
            </div>
            <ul id='threadList' className='list' style={{ marginLeft: '10px' }}>
                {threads.map((thread) =>
                    <li key={thread.id}>
                        <h3 style={{ marginTop: '30px', marginBottom: '0px' }}>
                            <Link className='black-link' to={`/${forumURL}/thread/${thread.id}`}>
                                {thread.title}
                            </Link>
                        </h3>
                        <p title={thread.date} style={{ color: 'gray' }}>
                            {timeSince(thread.createdAt.toDate())}
                            <ChatBubbleOutlineIcon className="align-icon"
                                fontSize="small" color='action' style={{ marginLeft: '10px' }} />
                            {thread.totalComments}
                        </p>
                    </li>
                )}
            </ul>
        </>
    )
}

export default ThreadList