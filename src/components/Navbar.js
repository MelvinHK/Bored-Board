import { Link, NavLink } from 'react-router-dom'

function NavBar() {
    return (
        <div>
            <nav>
                <h1>
                    <Link to={'/'}>
                        Bored Board
                    </Link>
                </h1>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink></li>
                    <li>
                        <NavLink to="/about">About</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default NavBar