import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import * as firestore from '../firestore'

function ForumList() {
    const [forums, setForums] = useState([])

    const handleGetForums = async () => {
        const data = await firestore.getForums()
        setForums(data)
    }

    useEffect(() => {
        handleGetForums()
    }, [])

    return (
        <ul style={{
            padding: '0',
            listStyleType: 'none'
        }}>
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