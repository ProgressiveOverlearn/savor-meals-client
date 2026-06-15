import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import planData from '../data/planData';

function Results() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('First posted');
    const [planData, setPlanData] = useState([]);

    // Read filters from URL
    const healthGoal = searchParams.get('goal');
    const numberOfMeals = searchParams.get('meals');
    const caloriesRange = searchParams.get('calories');

        useEffect(() => {
        fetch('http://localhost:8080/api/meal-plans')
            .then(res => res.json())
            .then(data => {
                setPlanData(data);
            })
            .catch(err => {
                console.error('❌ Error fetching meal plans:', err);
            });
    }, []);

    // Filter planData based on URL params
    const filteredPlans = planData.filter((plan) => {
        const goalMatch = !healthGoal || healthGoal === 'all' || plan.healthGoal === healthGoal;
        const mealsMatch = !numberOfMeals || numberOfMeals === 'all' || plan.numberOfMeals === parseInt(numberOfMeals);

        let caloriesMatch = true;
        if (caloriesRange && caloriesRange !== 'all') {
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
                    <h1 className="is-size-3 has-text-weight-bold">Meal Plan Results</h1>
                    <h2 className="p-1 m-1 is-size-5">Click on a meal plan through the results to view it with more information.</h2>
                </div>

                <div className="p-2 m-2">

                    {/* Sort bar */}
                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                        <p className="has-text-weight-semibold">Results: {`${sortedResults.length}`}</p>
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

                    {sortedResults.length === 0 ? (
                        <div className="has-text-centered p-4">
                            <p className="is-size-5">No meal plans found matching your filters. Click on the BACK button to search again.</p>
                        </div>
                    ) : (
                        <div className="columns is-multiline">
                            {sortedResults.map((plan) => (
                                <div key={plan.id} className="column is-12-mobile is-half-tablet is-one-quarter-desktop is-flex">
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
                    )}

                    {/* Back button */}
                    <div className="has-text-centered mt-4">
                        <a href="/find" className="button is-success">
                            <i className="fa-solid fa-arrow-left"></i>&nbsp;BACK
                        </a>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default Results;