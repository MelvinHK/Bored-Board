import { useEffect, useState } from "react";
import { auth } from '../firestoreConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import '../App.css';
import { useNavigate } from "react-router-dom";

function Signup({ deepLink }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const previousURL = deepLink ? '/' : -1;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(credential.user, { displayName: username });
            console.log('User signed up successfully!');
        } catch (error) {
            window.alert(error);
        }
    };

    return (
        <div className='modal-div'>
            <div className='modal form'>
                <form onSubmit={(e) => handleRegister(e)}>
                    <h2>Sign up</h2>
                    <input type='text' placeholder='Username*' value={username} onChange={(e) => setUsername(e.target.value)} className='mb10' />
                    <input type='text' placeholder='Email*' value={email} onChange={(e) => setEmail(e.target.value)} className='mb10' />
                    <input type='password' placeholder='Password*' value={password} onChange={(e) => setPassword(e.target.value)} className='mb10' />
                    <p className='f12 gray mt0'>Password must have at least 8 characters, with at least 1 letter and 1 number.</p>
                    <div className='flex f-end'>
                        <input className='btn mr10' type='submit' />
                        <button onClick={(e) => { e.preventDefault(); navigate(previousURL); }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default Signup;