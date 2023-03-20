import { NavLink, useLocation } from 'react-router-dom';
import '../App.css';
import { signOut, useAuth } from '../auth';


function NavBar() {
    const { user, userLoading } = useAuth();
    const location = useLocation();

    return !userLoading && (
        <div className='nav'>
            <h3><NavLink to={'/'} tabIndex={1}>Bored Board</NavLink></h3>
            <NavLink to="/about" className='ml20' tabIndex={2}>About</NavLink>
            {!user ? <>
                <NavLink to="/login" state={{ postModalBackground: location }} className='btn mlauto mr20' tabIndex={3}>Log in</NavLink>
                <NavLink to="/signup" state={{ postModalBackground: location }} className='btn' tabIndex={4}>Sign up</NavLink>
            </> :
                <button className='mlauto' onClick={async () => { await signOut(); window.location.reload(); }}>Sign out</button>
            }
        </div >
    );
}

export default NavBar;