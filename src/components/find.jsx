import { useNavigate } from "react-router-dom";
import { useState } from 'react';


function Find() {


        const handleButtonClick = () => {
            const params = new URLSearchParams();
            if (healthGoal) params.set('goal', healthGoal);
            if (numberOfMeals) params.set('meals', numberOfMeals);
            if (caloriesRange) params.set('calories', caloriesRange);
            navigate(`/results?${params.toString()}`);
        };

    const navigate = useNavigate();
    const [healthGoal, setHealthGoal] = useState('');
    const [numberOfMeals, setNumberOfMeals] = useState('');
    const [caloriesRange, setCaloriesRange] = useState('');

    return (
    <main>
        <div className="p-1 m-1">
            <div className="p-1 m-1 has-text-centered">
                <h1 className="is-size-3 has-text-weight-bold">Find A Meal Plan</h1>
                <h2 className="p-1 m-1 is-size-5">Please enter the filters below to find meal plans that have been created by other users.</h2>
            </div>

            <form>
                <div className="columns has-text-centered">
                    <div className="column">
                        <div className="field">
                            <label className="label" htmlFor="health-goals">Choose a health goal you're targeting:</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select id="health-goals" name="health-goals" value={healthGoal} onChange={(event) => setHealthGoal(event.target.value)}>
                                        <option value="" disabled>Select a goal</option>
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
                                        <option value="all">All goals</option>
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
                                    <select id="number-meals" name="number-meals" value={numberOfMeals} onChange={(event) => setNumberOfMeals(event.target.value)}>
                                        <option value="" disabled>Select a number</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="all">All numbers</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label" htmlFor="calories-range">Calories range:</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select id="calories-range" name="calories-range" value={caloriesRange} onChange={(event) => setCaloriesRange(event.target.value)}>
                                        <option value="" disabled>Select a range</option>
                                        <option value="0-500">0-500</option>
                                        <option value="500-1000">500-1000</option>
                                        <option value="1000-1500">1000-1500</option>
                                        <option value="1500-2000">1500-2000</option>
                                        <option value="2000-2500">2000-2500</option>
                                        <option value="2500-3000">2500-3000</option>
                                        <option value="3000+">3000+</option>
                                        <option value="all">All ranges</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="has-text-centered my-4">
                        <button id="search" className="button is-success" type="button" onClick={ handleButtonClick }>SEARCH</button>
                </div>

        </form>
        </div>
        </main>
    )
}
    
export default Find;