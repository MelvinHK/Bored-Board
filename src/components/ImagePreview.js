import { useState } from 'react';

import '../App.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export function ImagePreview({ imageURL }) {
    const [toggleImage, setToggle] = useState(false);

    return (<>
        <button className='button-link' onClick={() => setToggle(!toggleImage)}>
            <AttachFileIcon className='paperclip-icon' fontSize='small' />
        </button>
        {toggleImage && <>
            <div className='w100' />
            <img alt='preview' src={imageURL} className='preview-img' />
        </>}
    </>);
}

export default ImagePreview;