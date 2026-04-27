import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import planData from '../data/planData';

function View() {

    const { id } = useParams();
    const navigate = useNavigate();
    const plan = planData.find((mealPlan) => mealPlan.id === parseInt(id));

    const totalCalories = Array.from({ length: plan?.numberOfMeals }, (_, i) => plan[`meal${i + 1}Calories`] || 0).reduce((a, b) => a + b, 0);
    const totalFats = Array.from({ length: plan?.numberOfMeals }, (_, i) => plan[`meal${i + 1}Fats`] || 0).reduce((a, b) => a + b, 0);
    const totalCarbs = Array.from({ length: plan?.numberOfMeals }, (_, i) => plan[`meal${i + 1}Carbs`] || 0).reduce((a, b) => a + b, 0);
    const totalProtein = Array.from({ length: plan?.numberOfMeals }, (_, i) => plan[`meal${i + 1}Protein`] || 0).reduce((a, b) => a + b, 0);

    // Check localStorage to see if already liked or saved
    const savedPlans = JSON.parse(localStorage.getItem('savedPlans')) || [];
    const likedPlans = JSON.parse(localStorage.getItem('likedPlans')) || [];
    const [saved, setSaved] = useState(savedPlans.some((p) => p.id === parseInt(id)));
    const [liked, setLiked] = useState(likedPlans.some((p) => p.id === parseInt(id)));

    const handleSave = () => {
        const savedPlans = JSON.parse(localStorage.getItem('savedPlans')) || [];
        if (saved) {
            // Remove from saves
            const updated = savedPlans.filter((p) => p.id !== plan.id);
            localStorage.setItem('savedPlans', JSON.stringify(updated));
            setSaved(false);
        } else {
            // Add to saves
            savedPlans.push(plan);
            localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
            setSaved(true);
        }
    };

    const handleLike = () => {
        const likedPlans = JSON.parse(localStorage.getItem('likedPlans')) || [];
        if (liked) {
            // Remove from likes
            const updated = likedPlans.filter((p) => p.id !== plan.id);
            localStorage.setItem('likedPlans', JSON.stringify(updated));
            setLiked(false);
        } else {
            // Add to likes
            likedPlans.push(plan);
            localStorage.setItem('likedPlans', JSON.stringify(likedPlans));
            setLiked(true);
        }
    };

    if (!plan) {
        return (
            <main>
                <div className="p-1 m-1 has-text-centered">
                    <p className="is-size-5">Meal plan not found.</p>
                    <button className="button is-success mt-3" onClick={() => navigate('/find')}>
                        Go Back
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="p-1 m-1">

                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">Meal Plan Details</h1>
                    <h2 className="p-1 m-1 is-size-5">SAVE to add the meal plan to your profile. LIKE if you find it useful, or go BACK to view the search results.</h2>
                </div>

                <div className="notification is-success is-light p-4 m-4">

                    <div className="has-text-centered mb-4">
                        <h2 className="is-size-4 has-text-weight-bold">{plan.name}</h2>
                        <p><i className="fa-solid fa-circle-user"></i> {plan.creator}</p>
                    </div>

                    <div className="columns is-multiline">

                        <div className="column is-12-mobile is-12-tablet is-5-desktop">
                            <figure className="image is-4by3">
                                <img src={plan.image} alt={plan.name} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                            </figure>
                        </div>

                        <div className="column is-12-mobile is-12-tablet is-7-desktop">

                            {/* Meals */}
                            <div className="columns is-multiline mb-2">
                                {Array.from({ length: plan.numberOfMeals }, (_, i) => {
                                    const num = i + 1;
                                    return (
                                        <div key={num} className="column is-12-mobile is-4-tablet">
                                            <div className="box">
                                                <h3 className="has-text-weight-semibold mb-2">Meal {num}: {plan[`meal${num}Name`]}</h3>
                                                <p>{plan[`meal${num}Ingredients`]}</p>
                                                <p><strong>Calories:</strong> {plan[`meal${num}Calories`]}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Macronutrients */}
                            <div className="box mb-4">
                                <h3 className="has-text-weight-semibold mb-2 has-text-centered">
                                    <i className="fa-solid fa-chart-pie"></i> Macronutrients
                                </h3>
                                <div className="columns is-mobile is-multiline has-text-centered">
                                    <div className="column is-half-mobile is-3-tablet">
                                        <p className="has-text-weight-bold is-size-5">{totalCalories}</p>
                                        <p className="is-size-7">Calories</p>
                                    </div>
                                    <div className="column is-half-mobile is-3-tablet">
                                        <p className="has-text-weight-bold is-size-5">{totalFats}g</p>
                                        <p className="is-size-7">Fat</p>
                                    </div>
                                    <div className="column is-half-mobile is-3-tablet">
                                        <p className="has-text-weight-bold is-size-5">{totalCarbs}g</p>
                                        <p className="is-size-7">Carbs</p>
                                    </div>
                                    <div className="column is-half-mobile is-3-tablet">
                                        <p className="has-text-weight-bold is-size-5">{totalProtein}g</p>
                                        <p className="is-size-7">Protein</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="buttons is-centered">
                                <button className={`button ${saved ? 'is-warning' : 'is-success'}`} onClick={handleSave}>
                                    <i className="fa-solid fa-bookmark"></i>&nbsp;{saved ? 'SAVED' : 'SAVE'}
                                </button>
                                <button className={`button ${liked ? 'is-danger' : 'is-success'}`} onClick={handleLike}>
                                    <i className="fa-solid fa-heart"></i>&nbsp;{liked ? 'LIKED' : 'LIKE'}
                                </button>
                                <button className="button is-success" onClick={() => navigate(-1)}>
                                    <i className="fa-solid fa-arrow-left"></i>&nbsp;BACK
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}

export default View;