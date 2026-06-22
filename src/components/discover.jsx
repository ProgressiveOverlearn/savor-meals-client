import { useState, useEffect } from 'react';
import loadingIcon from '../assets/loading.gif';

const Discover = () => {
  const [allFoods, setAllFoods] = useState({});
  const [food, setFood] = useState([]);
  const [foodGroup, setFoodGroup] = useState('fats');
  const [loading, setLoading] = useState(true);

  const foodButtonNames = ['fats', 'dairy', 'proteins', 'fruits', 'vegetables', 'grains'];

  // fetch all foods once when page loads
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch('https://savor-meals-server.onrender.com/api/foods'); 
        const data = await response.json();

        // group foods by foodGroup field
        const grouped = data.reduce((acc, food) => {
          const group = food.foodGroup.toLowerCase();
          if (!acc[group]) acc[group] = [];
          acc[group].push(food);
          return acc;
        }, {});

        setAllFoods(grouped);
        setFood(grouped[foodGroup] || []); 
      } catch (error) {
        console.error('❌ Error fetching foods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [foodGroup]);

  const handleButtonClick = (buttonText) => {
    setFoodGroup(buttonText);
    setFood(allFoods[buttonText] || []);  
  };

  return (
    <main>
      <div className="p-3 m-1">

        {/* Header Section */}
        <div className="p-1 mb-5 has-text-centered">
          <h1 className="is-size-3 has-text-weight-bold">Discover</h1>
          <h2 className="p-1 m-1 is-size-5">
            Learn about foods that you may want to add into your meals. Click through the buttons to view foods by food group.
          </h2>
        </div>
    
        {/*Main view of the page. Food group buttons are on the left side for desktop and tablet. */}
        <div className="columns is-tablet">
          

          <div className="column is-3-desktop is-4-tablet">
            <div id="food-groups" className="mb-4">

              <div className="columns is-mobile is-multiline is-variable is-2">
                {foodButtonNames.map((group) => (
                  <div key={group} className="column is-4-mobile is-12-tablet">
                    <button
                      // highlights the button group name if it matches the foodGroup useState value
                      className={`button is-fullwidth ${foodGroup === group ? 'is-success' : 'is-light'}`}
                      id={group}
                      onClick={() => handleButtonClick(group)}
                    >
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="column is-9-desktop is-8-tablet">
            <div className="is-size-4 has-text-weight-semibold mb-4 text-left-desktop has-text-centered-mobile">
              <p id="current-food-group">
                {foodGroup ? foodGroup.charAt(0).toUpperCase() + foodGroup.slice(1) : "Select A Food Group"}
              </p>
            </div>

            <div className="mb-4" id="foods-by-group">
              <div className="columns is-mobile is-multiline has-text-centered" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {food.map((foodItem) => (
                  <div key={foodItem.name} className="column is-6-mobile is-4-tablet is-3-desktop">
                    <figure className="image is-square mb-2">
                      <img 
                        src={loading ? loadingIcon : foodItem.imageSrc} 
                        alt={loading ? 'Loading' : foodItem.name} 
                        style={{ objectFit: 'cover', borderRadius: '6px' }} 
                      />
                    </figure>
                    <p className="has-text-weight-medium">{foodItem.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default Discover;