import { NavLink } from 'react-router-dom';
import '../App.css';

function NavBar() {
    return (
        <div className='nav'>
            <h3><NavLink to={'/'} tabIndex={1}>Bored Board</NavLink></h3>
            <NavLink to="/about" className='ml20' tabIndex={2}>About</NavLink>
            <NavLink to="/login" className='mlauto mr20' tabIndex={3}>Log in</NavLink>
            <NavLink to="/signup" tabIndex={4}>Sign up</NavLink>
        </div>
    );
}

export default NavBar;