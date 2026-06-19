import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import loadingIcon from '../assets/loading.gif';

function View({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const planRes = await fetch(`https://savor-meals-server.onrender.com/api/meal-plans/${id}`);
                const planData = await planRes.json();

                if (planData.error) {
                    setPlan(null);
                } else {
                    const fetchedPlan = Array.isArray(planData) ? planData[0] : planData;
                    setPlan(fetchedPlan);

                    if (user?.username) {
                        const userRes = await fetch(`https://savor-meals-server.onrender.com/api/users/${user.username}`);
                        const userData = await userRes.json();

                        setSaved(userData.savedPlans?.some(p => p._id === fetchedPlan?._id?.toString()));
                        setLiked(userData.likedPlans?.some(p => p._id === fetchedPlan?._id?.toString()));
                    } else {
                        setSaved(false);
                        setLiked(false);
                    }
                }
            } catch (err) {
                console.error('❌ Error fetching data:', err);
                setPlan(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user?.username]);

    const totalCalories = plan?.meals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
    const totalFats = plan?.meals?.reduce((sum, meal) => sum + (meal.fats || 0), 0) || 0;
    const totalCarbs = plan?.meals?.reduce((sum, meal) => sum + (meal.carbs || 0), 0) || 0;
    const totalProtein = plan?.meals?.reduce((sum, meal) => sum + (meal.protein || 0), 0) || 0;

    const handleSave = async () => {
        if (!user?.username) { setError('You must be logged in to save meal plans!'); return; }
        try {
            await fetch(`https://savor-meals-server.onrender.com/api/users/${user.username}/save/${plan._id}`, {
                method: saved ? 'DELETE' : 'POST',
            });
            setSaved(!saved);
        } catch (err) {
            console.error('❌ Error saving plan:', err);
        }
    };

    const handleLike = async () => {
        if (!user?.username) { setError('You must be logged in to like meal plans!'); return; }
        try {
            await fetch(`https://savor-meals-server.onrender.com/api/users/${user.username}/like/${plan._id}`, {
                method: liked ? 'DELETE' : 'POST',
            });
            setLiked(!liked);
        } catch (err) {
            console.error('❌ Error liking plan:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this meal plan?')) return;
        try {
            const response = await fetch(`https://savor-meals-server.onrender.com/api/meal-plans/${plan.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) return;
            navigate('/find');
        } catch (err) {
            console.error('❌ Error deleting meal plan:', err);
        }
    };

    if (loading) return (
        <main>
            <div className="section p-4 has-text-centered">
                <p className="is-size-5 mb-3">Loading meal plan...</p>
                <img src={loadingIcon} alt="Loading..." style={{ maxWidth: '240px', width: '100%' }} />
            </div>
        </main>
    );

    if (!plan) return (
        <main>
            <div className="container p-4 has-text-centered">
                <p className="is-size-5">Meal plan not found. Let's try to find another one?</p>
                <button className="button is-success m-3" onClick={() => navigate('/find')}>Go Back</button>
            </div>
        </main>
    );

    return (
        <main>
            <div className="p-2 m-2">

                {/* Main Page Headers */}
                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">View Meal Plan</h1>
                    <h2 className="p-1 m-1 is-size-5">
                        More details of the meal plan. If you like what you see, consider saving it to your profile and liking it to show support!
                    </h2>
                </div>

                {/* Primary Content Card Container */}
                <div className="notification is-success is-light p-4 m-2">

                    {/* Navigation Actions Row */}
                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                        <button className="button is-success" onClick={() => navigate(-1)}>
                            <i className="fa-solid fa-arrow-left"></i>&nbsp;BACK
                        </button>
                        {error && <p className="has-text-danger has-text-weight-semibold is-size-7">{error}</p>}
                    </div>

                    {/* Integrated Header Title Panel */}
                    <div className="has-text-centered mb-4">
                        <div className="is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap mb-2">
                            <h2 className="is-size-3 has-text-weight-bold has-text-black mr-2 mb-0">
                                {plan.name}
                            </h2>
                            {plan.healthGoal && (
                                <span className="tag is-info is-light is-medium has-text-weight-semibold is-uppercase mt-1-mobile">
                                    <i className="fa-solid fa-bullseye"></i>&nbsp;&nbsp;{plan.healthGoal.replace('-', ' ')}
                                </span>
                            )}
                        </div>
                        <p className="is-size-6 has-text-grey-dark">
                            <i className="fa-solid fa-circle-user"></i> By {plan.creator}
                        </p>
                    </div>

                    {/* User Interactions Panel */}
                    <div className="buttons is-centered mb-5">
                        <button className={`button ${saved ? 'is-info' : 'is-success'}`} onClick={handleSave}>
                            <i className="fa-solid fa-bookmark"></i>&nbsp;{saved ? 'SAVED' : 'SAVE'}
                        </button>
                        <button className={`button ${liked ? 'is-info' : 'is-success'}`} onClick={handleLike}>
                            <i className="fa-solid fa-heart"></i>&nbsp;{liked ? 'LIKED' : 'LIKE'}
                        </button>
                    </div>

                    {/* Dashboard Section: Image & Macro Split Box */}
                    <div className="box p-0 mx-0 my-4 overflow-hidden" style={{ borderRadius: '8px' }}>
                        <div className="columns is-gapless is-desktop mb-0">
                            
                            {/* Left Component Side: Full Height Hero Food Image */}
                            <div className="column is-2-desktop">
                                <figure className="image is-cover" style={{ height: "100%" }}>
                                    <img 
                                        src={plan.image || "https://placehold.co/600x450?text=No+Meal+Image"} 
                                        alt={plan.name} 
                                        style={{ objectFit: "cover", width: "100%", height: "100%", minHeight: "240px" }}
                                    />
                                </figure>
                            </div>

                            {/* Right Component Side: Centered Macro Breakdown Metrics Grid */}
                            <div className="column is-10-desktop is-flex is-flex-direction-column is-justify-content-center p-5">
                                <h3 className="title is-5 has-text-centered mb-4">
                                    <i className="fa-solid fa-chart-pie has-text-success"></i>&nbsp;Nutrition Summary
                                </h3>
                                
                                <div className="columns is-mobile is-multiline has-text-centered mx-0">
                                    <div className="column is-6-mobile is-3-tablet">
                                        <div className="p-3">
                                            <p className="has-text-weight-bold is-size-4">{totalCalories}</p>
                                            <p className="is-size-7 font-weight-semibold uppercase">Calories</p>
                                        </div>
                                    </div>
                                    <div className="column is-6-mobile is-3-tablet">
                                        <div className="p-3">
                                            <p className="has-text-weight-bold is-size-4">{totalFats}g</p>
                                            <p className="is-size-7 font-weight-semibold uppercase">Fat</p>
                                        </div>
                                    </div>
                                    <div className="column is-6-mobile is-3-tablet">
                                        <div className="p-3">
                                            <p className="has-text-weight-bold is-size-4">{totalCarbs}g</p>
                                            <p className="is-size-7 font-weight-semibold uppercase">Carbs</p>
                                        </div>
                                    </div>
                                    <div className="column is-6-mobile is-3-tablet">
                                        <div className="p-3">
                                            <p className="has-text-weight-bold is-size-4">{totalProtein}g</p>
                                            <p className="is-size-7 font-weight-semibold uppercase">Protein</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mx-0 my-4">
                        <div className="columns is-multiline mb-2">
                            {plan.meals?.map((meal, index) => (
                                /* added is-flex to maintain structural equal row-heights card sizing grid */
                                <div key={meal._id || index} className="column is-12-mobile is-4-tablet is-flex">
                                    <div className="box is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
                                        <div>
                                            <h3 className="has-text-weight-bold is-size-5 mb-2">{meal.name}</h3>
                                            <p className="mb-3">{meal.ingredients}</p>
                                        </div>
                                        <p className="has-text-weight-medium">
                                            <span className="tag is-success is-light font-weight-bold">
                                                Calories: {meal.calories}
                                            </span>
                                        </p>
                                        <p className="has-text-weight-medium">
                                            <span className="tag is-success is-light font-weight-bold m-1">
                                                Fat: {meal.fats}g
                                            </span>
                                            <span className="tag is-success is-light font-weight-bold m-1">
                                                Carbs: {meal.carbs}g
                                            </span>
                                            <span className="tag is-success is-light font-weight-bold m-1">
                                                Protein: {meal.protein}g
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {user?.username === plan.creator && (
                            <div className="buttons is-centered mt-5 pt-4">
                                <button className="button is-warning px-4" onClick={() => navigate(`/create/edit/${plan.id}`)}>
                                    <i className="fa-solid fa-pen"></i>&nbsp;EDIT
                                </button>
                                <button className="button is-danger px-4" onClick={handleDelete}>
                                    <i className="fa-solid fa-trash"></i>&nbsp;DELETE
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}

export default View;