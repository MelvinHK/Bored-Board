import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import EditIcon from '@mui/icons-material/Edit';

function Settings() {
    const { user, userLoading } = useAuth();

    const [newUsername, setNewUsername] = useState('');
    const [usernameInput, toggleUsernameInput] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [emailInput, toggleEmailInput] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [passwordInput, togglePasswordInput] = useState(false);

    const [checkPassword, setCheckPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [user, userLoading, navigate]);

    const confirmCurrentPassword = async () => {
        const credential = EmailAuthProvider.credential(user.email, checkPassword);
        await reauthenticateWithCredential(user, credential);
    };

    const handleUsernameUpdate = async () => {
        try {
            await confirmCurrentPassword();
            await updateProfile(user, { displayName: newUsername });
            // batch update username on firestore
            window.alert('Username succesfully updated!');
            toggleUsernameInput(false);
        } catch (error) {
            if (error.code === 'auth/wrong-password')
                window.alert('Incorrect password.');
            else
                window.alert('An error occured...');
        }
    };

    const handleEmailUpdate = async () => {
        try {
            await confirmCurrentPassword();
            await updateEmail(user, newEmail);
            window.alert('Email succesfully updated!');
            toggleEmailInput(false);
        } catch (error) {
            if (error.code === 'auth/wrong-password')
                window.alert('Incorrect password.');
            else
                window.alert('An error occured...');
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            await confirmCurrentPassword();
            await updatePassword(user, newPassword);
            window.alert('Password succesfully updated!');
            togglePasswordInput(false);
        } catch (error) {
            if (error.code === 'auth/wrong-password')
                window.alert('Incorrect password.');
            else
                window.alert('An error occured...');
        }
    };

    useEffect(() => {
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setCheckPassword('');
    }, [usernameInput, emailInput, passwordInput]);

    return !userLoading && user && (<div className='form'>
        <h1>Settings</h1>

        {/* Username */}
        <div className='flex f-center'>
            <div>
                <h3 className='mb5'>Username</h3>
                <p className='mt0'>{user.displayName}</p>
            </div>
            {!usernameInput &&
                <button
                    onClick={() => {
                        toggleUsernameInput(true);
                        toggleEmailInput(false);
                        togglePasswordInput(false);
                    }}
                    className='mlauto button-link'>
                    <EditIcon />
                </button>}
        </div>
        {usernameInput && <>
            <input
                type='text'
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder='New Username*' autoFocus />
            <p className='f12 gray'>
                Username must have 3-20 characters and only contain letters, numbers, underscore.</p>
            <input
                type='password'
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
                placeholder='Current Password*' />
            <div className='flex mt10'>
                <button onClick={() => handleUsernameUpdate()} className='mlauto mr10'>Submit</button>
                <button onClick={() => toggleUsernameInput(false)}>Cancel</button>
            </div>
        </>}

        {/* Email */}
        <div className='flex f-center'>
            <div>
                <h3 className='mb5'>Email</h3>
                <p className='mt0'>{user.email}</p>
            </div>
            {!emailInput &&
                <button
                    onClick={() => {
                        toggleUsernameInput(false);
                        toggleEmailInput(true);
                        togglePasswordInput(false);
                    }}
                    className='mlauto button-link'>
                    <EditIcon />
                </button>}
        </div>
        {emailInput && <>
            <input
                type='text'
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder='New Email*'
                className='mb10'
                autoFocus />
            <input
                type='password'
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
                placeholder='Current Password*' />
            <div className='flex mt10'>
                <button onClick={() => handleEmailUpdate()} className='mlauto mr10'>Submit</button>
                <button onClick={() => toggleEmailInput(false)}>Cancel</button>
            </div>
        </>}

        {/* Password */}
        <div className='flex f-center'>
            <h3>Password</h3>
            {!passwordInput &&
                <button
                    onClick={() => {
                        toggleUsernameInput(false);
                        toggleEmailInput(false);
                        togglePasswordInput(true);
                    }}
                    className='mlauto mt15 button-link'>
                    <EditIcon />
                </button>}
        </div>
        {passwordInput && <>
            <input
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='New Password*'
                autoFocus />
            <p className='f12 gray'>
                Password must have at least 8 characters, with at least 1 letter and 1 number.</p>
            <input
                type='password'
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
                placeholder='Current Password*' />
            <div className='flex mt10'>
                <button onClick={() => handlePasswordUpdate()} className='mlauto mr10'>Submit</button>
                <button onClick={() => togglePasswordInput(false)}>Cancel</button>
            </div>
        </>}

        {/* Delete Account */}
        <button className='flex mlauto mt30 button-link'>Delete Account</button>
    </div>);
}

export default Settings;