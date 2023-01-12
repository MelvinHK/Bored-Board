import { Link, NavLink } from 'react-router-dom'
import '../App.css'

function NavBar() {
    return (
        <div>
            <ul className='nav'>
                <li>
                    <h3>
                        <Link to={'/'}>
                            Bored Board
                        </Link>
                    </h3>
                </li>
                <li>
                    <NavLink to="/about">About</NavLink>
                </li>
            </ul>
        </div>
    )
}

export default NavBar