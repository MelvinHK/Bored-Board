import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from "firebase/auth";

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
        try {
            reauthenticateWithCredential(user, credential);
            return true;
        } catch (error) {
            window.alert('Incorrect password.');
            return false;
        }
    };

    const handleUsernameUpdate = async () => {
        try {
            await confirmCurrentPassword();
            await updateProfile(user, { displayName: newUsername });

        } catch (error) {
            console.log(error);
            window.alert('An error occured...');
        }
    };

    const handleEmailUpdate = async () => {
        try {
            await confirmCurrentPassword();
            await updateEmail(user, newEmail);
        } catch (error) {
            console.log(error);
            window.alert('An error occured...');
        }
    };

    const handleUpdatePassword = async () => {
        try {
            await confirmCurrentPassword();
            await updatePassword(user, newPassword);
        } catch (error) {
            console.log(error);
            window.alert('An error occured...');
        }
    };

    const clearFields = () => {
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setCheckPassword('');
    };

    return !userLoading && user && (<div className='form'>
        <h1>Settings</h1>

        {/* Username */}
        <div className='flex f-center'>
            <div>
                <h3 className='mb5'>Username</h3>
                <p className='mt0'>{user.displayName}</p>
            </div>
            {!usernameInput &&
                <button onClick={() => toggleUsernameInput(true)} className='mlauto'>Change</button>}
        </div>
        {usernameInput && <>
            <input type='password' className='mb10' placeholder='Current Password*' />
            <input type='text' placeholder='New Username*' autoFocus />
            <div className='flex mt10'>
                <button className='mlauto mr10'>Submit</button>
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
                <button onClick={() => toggleEmailInput(true)} className='mlauto'>Change</button>}
        </div>
        {emailInput && <>
            <input type='text' placeholder='New Email' autoFocus />
            <div className='flex mt10'>
                <button className='mlauto mr10'>Submit</button>
                <button onClick={() => toggleEmailInput(false)}>Cancel</button>
            </div>
        </>}

        {/* Password */}
        <div className='flex f-center'>
            <h3>Password</h3>
            <button className='mlauto mt15'>Change</button>
        </div>

        {/* Delete Account */}
        <button className='flex mlauto mt30 button-link'>Delete Account</button>
    </div>);
}

export default Settings;