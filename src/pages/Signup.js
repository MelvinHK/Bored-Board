import { useState } from "react";
import '../App.css'

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form className='form'>
            <h2>Sign up</h2>
            <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className='mb10' />
            <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='mb10' />
            <input type='text' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='mb10' />
        </form>  
    );
}

export default Signup;