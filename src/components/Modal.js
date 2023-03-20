import { useState } from "react";
import '../App.css';

function Modal({ children }) {
    const [closed, setClosed] = useState(false);

    return !closed && (
        <div className='modal-div'>
            <div className='modal form'>
                {children}
                <div className='flex f-end'>
                    <button className='' onClick={() => setClosed(true)}>Done</button>
                </div>
            </div>
        </div>);
}

export default Modal;