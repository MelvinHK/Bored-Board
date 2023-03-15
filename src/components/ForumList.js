import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { getForums } from '../firestore'

function ForumList() {
    const [forums, setForums] = useState([])

    useEffect(() => {
        const handleGetForums = async () => {
            const data = await getForums()
            setForums(data)
        }
        
        handleGetForums()
    }, [])

    return (
        <ul className='list'>
            {forums.map((forum) =>
                <li key={forum.id}>
                    <h2>
                        <Link className='black-link' to={`/${forum.id}`}>
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