import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import { getForum } from '../firestore'
import '../App.css'
import { setPageTitle } from "../utils"

function Forum() {
    const [forum, setForum] = useState()
    const [loading, setLoading] = useState(true)
    const { forumURL } = useParams()
    const { threadID } = useParams()
    const location = useLocation()

    const handleGetForum = async () => {
        const data = await getForum(forumURL)
        setForum(data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetForum()
    }, [])

    useEffect(() => {
        if (forum)
            setPageTitle(forum.title)
    }, [forum, threadID])

    if (loading)
        return

    if (!forum)
        return <NotFound error={"Board does not exist"} />

    return (
        <div className='grid-container'>
            <div className='left-column'>
                <h2>
                    <Link style={{ color: 'black', textDecoration: 'none' }} to={`/${forum.id}`}>
                        {forum.title}
                        <img src={forum.logo} className='forum-logo'></img>
                    </Link>
                </h2>
                <p>{forum.description}</p>
                <Link to={`/${forumURL}/post`} state={{ postModalBackground: location }}>
                    <button style={{ width: '100%' }}>
                        Post Thread
                    </button>
                </Link>
            </div>
            <div className='main-column'>
                <Outlet />
            </div>
        </div>
    )
}

export default Forum