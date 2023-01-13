import { useNavigate, useParams } from 'react-router-dom'
import RichTextBox from '../components/RichTextBox';
import '../App.css'

function Post({ deepLink }) {
    const navigate = useNavigate();
    const { forumURL } = useParams()
    const previousURL = deepLink ? `/${forumURL}` : -1

    return (
        <div className='modalDiv'>
            <div className='modal'>
                <div className='container'>
                    <h3>Post Thread</h3>
                    <input placeholder='Title' style={{marginBottom: '10px', width: '96%'}}/>
                    <RichTextBox />
                    <button
                        onClick={() => navigate(previousURL)}
                        className='close-modal-button'
                    >
                        {'\u2716'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Post