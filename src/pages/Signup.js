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

    const [usernameValid, setUsernameValid] = useState();
    const [emailValid, setEmailValid] = useState({ valid: null, exists: false });
    const [passwordValid, setPasswordValid] = useState();

    const navigate = useNavigate();

    const location = useLocation();
    const background = location.state && location.state.modalBackground && location.state.modalBackground;
    const previousURL = location.state && location.state.modalBackground ? location.state.modalBackground.pathname : '/';

    const { user, userLoading } = useAuth();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        setSubmitLoading(true);
        const usernameValid = isUsernameValid();
        const emailValid = isEmailValid();
        const passwordValid = isPasswordValid();

        console.log(emailValid);

        if (!usernameValid || !emailValid || !passwordValid)
            return setSubmitLoading(false);

        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(credential.user, { displayName: username });
            setSignupComplete(true);
            setSubmitLoading(false);
        } catch (error) {
            console.log(error.code);
            if (error.code === 'auth/email-already-in-use')
                setEmailValid({ valid: false, exists: true });
            if (error.code === 'auth/invalid-email')
                setEmailValid({ valid: false, exists: false });
            if (error.code === 'auth/internal-error')
                setPasswordValid(false);
            setSubmitLoading(false);
        }
    };

    // These should be server-side functions:

    const isUsernameValid = () => {
        const result = /^[A-Za-z0-9_]{3,20}$/.test(username);
        setUsernameValid(result);
        return result;
    };

    const isEmailValid = () => {
        const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        setEmailValid({ valid: result });
        return result;
    };

    const isPasswordValid = () => {
        const result = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(password);
        setPasswordValid(result);
        return result;
    };

    return !userLoading && (
        <div className='modal-div'>
            {!user || attemptingSignup ? <>
                <div className={`modal form ${submitLoading ? 'disabled-input' : ''}`}>
                    <form onSubmit={(e) => {
                        setAttemptingSignup(true);
                        handleRegister(e);
                    }}>
                        <h2>Sign up</h2>
                        {!signupComplete ? <>

                            <input type='text' placeholder='Username*' value={username} onChange={(e) => setUsername(e.target.value)} className='mb10' />
                            <p className={`f12 mt0 ${usernameValid === false ? 'red' : 'gray'}`}>
                                Username must have 3-20 characters and only contain letters, numbers, underscore.</p>

                            <input type='text' placeholder='Email*' value={email} onChange={(e) => setEmail(e.target.value)} className='mb10' />
                            {emailValid.valid === false && <p className='f12 red mt0'>Invalid email address.{emailValid.exists && ' Already in use.'}</p>}

                            <input type='password' placeholder='Password*' value={password} onChange={(e) => setPassword(e.target.value)} className='mb10' />
                            <p className={`f12 mt0 ${passwordValid === false ? 'red' : 'gray'}`}>Password must have at least 8 characters, with at least 1 letter and 1 number.</p>

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