function Footer() {

    return (
        <footer className="has-background-success-40 has-shadow has-text-white">
            <div className="columns is-justify-content-space-between">
                <div className="column p-3 m-1 has-text-centered">
                    <img src="images/SAVOR MEALS.png" alt="Logo" width="80" height="auto"/>
                </div>
                <div className="column has-text-centered is-flex is-flex-direction-column p-3 m-1">
                    <h3 className="is-size-5 has-text-weight-semibold">LINKS:</h3>
                    <ul>
                        <li><a className="has-text-white" href="/"><i className="fa-solid fa-house"></i>HOME</a></li>
                        <li><a className="has-text-white" href="/find"><i className="fa-solid fa-magnifying-glass"></i>FIND</a></li>
                        <li><a className="has-text-white" href="/create"><i className="fa-solid fa-plus"></i>CREATE</a></li>
                        <li><a className="has-text-white" href="/discover"><i className="fa-solid fa-map"></i>DISCOVER</a></li>
                    </ul>
                </div>
                <div className="column has-text-centered is-flex is-flex-direction-column p-3 m-1">
                    <h3 className="is-size-5 has-text-weight-semibold">FIND ME ON:</h3>
                    <ul>
                        <li><a className="has-text-white" href="https://github.com/ProgressiveOverlearn" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i>GitHub</a></li>
                        <li><a className="has-text-white" href="https://www.twitch.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-twitch"></i>Twitch</a></li>
                        <li><a className="has-text-white" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i>LinkedIn</a></li>
                    </ul>
                </div>
                <div className="column has-text-centered p-3 m-1">
                    <a href="https://progressiveoverlearn.wordpress.com/" target="_blank" rel="noopener noreferrer"><img src="images/progressiveoverlearn.png" alt="Creator Logo" width="100" height="100"/></a>
                </div>
            </div>

            <div className="p-3 has-text-centered">
                <p>DISCLAIMER: Meal plans, recipes, and nutritional information on this website are provided for informational purposes only and are not medical advice. Nutritional values are estimates and may vary. Consult a qualified healthcare professional before making dietary changes. You are responsible for your own health and dietary decisions.</p>
            </div>
        </footer>
    )
}
   
export default Footer;