import { NavLink } from 'react-router-dom';
import '../App.css';
import { signOut, useAuth } from '../auth';

function NavBar() {
    const user = useAuth();

    return (
        <div className='nav'>
            <h3><NavLink to={'/'} tabIndex={1}>Bored Board</NavLink></h3>
            <NavLink to="/about" className='ml20' tabIndex={2}>About</NavLink>
            {!user ? <>
                <NavLink to="/login" className='mlauto mr20' tabIndex={3}>Log in</NavLink>
                <NavLink to="/signup" tabIndex={4}>Sign up</NavLink>
            </> :
                <button onClick={() => signOut()}>Sign out</button>
            }
        </div>
    );
}

export default NavBar;