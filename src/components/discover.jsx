import { useState } from 'react';
import foodData from '../data/foodData';

function Discover() {

    const [food, setFood] = useState([]);
    const [foodGroup, setFoodGroup] = useState('');
    
    const foodButtonNames = ['fats', 'dairy', 'proteins', 'fruits', 'vegetables', 'grains'];

    const handleButtonClick = (buttonText) => {
        setFoodGroup(buttonText);

        switch (buttonText) {
            case 'fats':
                setFood(foodData.fats);
                break;
            case 'dairy':
                setFood(foodData.dairy);
                break;
            case 'proteins':
                setFood(foodData.proteins);
                break;
            case 'fruits':
                setFood(foodData.fruits);
                break;
            case 'vegetables':
                setFood(foodData.vegetables);
                break;
            case 'grains':
                setFood(foodData.grains);
                break;
            default:
                setFood([]);
        }
    };

    return (
        <main>
            <div className="p-1 m-1">

                {/* Header */}
                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">Discover</h1>
                    <h2 className="p-1 m-1 is-size-5">Learn about foods that you may want to add into your meals. Click through the yellow buttons to view foods by food group.</h2>
                </div>

                {/* Food group buttons */}
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

                {/* Current food group label */}
                <div className="is-size-3 has-text-centered mb-4">
                    <p id="current-food-group">
                        {foodGroup ? foodGroup.charAt(0).toUpperCase() + foodGroup.slice(1) : "Select A Food Group"}
                    </p>
                </div>

                {/* Food images. Done after changing food group after button click. */}
                <div className="mb-4" id="foods-by-group">
                    <div className="columns is-multiline has-text-centered">
                        {food.map((foodItem) => (
                            <div key={foodItem.name} className="column is-12-mobile is-half-tablet is-one-quarter-desktop">
                                <img className= "image is-square" src={foodItem.image} alt={foodItem.name} />
                                <p>{foodItem.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Discover;