import { useEffect, useState } from 'react';

function Home() {

    // get the date then the day number of the week to know how many foods of the day we need to get from the api
    const today = new Date();
    const dayNumber = today.getDay();

    // useState to modify the food of the day
    const [food, setFood] = useState([]);

//interesting effects after rendering the page. use the dayNumber variable to determine how many times to call the api and then push the food image(s) into the total requests. then bring food images to the setter function. ****may be more suitable to do this server side to avoid spamming api calls ;)****
useEffect(() => {
    
    // allows the other functions to run and render while this runs
    const fetchFoods = async () => {
        const requests = [];
        
        // when awaiting for a response, execution of the fetchFoods function is paused
        for (let i = 0; i <= dayNumber; i++) {
            const response = await fetch('https://foodish-api.com/api/');
            const data = await response.json();
            requests.push(data.image);
        }
        setFood(requests);
    };
    
    fetchFoods();
}, []);

    return (
    <div className="p-1 m-1">
            
        <div className="p-1 m-1 has-text-centered">
            <h1 className="is-size-3 has-text-weight-bold">Home</h1>
            <h2 className="p-1 m-1 is-size-5">You've come to the right place if you savor food. Whether you are on a fitness journey or you just adore food, you are welcome here! If you click around, you'll find out you can:</h2>
        </div>

        <div className="p-2 m-2">
            <div className="columns">
                <div className="column">
                    <div className="notification is-success is-light has-text-centered">
                        <i className="fa-solid fa-file-circle-plus is-size-3"></i>
                        <p>Create and find meal plans with nutrition information by the community.</p>
                    </div>
                </div>
                <div className="column">
                    <div className="notification is-success is-light has-text-centered">
                        <i className="fa-brands fa-creative-commons-nc is-size-3"></i>
                        <p>Create a FREE account to share meal plans and inspire the community.</p>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="notification is-success is-light has-text-centered">
                        <i className="fa-solid fa-hashtag is-size-3"></i>
                        <p>Get an experience that is like social media, but with a foodie twist!</p>
                    </div>
                </div>
                <div className="column">
                    <div className="notification is-success is-light has-text-centered">
                        <i className="fa-solid fa-brain is-size-3"></i>
                        <p>Gain a better understanding of what you need for your health.</p>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="notification is-success is-light has-text-centered">
                        <i className="fa-solid fa-heart-pulse is-size-3"></i>
                        <p>Discover new foods that benefits your health and taste buds.</p>
                    </div>
                </div>
                <div className="column">
                    <div className="notification is-success is-light has-text-centered">
                        <i className="fa-solid fa-bullseye is-size-3"></i>
                        <p>Align your needs based on information provided to work towards goal(s)!</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="has-text-centered">
            <h2 className="is-size-5 p-2 m-2">Visit daily to see featured foods of each day of the week!</h2>

            <div className="columns p-2 m-2">
                 <div className="column has-text-centered">
                    <p className="mb-2"><strong>Sunday</strong></p>
                    <figure className="image is-square">
                        <img src={food[0] || "images/questionmark.png"} alt="sunday food of the day"/>
                    </figure>
                </div>   

                <div className="column has-text-centered">
                    <p className="mb-2"><strong>Monday</strong></p>
                    <figure className="image is-square">
                            <img src={food[1] || "images/questionmark.png"} alt="monday food of the day"/>
                    </figure>
                </div>

                <div className="column has-text-centered">
                    <p className="mb-2"><strong>Tuesday</strong></p>
                    <figure className="image is-square">
                        <img src={food[2] || "images/questionmark.png"} alt="tuesday food of the day"/>
                    </figure>
                </div>

                <div className="column has-text-centered">
                    <p className="mb-2"><strong>Wednesday</strong></p>
                    <figure className="image is-square">
                        <img src={food[3] || "images/questionmark.png"} alt="wednesday food of the day"/>
                    </figure>
                </div>

                <div className="column has-text-centered">
                    <p className="mb-2"><strong>Thursday</strong></p>
                    <figure className="image is-square">
                        <img src={food[4] || "images/questionmark.png"} alt="thursday food of the day"/>
                    </figure>
                </div>

                <div className="column has-text-centered">
                    <p className="mb-2"><strong>Friday</strong></p>
                    <figure className="image is-square">
                        <img src={food[5] || "images/questionmark.png"} alt="friday food of the day"/>
                    </figure>
                </div>

                <div className="column has-text-centered">
                    <p className="mb-2"><strong>Saturday</strong></p>
                    <figure className="image is-square">
                        <img src={food[6] || "images/questionmark.png"} alt="saturday food of the day"/>
                    </figure>
                </div>

            </div>
        </div>
    </div>
)}

export default Home;