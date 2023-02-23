import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom'
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
    const navigate = useNavigate()

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

    return (<>
        <div className='left-column'>
            <h2>
                <Link style={{ color: 'black', textDecoration: 'none' }} to={`/${forum.id}`}>
                    {forum.title}
                    <img src={forum.logo} className='forum-logo'></img>
                </Link>
            </h2>
            <p>{forum.description}</p>
            <button style={{ width: '100%' }}
                onClick={() => navigate(`/${forumURL}/post`, { state: { postModalBackground: location } })}>
                Post Thread
            </button>
        </div>
        <div className='main-column'>
            <Outlet />
            <div id='bottom' className='column-bottom' />
        </div>
    </>)
}

export default Forum