import { useState } from "react";
import { auth } from '../firestoreConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import '../App.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: username });
            console.log('User signed up successfully!');
        } catch (error) {
            console.error('Error signing up user: ', error);
        }
    };

    return (
        <form className='form' onSubmit={(e) => handleRegister(e)}>
            <h2>Sign up</h2>
            <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className='mb10' />
            <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='mb10' />
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='mb10' />
            <input className='button' type='submit' />
        </form>
    );
}

export default Signup;