import '../App.css';
import { useEffect, useState } from 'react';
import { auth } from '../firestoreConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../auth';

function Login({ deepLink }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const previousURL = deepLink ? '/' : -1;

    const navigate = useNavigate();
    const { user, userLoading } = useAuth();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setSubmitLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate(previousURL);
        } catch (error) {
            setSubmitLoading(false);
            window.alert(error);
        }
    };

    return !userLoading && (
        <div className='modal-div'>
            {!user ? <>
                <div className={`modal form ${submitLoading ? 'disabled-input' : ''}`}>
                    <form onSubmit={(e) => handleLogin(e)}>
                        <h2>Log in</h2>
                        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='mb10' />
                        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='mb10' />
                        <div className='flex f-end'>
                            <input className='btn mr10' type='submit' />
                            <button onClick={(e) => { e.preventDefault(); navigate(previousURL); }}>Cancel</button>
                        </div>
                    </form>
                </div>
                <CircularProgress style={{
                    position: 'absolute',
                    color: 'grey',
                    visibility: submitLoading ? 'visible' : 'hidden'
                }} />
            </> :
                <div className='modal form'>
                    <h2>Hello!</h2>
                    <p className='f-self-center'>You're already logged in! Click <Link to='/'>here</Link> to continue.</p>
                </div>
            }
        </div>
    );
}

export default Login;