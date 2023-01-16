import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import * as firestore from '../firestore'

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
        <div>
            <h2>
                <Link to={`/${forum.id}`}>
                    {forum.title}
                </Link>
            </h2>
            <p>{forum.description}</p>
            <Link to={`/${forumURL}/post`} state={{ postModalBackground: location }}>
                <button>
                    Post Thread
                </button>
            </Link>
            <Outlet />
        </div>
    )
}

export default Forum