import { useState, useEffect } from 'react';

const Discover = () => {
  const [allFoods, setAllFoods] = useState({});
  const [food, setFood] = useState([]);
  const [foodGroup, setFoodGroup] = useState('');

  const foodButtonNames = ['fats', 'dairy', 'proteins', 'fruits', 'vegetables', 'grains'];

  // fetch all foods once when page loads
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/foods');
        const data = await response.json();

        // group foods by foodGroup field
        const grouped = data.reduce((acc, food) => {
          const group = food.foodGroup.toLowerCase();
          if (!acc[group]) acc[group] = [];
          acc[group].push(food);
          return acc;
        }, {});

        setAllFoods(grouped);
      } catch (error) {
        console.error('❌ Error fetching foods:', error);
      }
    };

    fetchFoods();
  }, []); // runs once because of empty array

  const handleButtonClick = (buttonText) => {
    setFoodGroup(buttonText);
    setFood(allFoods[buttonText] || []);  // set food group based on the button pressed, then get all foods that belong to selected food group
  };

  return (
    <main>
      <div className="p-1 m-1">

        <div className="p-1 m-1 has-text-centered">
          <h1 className="is-size-3 has-text-weight-bold">Discover</h1>
          <h2 className="p-1 m-1 is-size-5">Learn about foods that you may want to add into your meals. Click through the yellow buttons to view foods by food group.</h2>
        </div>

        <div id="food-groups" className="p-2 my-2">
          <div className="columns is-mobile is-multiline is-centered has-text-centered">
            {foodButtonNames.map((group) => (
              <div key={group} className="column is-half-mobile is-narrow-tablet">
                <button
                  className="button is-warning is-fullwidth-mobile"
                  id={group}
                  onClick={() => handleButtonClick(group)}
                >
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="is-size-3 has-text-centered mb-4">
          <p id="current-food-group">
            {foodGroup ? foodGroup.charAt(0).toUpperCase() + foodGroup.slice(1) : "Select A Food Group"}
          </p>
        </div>

        <div className="mb-4" id="foods-by-group">
          <div className="columns is-multiline has-text-centered">
            {food.map((foodItem) => (
              <div key={foodItem.name} className="column is-12-mobile is-half-tablet is-one-quarter-desktop">
                <img className="image is-square" src={foodItem.imageSrc} alt={foodItem.name} />  {/* 👈 imageSrc */}
                <p>{foodItem.name}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
};

export default Discover;