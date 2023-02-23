import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { getThreads } from '../firestore'
import { timeSince } from "../utils"

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SearchIcon from '@mui/icons-material/Search'
import AttachFileIcon from '@mui/icons-material/AttachFile';

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

    return (<>
        <div className='flex f-center'>
            <SearchIcon className='p-abs ml10' color='action' />
            <input placeholder={'Search'} className='searchbar' />
        </div>
        <ul id='threadList' className='list ml10'>
            {threads.map((thread) =>
                <li key={thread.id}>
                    <h4 className='mt30 mb10'>
                        <Link className='black-link' to={`/${forumURL}/thread/${thread.id}`}>
                            {thread.title}
                        </Link>
                    </h4>
                    <p className='flex f-center mt15 gray'>
                        <span title={thread.date}>{timeSince(thread.createdAt.toDate())}</span>
                        <ChatBubbleOutlineIcon className='chat-icon' fontSize='small' />
                        {thread.totalComments}
                        {thread.imageURL &&
                            <button className='button-link'>
                                <AttachFileIcon className='paperclip-icon' fontSize='small' />
                            </button>
                        }
                    </p>
                </li>
            )}
        </ul>
    </>)
}

export default ThreadList