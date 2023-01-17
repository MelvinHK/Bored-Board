import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import * as firestore from '../firestore'
import '../App.css'

function Forum() {
    const [forum, setForum] = useState()
    const [loading, setLoading] = useState(true)
    const { forumURL } = useParams()
    const location = useLocation()

    const handleGetForum = async () => {
        const data = await firestore.getForum(forumURL)
        setForum(data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetForum()
    }, [])

    if (loading)
        return

    if (!forum)
        return <NotFound error={"Board does not exist"} />

    return (
        <div className='grid-container'>
            <div className='grid-child left-column'>
                <h2>
                    <Link to={`/${forum.id}`}>
                        {forum.title}
                    </Link>
                </h2>
                <p>{forum.description}</p>
                <Link to={`/${forumURL}/post`} state={{ postModalBackground: location }}>
                    <button style={{width: '100%'}}>
                        Post Thread
                    </button>
                </Link>
            </div>
            <div className='grid-child right-column'>
                <Outlet />
            </div>
        </div>
    )
}

export default Forum