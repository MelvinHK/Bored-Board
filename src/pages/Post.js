import { useNavigate, useParams } from 'react-router-dom'
import '../App.css'

function Post({ deepLink }) {
    const navigate = useNavigate();
    const { forumURL } = useParams()
    const previousURL = deepLink ? `/${forumURL}` : -1

    return (
        <div className='modalDiv'>
            <div className='modal'>
                <h3>Post Thread</h3>
                <button onClick={() => navigate(previousURL)}>Close</button>
            </div>
        </div>
    )
}

export default Post