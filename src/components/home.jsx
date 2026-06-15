import { useEffect, useState } from 'react';

const Home = () => {
  const today = new Date();
  const dayNumber = today.getDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  

  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/foods-of-the-day?day=${dayNumber}`); //backend of personal project
        const data = await response.json();
        console.log(`Foods received: ${data}`);
        setFoods(data);
      } catch (error) {
        console.error('❌ Error fetching foods of the day:', error);
      }
    };

    fetchFoods();
  }, [dayNumber]);

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
        <h2 className="is-size-5 p-2 m-2">Visit daily to see featured recipes of each day of the week. Click on them and learn more!</h2>

        <div className="columns p-2 m-2">
          {days.map((day, i) => (
            <div className="column has-text-centered" key={day}>
              <p className="mb-2"><strong>{day}</strong></p>
              <figure className="image is-square">
                <a href={foods[i]?.url || '#'} target="_blank" rel="noreferrer">
                  <img
                    src={foods[i]?.image || "images/questionmark.png"} //
                    alt={foods[i]?.name || `${day} food of the day`}
                  />
                </a>
              </figure>
              <a href={foods[i]?.url || '#'} target="_blank" rel="noreferrer" className="is-size-6 has-text-weight-bold has-text-link-on-scheme">
                {foods[i]?.name || ''}
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;