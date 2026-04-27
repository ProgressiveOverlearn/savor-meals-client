import { useState} from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import planData from '../data/planData';

function Create({ user }) {

    const navigate = useNavigate();
    const [planName, setPlanName] = useState('');
    const [healthGoal, setHealthGoal] = useState('weight-loss');
    const [numberOfMeals, setNumberOfMeals] = useState(1);
    const [caloriesGoal, setCaloriesGoal] = useState('');
    const [error, setError] = useState('');
    // Generate the information each meal will have for data entry
    const [meals, setMeals] = useState([
        { name: '', ingredients: '', fats: '', carbs: '', protein: '', calories: '' }
    ]);

    // Require an account to create meal plans
    if (!user?.username) {
        return <Navigate to="/login" />;
    }

    // Helps keep track of calories across all meals entered
    const currentCalories = meals.reduce((total, meal) => total + (parseFloat(meal.calories) || 0), 0);

    // When number of meals changes, add or remove meal objects
    const handleNumberOfMeals = (event) => {
        const num = parseInt(event.target.value);
        setNumberOfMeals(num);

        const updatedMeals = Array.from({ length: num }, (_, i) => (
            meals[i] || { name: '', ingredients: '', fats: '', carbs: '', protein: '', calories: '' }
        ));
        setMeals(updatedMeals);
    };

    // Update a specific meal's field
const handleMealChange = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index][field] = value;

    // Auto-calculate calories from macros when any macro changes. Also clamp values to only 0 and above
    if (field === 'fats' || field === 'carbs' || field === 'protein') {
        const clampedValue = Math.max(0, parseFloat(value) || 0); // returns the largest value, which can be zero!
        updatedMeals[index][field] = clampedValue;

        const fats = parseFloat(field === 'fats' ? clampedValue : updatedMeals[index].fats) || 0;
        const carbs = parseFloat(field === 'carbs' ? clampedValue : updatedMeals[index].carbs) || 0;
        const protein = parseFloat(field === 'protein' ? clampedValue : updatedMeals[index].protein) || 0;

        updatedMeals[index].calories = (fats * 9) + (carbs * 4) + (protein * 4);
    }
        setMeals(updatedMeals);
    };


    const handleSubmit = () => {

        // Validate required fields like plan name, calories goal, meal numbers, and calories goal
        if (!planName) {
            setError('Please enter a meal plan name.');
            return;
        }
        if (!caloriesGoal || caloriesGoal < 0) {
            setError('Please enter a valid calories goal.');
            return;
        }
        
        for (let i = 0; i < meals.length; i++) {
            if (!meals[i].name || !meals[i].ingredients) {
                setError(`Please fill in the name and ingredients for Meal ${i + 1}.`);
                return;
            }
            if (!meals[i].calories || meals[i].calories <= 0) {
                setError(`Meal ${i + 1} must have calories greater than 0. Please enter valid values.`);
                return;
    }
        }

        // Build new meal plan object
        const newPlan = {
            id: planData.length + 1,
            name: planName,
            image: 'https://placehold.co/400x300?text=' + planName.replace(/ /g, '+'),
            creator: user?.username || 'Anonymous',
            healthGoal,
            numberOfMeals,
            totalCalories: parseInt(caloriesGoal),
        };

        // Add each meal's data to the plan
        meals.forEach((meal, i) => {
            const num = i + 1;
            newPlan[`meal${num}Name`] = meal.name;
            newPlan[`meal${num}Ingredients`] = meal.ingredients;
            newPlan[`meal${num}Fats`] = parseFloat(meal.fats) || 0;
            newPlan[`meal${num}Carbs`] = parseFloat(meal.carbs) || 0;
            newPlan[`meal${num}Protein`] = parseFloat(meal.protein) || 0;
            newPlan[`meal${num}Calories`] = parseFloat(meal.calories) || 0;
        });

        // Push to planData and navigate to results
        planData.push(newPlan);
        setError('');
        navigate('/find');

        // Save user's created plans to localStorage. MORE IMPORTANT FOR BACKEND because the meal plans will not persist right now...even though i can create the meal plans and peak at them until i move into another page
        const userPlans = JSON.parse(localStorage.getItem('userPlans')) || [];
        userPlans.push(newPlan);
        localStorage.setItem('userPlans', JSON.stringify(userPlans));
    };

    // MAIN PORTION OF THE CODE
    return (
        <main>
            <div className="p-1 m-1">
                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">Create A Meal Plan</h1>
                    <h2 className="p-1 m-1 is-size-5">Describe your meal plan. Fill in the details below and add meals.</h2>
                </div>

                {/* Plan Details */}
                <div className="columns has-text-centered">
                    <div className="column">
                        <div className="field">
                            <label className="label" htmlFor="meal-plan-name">Meal Plan Name:</label>
                            <div className="control">
                                <input className="input" type="text" id="meal-plan-name" placeholder="Enter meal plan name" value={planName} onChange={(event) => setPlanName(event.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label" htmlFor="health-goals">Goal for your meal plan:</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select id="health-goals" value={healthGoal} onChange={(event) => setHealthGoal(event.target.value)}>
                                        <option value="weight-loss">Weight Loss</option>
                                        <option value="muscle-gain">Muscle Gain</option>
                                        <option value="low-budget">Low Budget</option>
                                        <option value="quick-prep">Quick Prep</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="heart-health">Heart Health</option>
                                        <option value="energy-boost">Energy Boost</option>
                                        <option value="gut-health">Gut Health</option>
                                        <option value="mental-clarity">Mental Clarity</option>
                                        <option value="athletic-performance">Athletic Performance</option>
                                        <option value="immune-support">Immune Support</option>
                                        <option value="better-sleep">Better Sleep</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label" htmlFor="number-meals">Number of meals:</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select id="number-meals" value={numberOfMeals} onChange={handleNumberOfMeals}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label" htmlFor="calories-goal">Calories goal:</label>
                            <div className="control">
                                {/* Also clamps calorie goal */}
                                <input className="input" type="number" id="calories-goal" placeholder="Enter calories goal" value={caloriesGoal} onChange={(event) => setCaloriesGoal(Math.max(0, parseFloat(event.target.value) || 0))}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="columns is-centered">
                    <div className="column is-half">
                        <div className="notification is-success is-light has-text-centered mb-2">
                            <p className="has-text-weight-semibold">Calories so far:</p>
                            <div className="columns is-mobile is-centered mt-2">
                                <div className="column is-narrow">
                                    <p className="is-size-5 has-text-weight-bold">{currentCalories}</p>
                                    <p className="is-size-7">Current</p>
                                </div>
                                <div className="column is-narrow">
                                    <p className="is-size-5 has-text-weight-bold">{parseInt(caloriesGoal) || "Enter calories goal"}</p>
                                    <p className="is-size-7">Goal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                        

                {/* Dynamic Meal Forms */}
                {meals.map((meal, index) => (
                    <div key={index} className="notification is-success is-light p-4 mb-4">
                        <h3 className="is-size-5 has-text-weight-semibold mb-3">Meal {index + 1}</h3>

                        <div className="columns">
                            <div className="column">
                                <div className="field">
                                    <label className="label">Meal Name:</label>
                                    <input className="input" type="text" placeholder="e.g. Bean Soup" value={meal.name} onChange={(event) => handleMealChange(index, 'name', event.target.value)} />
                                </div>
                            </div>
                            <div className="column">
                                <div className="field">
                                    <label className="label">Ingredients:</label>
                                    <input className="input" type="text" placeholder="e.g. 8 oz tomato soup, chickpeas" value={meal.ingredients} onChange={(event) => handleMealChange(index, 'ingredients', event.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Nutrition Info - entering manually for now, API later */}
                        <p className="has-text-weight-semibold mb-2">Nutrition Info <span className="is-size-7 has-text-grey">(enter manually for now)</span></p>
                        <div className="columns">
                            <div className="column">
                                <div className="field">
                                    <label className="label">Calories:</label>
                                    <input className="input" type="number" placeholder="e.g. 445" value={meal.calories} onChange={(event) => handleMealChange(index, 'calories', event.target.value)} disabled/>
                                </div>
                            </div>
                            <div className="column">
                                <div className="field">
                                    <label className="label">Fats (g):</label>
                                    <input className="input" type="number" placeholder="e.g. 5" value={meal.fats} onChange={(event) => handleMealChange(index, 'fats', event.target.value)} />
                                </div>
                            </div>
                            <div className="column">
                                <div className="field">
                                    <label className="label">Carbs (g):</label>
                                    <input className="input" type="number" placeholder="e.g. 80" value={meal.carbs} onChange={(event) => handleMealChange(index, 'carbs', event.target.value)} />
                                </div>
                            </div>
                            <div className="column">
                                <div className="field">
                                    <label className="label">Protein (g):</label>
                                    <input className="input" type="number" placeholder="e.g. 25" value={meal.protein} onChange={(event) => handleMealChange(index, 'protein', event.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Error message */}
                {error && <p className="has-text-danger has-text-centered mb-3">{error}</p>}

                {/* Submit */}
                <div className="has-text-centered my-4">
                    <button className="button is-success" type="button" onClick={handleSubmit}>
                        SUBMIT MEAL PLAN
                    </button>
                </div>

            </div>
        </main>
    );
}

export default Create;