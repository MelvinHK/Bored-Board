import { useEffect, useState } from "react";
import { auth } from '../firestoreConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import '../App.css';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth";
import { CircularProgress } from "@mui/material";

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupComplete, setSignupComplete] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [attemptingSignup, setAttemptingSignup] = useState(false);

    const navigate = useNavigate();

    const location = useLocation();
    const background = location.state && location.state.modalBackground;
    const previousURL = location.state ? location.state.modalBackground.pathname : '/';

    const { user, userLoading } = useAuth();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleRegister = async (e) => {
        setSubmitLoading(true);
        e.preventDefault();
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(credential.user, { displayName: username });
            setSignupComplete(true);
            setSubmitLoading(false);
        } catch (error) {
            window.alert(error);
            setSubmitLoading(false);
        }
    };

    return !userLoading && (
        <div className='modal-div'>
            {!user || attemptingSignup ? <>
                <div className={`modal form ${submitLoading ? 'disabled-input' : ''}`}>
                    <form onSubmit={(e) => { setAttemptingSignup(true); handleRegister(e); }}>
                        <h2>Sign up</h2>
                        {!signupComplete ? <>
                            <input type='text' placeholder='Username*' value={username} onChange={(e) => setUsername(e.target.value)} className='mb10' />
                            <input type='text' placeholder='Email*' value={email} onChange={(e) => setEmail(e.target.value)} className='mb10' />
                            <input type='password' placeholder='Password*' value={password} onChange={(e) => setPassword(e.target.value)} className='mb10' />
                            <p className='f12 gray mt0'>Password must have at least 8 characters, with at least 1 letter and 1 number.</p>
                            <div className='flex f-center'>
                                <span className='f12'>Have an account? <Link to='/login' state={{ modalBackground: background }}>
                                    <strong>Log in</strong></Link></span>
                                <div className='mlauto'>
                                    <input className='btn mr10' type='submit' />
                                    <button onClick={(e) => { e.preventDefault(); navigate(previousURL); }}>Cancel</button>
                                </div>
                            </div>
                        </> : <>
                            <p>Sign up complete!</p>
                            <div className='flex f-end'>
                                <button className='' onClick={(e) => { e.preventDefault(); navigate(previousURL); }}>Done</button>
                            </div>
                        </>}
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
        </div >
    );
}

export default Signup;;