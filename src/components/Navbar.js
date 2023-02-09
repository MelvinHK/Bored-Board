import { NavLink } from 'react-router-dom'
import '../App.css'

function NavBar() {
    return (
        <ul className='nav'>
            <li><h3><NavLink to={'/'}>Bored Board</NavLink></h3></li>
            <li><NavLink to="/about">About</NavLink></li>
        </ul>
    )
}

export default NavBar