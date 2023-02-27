import { useState } from "react"
import { Link } from "react-router-dom";
import '../App.css'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

function AuthorInput({ getAuthor }) {
    const [author, setAuthor] = useState('')

    return (
        <div className='flex f-center mb10 p-relative'>
            <input
                placeholder='Anonymous'
                value={author}
                style={{ paddingRight: '35px' }}
                onChange={(e) => { setAuthor(e.target.value); getAuthor(e.target.value) }}
            />
            <Link to='/about' target='_blank' rel='noopener noreferrer' className='p-abs author-help-button'>
                <button className='button-link' tabIndex={-1}>
                    <HelpRoundedIcon fontSize='small' />
                </button>
            </Link>
        </div>)
}

export default AuthorInput