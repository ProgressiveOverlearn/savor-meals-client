function Header({ user }) {

return (
    <header>
        <nav className="navbar has-background-success-40 has-shadow">
            <div className="navbar-brand p-3 m-1">
                <img src="images/SAVOR MEALS.png" alt="website logo" width="80" height="auto"/>
            </div>
            <div className="navbar-menu" id="nav-links">
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