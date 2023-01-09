import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import * as firestore from '../firestore'

function ForumList() {
    const [forums, setForums] = useState([])

    useEffect(() => {
        const handleGetForums = async () => {
            const data = await firestore.getForums()
            setForums(data)
        }
        handleGetForums()
    }, [])

    return (
        <ul>
            {forums.map((forum) =>
                <li key={forum.id}>
                    <h2>
                        <Link to={`/${forum.id}`}>
                            {forum.title}
                        </Link>
                    </h2>
                    <p>{forum.description}</p>
                </li>
            )}
        </ul>
    )
}

export default ForumList