import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function View() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/meal-plans/${id}`)
            .then(res => res.json())
            .then(data => {
                setPlan(Array.isArray(data) ? data[0] : data);
            })
            .catch(err => {
                console.error('❌ Error fetching meal plan:', err);
            });
    }, [id]);

    // Check localStorage to see if already liked or saved
    const savedPlans = JSON.parse(localStorage.getItem('savedPlans')) || [];
    const likedPlans = JSON.parse(localStorage.getItem('likedPlans')) || [];
    const [saved, setSaved] = useState(savedPlans.some((p) => p.id === parseInt(id)));
    const [liked, setLiked] = useState(likedPlans.some((p) => p.id === parseInt(id)));

    // Compute totals from meals array
    const totalCalories = plan?.meals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
    const totalFats = plan?.meals?.reduce((sum, meal) => sum + meal.fats, 0) || 0;
    const totalCarbs = plan?.meals?.reduce((sum, meal) => sum + meal.carbs, 0) || 0;
    const totalProtein = plan?.meals?.reduce((sum, meal) => sum + meal.protein, 0) || 0;

    const handleSave = () => {
        const savedPlans = JSON.parse(localStorage.getItem('savedPlans')) || [];
        if (saved) {
            const updated = savedPlans.filter((p) => p.id !== plan.id);
            localStorage.setItem('savedPlans', JSON.stringify(updated));
            setSaved(false);
        } else {
            savedPlans.push(plan);
            localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
            setSaved(true);
        }
    };

    const handleLike = () => {
        const likedPlans = JSON.parse(localStorage.getItem('likedPlans')) || [];
        if (liked) {
            const updated = likedPlans.filter((p) => p.id !== plan.id);
            localStorage.setItem('likedPlans', JSON.stringify(updated));
            setLiked(false);
        } else {
            likedPlans.push(plan);
            localStorage.setItem('likedPlans', JSON.stringify(likedPlans));
            setLiked(true);
        }
    };

    // what the user sees if the meal plan cannot be found
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
                                {plan.meals.map((meal, i) => (
                                    <div key={meal._id} className="column is-12-mobile is-4-tablet">
                                        <div className="box">
                                            <h3 className="has-text-weight-semibold mb-2">Meal {i + 1}: {meal.name}</h3>
                                            <p>{meal.ingredients}</p>
                                            <p><strong>Calories:</strong> {meal.calories}</p>
                                        </div>
                                    </div>
                                ))}
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