import { useState } from 'react';

function Header({ user }) {

//hamburger menu icon for smaller screens
const [isMenuOpen, setIsMenuOpen] = useState(false);

return (
    <header>
        <nav className="navbar has-background-success-40 has-shadow">
            <div className="navbar-brand p-3 m-1">
                <img src="images/SAVOR MEALS.png" alt="website logo" width="80" height="auto" />
                <a role="button" className="navbar-burger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </a>

            </div>

            {/* div has the navbar-menu classname no matter what, but gets additional classes if the burger icon shows up, causing the navigation links to show up after clicking the burger icon */}
            <div className={`navbar-menu ${isMenuOpen ? 'is-active has-background-success-40 has-shadow' : ''}`} id="nav-links">
                <div className="navbar-end">
                    <a className="navbar-item has-text-white" href="/"><i className="fa-solid fa-house"></i>HOME</a>
                    <a className="navbar-item has-text-white" href="/find"><i className="fa-solid fa-magnifying-glass"></i>FIND</a>
                    <a className="navbar-item has-text-white" href="/create"><i className="fa-solid fa-plus"></i>CREATE</a>
                    <a className="navbar-item has-text-white" href="/discover"><i className="fa-solid fa-map"></i>DISCOVER</a>
                    {/* Logged in? Show username and access settings. Otherwise, show ACCOUNT and sign in. */}
                    <a className="navbar-item has-text-white" href={user.username ? "/account" : "/login"}><i className="fa-solid fa-circle-user"></i>{user.username ? user.username: "ACCOUNT"}</a>
                </div>
            </div>
        </nav>
    </header>
    )  
}

export default Header;