import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function View({ user }) {

    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState(''); //errors to help the user what went wrong

useEffect(() => {
    const fetchData = async () => {
        try {
            const planRes = await fetch(`http://localhost:8080/api/meal-plans/${id}`);
            const planData = await planRes.json();
            const fetchedPlan = Array.isArray(planData) ? planData[0] : planData;
            setPlan(fetchedPlan);

            if (user?.username) {
                const userRes = await fetch(`http://localhost:8080/api/users/${user.username}`);
                const userData = await userRes.json();
                
                console.log('savedPlans:', userData.savedPlans);
                console.log('likedPlans:', userData.likedPlans);
                console.log('fetchedPlan._id:', fetchedPlan?._id);

                setSaved(userData.savedPlans?.some(p => p._id === fetchedPlan?._id?.toString()));
                setLiked(userData.likedPlans?.some(p => p._id === fetchedPlan?._id?.toString()));
            } else {
                setSaved(false);
                setLiked(false);
            }

        } catch (err) {
            console.error('❌ Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [id, user?.username]);

    // Compute totals from meals array
    const totalCalories = plan?.meals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
    const totalFats = plan?.meals?.reduce((sum, meal) => sum + meal.fats, 0) || 0;
    const totalCarbs = plan?.meals?.reduce((sum, meal) => sum + meal.carbs, 0) || 0;
    const totalProtein = plan?.meals?.reduce((sum, meal) => sum + meal.protein, 0) || 0;

const handleSave = async () => {
    console.log('user:', user);
    console.log('plan._id:', plan?._id);
    if (!user?.username) { navigate('/login'); return; }
    try {
        const res = await fetch(`http://localhost:8080/api/users/${user.username}/save/${plan._id}`, {
            method: saved ? 'DELETE' : 'POST',
        });
        console.log('save response status:', res.status);
        const data = await res.json();
        console.log('save response data:', data);
        setSaved(!saved);
    } catch (err) {
        console.error('❌ Error saving plan:', err);
    }
};

const handleLike = async () => {
    console.log('user:', user);
    console.log('plan._id:', plan?._id);
    if (!user?.username) { navigate('/login'); return; }
    try {
        const res = await fetch(`http://localhost:8080/api/users/${user.username}/like/${plan._id}`, {
            method: liked ? 'DELETE' : 'POST',
        });
        console.log('like response status:', res.status);
        const data = await res.json();
        console.log('like response data:', data);
        setLiked(!liked);
    } catch (err) {
        console.error('❌ Error liking plan:', err);
    }
};

    if (loading) return (
        <main>
            <div className="p-1 m-1 has-text-centered">
                <p className="is-size-5">Loading meal plan...</p>
            </div>
        </main>
    );

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