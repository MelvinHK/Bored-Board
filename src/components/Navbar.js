import { NavLink, useLocation } from 'react-router-dom';
import '../App.css';
import { signOut, useAuth } from '../auth';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { ClickAwayListener } from '@mui/base';
import { useState } from 'react';

function NavBar() {
    const { user, userLoading } = useAuth();
    const location = useLocation();

    const [dropdown, toggleDropdown] = useState(false);

    return !userLoading && (
        <div className='nav'>
            <h3><NavLink to={'/'} tabIndex={1}>Bored Board</NavLink></h3>
            <NavLink to="/about" className='ml20' tabIndex={2}>About</NavLink>
            {!user ? <>
                <NavLink to="/login" state={{ modalBackground: location }} className='btn mlauto mr20' tabIndex={3}>Log in</NavLink>
                <NavLink to="/signup" state={{ modalBackground: location }} className='btn' tabIndex={4}>Sign up</NavLink>
            </> : <>
                <button className='mlauto profile-btn' onClick={() => toggleDropdown(!dropdown)}>
                    <AccountBoxIcon sx={{ fontSize: "40px" }} />
                </button>
                {/* <button onClick={async () => { await signOut(); window.location.reload(); }}>Sign out</button> */}
                {dropdown &&
                    <ClickAwayListener onClickAway={() => toggleDropdown(!dropdown)}>
                        <div className='dropdown'>
                            <div onClick={() => toggleDropdown(!dropdown)}>
                                <NavLink to={`/user/${user.uid}`} className='btn a-btn flex f-center'>
                                    <AccountBoxIcon className='mr10' />
                                    Profile
                                </NavLink>
                                <NavLink to='/settings' className='btn a-btn flex f-center'>
                                    <SettingsIcon className='mr10' />
                                    Settings
                                </NavLink>
                                <button className='w100 flex f-center'
                                    onClick={async () => { await signOut(); window.location.reload(); }}>
                                    <LogoutIcon className='mr10' />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </ClickAwayListener>
                }
            </>}
        </div >
    );
}

export default NavBar;