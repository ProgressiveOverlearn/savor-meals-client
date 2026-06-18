import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

function Find() {

    const navigate = useNavigate();
    const [healthGoal, setHealthGoal] = useState('all');
    const [numberOfMeals, setNumberOfMeals] = useState('all');
    const [caloriesRange, setCaloriesRange] = useState('all');
    const [filter, setFilter] = useState('First posted');
    const [planData, setPlanData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://savor-meals-server.onrender.com/api/meal-plans')
            .then(res => res.json())
            .then(data => {
                setPlanData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('❌ Error fetching meal plans:', err);
                setLoading(false);
            });
    }, []);

    // Filter planData based on selected filters
    const filteredPlans = planData.filter((plan) => {
        const goalMatch = healthGoal === 'all' || plan.healthGoal === healthGoal;
        const mealsMatch = numberOfMeals === 'all' || plan.numberOfMeals === parseInt(numberOfMeals);

        let caloriesMatch = true;
        if (caloriesRange !== 'all') {
            if (caloriesRange === '3000+') {
                caloriesMatch = plan.totalCalories >= 3000;
            } else {
                const [min, max] = caloriesRange.split('-').map(Number);
                caloriesMatch = plan.totalCalories >= min && plan.totalCalories <= max;
            }
        }

        return goalMatch && mealsMatch && caloriesMatch;
    });

    // Sort filtered results
    const getSortedResults = () => {
        switch (filter) {
            case 'A to Z':
                return [...filteredPlans].sort((a, b) => a.name.localeCompare(b.name));
            case 'Z to A':
                return [...filteredPlans].sort((a, b) => b.name.localeCompare(a.name));
            case 'Last posted':
                return [...filteredPlans].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'First posted':
            default:
                return [...filteredPlans].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    };

    const sortedResults = getSortedResults();

    return (
        <main>
            <div className="p-1 m-1">
                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">Find A Meal Plan</h1>
                    <h2 className="p-1 m-1 is-size-5">Use filters and sort to find meal plans created by other users. Hope you find what you like!</h2>
                </div>

                <div className="columns p-2 m-2">

                    {/* Left: Filters */}
                    <div className="column is-12-mobile is-3-tablet">
                        <div className="notification is-success is-light">
                            <h3 className="is-size-5 has-text-weight-semibold mb-3 has-text-centered">Filters</h3>

                            <div className="field">
                                <label className="label" htmlFor="health-goals">Health goal:</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select id="health-goals" value={healthGoal} onChange={(event) => setHealthGoal(event.target.value)}>
                                            <option value="all">All goals</option>
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

                            <div className="field">
                                <label className="label" htmlFor="number-meals">Number of meals:</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select id="number-meals" value={numberOfMeals} onChange={(event) => setNumberOfMeals(event.target.value)}>
                                            <option value="all">All numbers</option>
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

                            <div className="field">
                                <label className="label" htmlFor="calories-range">Calories range:</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select id="calories-range" value={caloriesRange} onChange={(event) => setCaloriesRange(event.target.value)}>
                                            <option value="all">All ranges</option>
                                            <option value="0-500">0-500</option>
                                            <option value="500-1000">500-1000</option>
                                            <option value="1000-1500">1000-1500</option>
                                            <option value="1500-2000">1500-2000</option>
                                            <option value="2000-2500">2000-2500</option>
                                            <option value="2500-3000">2500-3000</option>
                                            <option value="3000+">3000+</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="column is-12-mobile is-9-tablet">

                        {/* Sort bar */}
                        <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                            <p className="has-text-weight-semibold">Results: {sortedResults.length}</p>
                            <div className="is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                                <label className="label mb-0" htmlFor="find-sort">Sort By:</label>
                                <div className="select is-success">
                                    <select id="find-sort" value={filter} onChange={(event) => setFilter(event.target.value)}>
                                        <option>First posted</option>
                                        <option>Last posted</option>
                                        <option>A to Z</option>
                                        <option>Z to A</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="has-text-centered p-4">
                                <p className="is-size-5">Loading meal plans...</p>
                            </div>
                        ) : sortedResults.length === 0 ? (
                            <div className="has-text-centered p-4">
                                <p className="is-size-5">No meal plans found matching your filters.</p>
                            </div>
                        ) : (
                            <div style={{ maxHeight: '800px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                <div className="columns is-multiline">
                                    {sortedResults.map((plan) => (
                                        <div key={plan.id} className="column is-12-mobile is-half-tablet is-one-third-desktop is-flex">
                                            <div className="card" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <div className="card-image">
                                                    <figure className="image is-4by3">
                                                        <img src={plan.image} alt={plan.name} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                                                    </figure>
                                                </div>
                                                <div className="card-content has-text-centered" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                    <p className="has-text-weight-semibold">{plan.name}</p>
                                                    <p className="mb-2">{`by ${plan.creator}`}</p>
                                                    <button className="button is-success is-fullwidth mt-auto" onClick={() => navigate(`/view/${plan.id}`)}>
                                                        <i className="fa-solid fa-eye"></i>&nbsp;View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Find;