import { useEffect, useState } from "react"
import { Link, Outlet, useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import * as firestore from '../firestore'

function Forum() {
    const [forum, setForum] = useState([])
    const { forumURL } = useParams()

    useEffect(() => {
        const handleGetForum = async () => {
            const data = await firestore.getForum(forumURL)
            setForum(data)
        }
        handleGetForum()
    }, [])

    if (!forum) {
        return <NotFound error={"Board does not exist"}/>
    }
    return (
        <div>
            <h2>
                <Link to={`/${forum.id}`}>
                    {forum.title}
                </Link>
            </h2>
            <p>{forum.description}</p>
            <Outlet />
        </div>
    )
}

export default Forum