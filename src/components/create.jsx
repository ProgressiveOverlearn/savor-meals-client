import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';

function Create({ user }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [planName, setPlanName] = useState('');
    const [healthGoal, setHealthGoal] = useState('weight-loss');
    const [numberOfMeals, setNumberOfMeals] = useState(1);
    const [caloriesGoal, setCaloriesGoal] = useState('');
    const [error, setError] = useState('');
    const [loadingNutrition, setLoadingNutrition] = useState(null);
    const [justUpdated, setJustUpdated] = useState(null);
    const [expandedMeal, setExpandedMeal] = useState(0);
    
    // Updated state structure initialization to include inputMode and image tracking
    const [meals, setMeals] = useState([
        { 
            name: '', 
            ingredients: '', 
            fats: '', 
            carbs: '', 
            protein: '', 
            calories: '',
            inputMode: 'text',    // 'text' or 'image'
            imageFile: null,      // Stores the actual File binary object for API uploading
            imagePreview: null    // Stores local blob URL for display
        }
    ]);

    if (!user?.username) {
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        if (isEditing) {
            fetch(`https://savor-meals-server.onrender.com/api/meal-plans/${id}`)
                .then(res => res.json())
                .then(data => {
                    const plan = Array.isArray(data) ? data[0] : data;
                    setPlanName(plan.name);
                    setHealthGoal(plan.healthGoal);
                    setNumberOfMeals(plan.numberOfMeals);
                    setCaloriesGoal(plan.caloriesGoal);
                    setMeals(plan.meals.map(meal => ({
                        name: meal.name,
                        ingredients: meal.ingredients || '',
                        fats: meal.fats,
                        carbs: meal.carbs,
                        protein: meal.protein,
                        calories: meal.calories,
                        inputMode: meal.ingredients ? 'text' : 'image', // dynamic fallback guess
                        imageFile: null,
                        imagePreview: null
                    })));
                })
                .catch(err => console.error('❌ Error fetching plan:', err));
        }
    }, [id, isEditing]);

    const currentCalories = meals.reduce((total, meal) => total + (parseFloat(meal.calories) || 0), 0);

    const handleNumberOfMeals = (event) => {
        const num = parseInt(event.target.value);
        setNumberOfMeals(num);
        const updatedMeals = Array.from({ length: num }, (_, i) => (
            meals[i] || { 
                name: '', 
                ingredients: '', 
                fats: '', 
                carbs: '', 
                protein: '', 
                calories: '', 
                inputMode: 'text', 
                imageFile: null, 
                imagePreview: null 
            }
        ));
        setMeals(updatedMeals);
    };

    const handleMealChange = (index, field, value) => {
        const updatedMeals = [...meals];
        updatedMeals[index][field] = value;

        if (field === 'fats' || field === 'carbs' || field === 'protein') {
            const clampedValue = Math.max(0, parseFloat(value) || 0);
            updatedMeals[index][field] = clampedValue;

            const fats = parseFloat(field === 'fats' ? clampedValue : updatedMeals[index].fats) || 0;
            const carbs = parseFloat(field === 'carbs' ? clampedValue : updatedMeals[index].carbs) || 0;
            const protein = parseFloat(field === 'protein' ? clampedValue : updatedMeals[index].protein) || 0;

            updatedMeals[index].calories = (fats * 9) + (carbs * 4) + (protein * 4);
        }
        setMeals(updatedMeals);
    };

    const getNutritionFromGemini = async (index) => {
        const meal = meals[index];
        const isTextMode = meal.inputMode === 'text';

        // Validation based on the chosen mode
        if (isTextMode && !meal.ingredients) {
            setError(`Please enter ingredients for Meal ${index + 1} before getting nutrition info.`);
            return;
        }
        if (!isTextMode && !meal.imageFile) {
            setError(`Please upload an image for Meal ${index + 1} before getting nutrition info.`);
            return;
        }

        setLoadingNutrition(index);
        setError('');

        try {
            let response;

            if (isTextMode) {
                // Text Analyzer Route
                response = await fetch('https://savor-meals-server.onrender.com/api/nutrition/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'text', name: meal.name, ingredients: meal.ingredients }),
                });
            } else {
                // Image Analyzer Route - uses Multipart/FormData payload
                const formData = new FormData();
                formData.append('type', 'image');
                formData.append('name', meal.name);
                formData.append('mealImage', meal.imageFile); // Matches common multer multi-part handling

                response = await fetch('https://savor-meals-server.onrender.com/api/nutrition/analyze', {
                    method: 'POST',
                    body: formData, // Browser sets Content-Type boundary automatically
                });
            }

            if (!response.ok) {
                setError('Could not get nutrition info. Try again.');
                setLoadingNutrition(null);
                return;
            }

            const data = await response.json();

            const updatedMeals = [...meals];
            updatedMeals[index].fats = data.fats || 0;
            updatedMeals[index].carbs = data.carbs || 0;
            updatedMeals[index].protein = data.protein || 0;
            updatedMeals[index].calories = (data.fats * 9) + (data.carbs * 4) + (data.protein * 4);
            setMeals(updatedMeals);

            setJustUpdated(index);
            setTimeout(() => setJustUpdated(null), 1500);

        } catch (err) {
            console.error('❌ Gemini nutrition error:', err);
            setError('Something went wrong getting nutrition info.');
        } finally {
            setLoadingNutrition(null);
        }
    };

    const handleSubmit = async () => {
        if (!planName.trim()) {
            setError('Please enter a meal plan name.');
            return;
        }
        if (!caloriesGoal || caloriesGoal <= 0) {
            setError('Please enter a valid calories goal.');
            return;
        }
        
        for (let i = 0; i < meals.length; i++) {
            if (!meals[i].name.trim()) {
                setError(`Please enter a name for Meal ${i + 1}.`);
                setExpandedMeal(i);
                return;
            }
            // Allow submission if text mode has text OR if image mode has an image selected
            if (meals[i].inputMode === 'text' && !meals[i].ingredients.trim()) {
                setError(`Please enter ingredients for Meal ${i + 1}.`);
                setExpandedMeal(i);
                return;
            }
            if (meals[i].inputMode === 'image' && !meals[i].imageFile && !isEditing) {
                setError(`Please upload an image for Meal ${i + 1}.`);
                setExpandedMeal(i);
                return;
            }
            if (!meals[i].calories || meals[i].calories <= 0) {
                setError(`Meal ${i + 1} must have calories greater than 0. Use "Get Nutrition Info" or enter manually.`);
                setExpandedMeal(i);
                return;
            }
        }

        const planData = {
            creator: user?.username || 'Anonymous',
            name: planName,
            healthGoal,
            numberOfMeals,
            caloriesGoal: parseInt(caloriesGoal),
            totalCalories: currentCalories,
            meals: meals.map(meal => ({
                name: meal.name,
                ingredients: meal.inputMode === 'text' ? meal.ingredients : '[Analyzed Photo]', 
                fats: parseFloat(meal.fats) || 0,
                carbs: parseFloat(meal.carbs) || 0,
                protein: parseFloat(meal.protein) || 0,
                calories: parseFloat(meal.calories) || 0,
            }))
        };

        try {
            const url = isEditing
                ? `https://savor-meals-server.onrender.com/api/meal-plans/${id}`
                : 'https://savor-meals-server.onrender.com/api/meal-plans/save-plan';

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData),
            });

            if (!response.ok) {
                const err = await response.json();
                setError(err.error || 'Failed to save meal plan.');
                return;
            }

            setError('');
            navigate(isEditing ? `/view/${id}` : '/find');
        } catch (err) {
            console.error('❌ Error saving meal plan:', err);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <main>
            <div className="p-1 m-1">
                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">
                        {isEditing ? 'Edit Meal Plan' : 'Create A Meal Plan'}
                    </h1>
                    <h2 className="p-1 m-1 is-size-5">
                        {isEditing ? 'Update your meal plan details below.' : 'Describe your meal plan. Fill in the details below and add meals.'}
                    </h2>
                </div>

                {/* Main Dashboard Layout Area */}
                <div className="columns is-desktop my-4">
                    
                    {/* Left Column Section: 2x2 Input Configuration Matrix */}
                    <div className="column is-8-desktop">
                        <div className="columns is-mobile is-multiline">
                            
                            {/* 1. Meal Plan Name */}
                            <div className="column is-6-mobile is-6-tablet">
                                <div className="field">
                                    <label className="label" htmlFor="meal-plan-name">Meal Plan Name:</label>
                                    <div className="control">
                                        <input className="input" type="text" id="meal-plan-name" placeholder="Enter meal plan name" value={planName} onChange={(event) => setPlanName(event.target.value)} />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Meal Plan Goal */}
                            <div className="column is-6-mobile is-6-tablet">
                                <div className="field">
                                    <label className="label" htmlFor="health-goals">Meal Plan Goal:</label>
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

                            {/* 3. Number of Meals */}
                            <div className="column is-6-mobile is-6-tablet">
                                <div className="field">
                                    <label className="label" htmlFor="number-meals">Number Of Meals:</label>
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

                            {/* 4. Calories Goal */}
                            <div className="column is-6-mobile is-6-tablet">
                                <div className="field">
                                    <label className="label" htmlFor="calories-goal">Calories Goal:</label>
                                    <div className="control">
                                        <input className="input" type="number" id="calories-goal" placeholder="Enter calories goal" value={caloriesGoal} onChange={(event) => setCaloriesGoal(Math.max(0, parseFloat(event.target.value) || 0))} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right column for the calorie counter to compare current calories to their goal */}
                    <div className="column is-4-desktop is-flex">
                        <div className="notification is-success is-light has-text-centered mb-2 is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-center">
                            <p className="has-text-weight-semibold">Calories So Far:</p>
                            {/* Progress bar shows the user how close they are to their calories goal. The value portion is filled in the color specified by className compared to the max. */}
                            <progress
                                className="progress is-success mt-2 mb-2"
                                value={currentCalories}
                                max={caloriesGoal || 1}
                            >
                                {currentCalories}
                            </progress>
                            
                            <div className="columns is-mobile is-centered mt-2">
                                <div className="column is-narrow">
                                    <p className="is-size-5 has-text-weight-bold">{currentCalories}</p>
                                    <p className="is-size-7">Current</p>
                                </div>
                                <div className="column is-narrow">
                                    <p className="is-size-5 has-text-weight-bold">{parseInt(caloriesGoal) || 0}</p>
                                    <p className="is-size-7">Goal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{ maxHeight: '700px', overflowY: 'auto', padding: '0.25rem' }}>
                    {meals.map((meal, index) => {
                        const isExpanded = expandedMeal === index;
                        const inputMode = meal.inputMode || 'text';

                        return (
                            <div key={index} className="notification is-success is-light p-4 mb-4">
                                <div
                                    className="is-flex is-justify-content-space-between is-align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setExpandedMeal(isExpanded ? null : index)}
                                >
                                    <h3 className="is-size-5 has-text-weight-semibold mb-0">
                                        Meal {index + 1}{meal.name && `: ${meal.name}`}
                                        {meal.calories > 0 && (
                                            <span className="is-size-7 has-text-grey ml-2">({meal.calories} cal)</span>
                                        )}
                                    </h3>
                                    <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                                </div>

                                {isExpanded && (
                                    <div className="mt-3">
                                        <div className="columns is-tablet">
                                            
                                            {/* Left Column: Form Details & Macro Grid */}
                                            <div className="column is-half-tablet">
                                                <div className="field">
                                                    <label className="label has-text-black">Meal Name:</label>
                                                    <input
                                                        className="input"
                                                        type="text"
                                                        placeholder="e.g. teriyaki chicken bowl"
                                                        value={meal.name}
                                                        onChange={(event) => handleMealChange(index, 'name', event.target.value)}
                                                    />
                                                </div>

                                                <p className="has-text-weight-semibold mb-2 has-text-black">
                                                    Nutrition Info <span className="is-size-7 has-text-grey">(auto-filled or enter manually)</span>
                                                    {justUpdated === index && (
                                                        <span className="has-text-success ml-2">
                                                            <i className="fa-solid fa-check"></i> Updated!
                                                        </span>
                                                    )}
                                                </p>
                                                
                                                {/* Macro Fields: Forced Grid View */}
                                                <div className="columns is-mobile is-multiline">
                                                    <div className="column is-6-mobile is-3-tablet">
                                                        <div className="field">
                                                            <label className="label has-text-black">Calories:</label>
                                                            <input className="input" type="number" placeholder="e.g. 445" value={meal.calories} disabled />
                                                        </div>
                                                    </div>
                                                    <div className="column is-6-mobile is-3-tablet">
                                                        <div className="field">
                                                            <label className="label has-text-black">Fats (g):</label>
                                                            <input className="input" type="number" placeholder="e.g. 5" value={meal.fats} onChange={(event) => handleMealChange(index, 'fats', event.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="column is-6-mobile is-3-tablet">
                                                        <div className="field">
                                                            <label className="label has-text-black">Carbs (g):</label>
                                                            <input className="input" type="number" placeholder="e.g. 80" value={meal.carbs} onChange={(event) => handleMealChange(index, 'carbs', event.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="column is-6-mobile is-3-tablet">
                                                        <div className="field">
                                                            <label className="label has-text-black">Protein (g):</label>
                                                            <input className="input" type="number" placeholder="e.g. 25" value={meal.protein} onChange={(event) => handleMealChange(index, 'protein', event.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Toggle Mode Component Area */}
                                            <div className="column is-half-tablet">
                                                <label className="label has-text-black">Get Nutrition Info With:</label>
                                                <div className="buttons has-addons mb-2 is-centered">
                                                    <button 
                                                        type="button"
                                                        className={`button is-small ${inputMode === 'text' ? 'is-success is-selected' : ''}`}
                                                        onClick={() => handleMealChange(index, 'inputMode', 'text')}
                                                    >
                                                        <i className="fa-solid fa-font"></i>&nbsp;Ingredients List
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        className={`button is-small ${inputMode === 'image' ? 'is-success is-selected' : ''}`}
                                                        onClick={() => handleMealChange(index, 'inputMode', 'image')}
                                                    >
                                                        <i className="fa-solid fa-image"></i>&nbsp;Meal Image
                                                    </button>
                                                </div>

                                                {inputMode === 'text' ? (
                                                    <div className="field">
                                                        <label className="label has-text-black">Measured Ingredients:</label>
                                                        <textarea
                                                            className="input mb-2"
                                                            style={{ height: "120px" }} 
                                                            placeholder="Measurements give more accurate nutrition information!"
                                                            value={meal.ingredients}
                                                            onChange={(event) => handleMealChange(index, 'ingredients', event.target.value)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="field">
                                                        <label className="label">Upload Meal Photo:</label>
                                                        <div className="file is-boxed is-success is-fullwidth mb-2">
                                                            <label className="file-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <input 
                                                                    className="file-input" 
                                                                    type="file" 
                                                                    accept="image/*"
                                                                    onChange={(event) => {
                                                                        const file = event.target.files[0];
                                                                        if (file) {
                                                                            handleMealChange(index, 'imageFile', file);
                                                                            handleMealChange(index, 'imagePreview', URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="file-cta has-text-centered" style={{ width: '100%', height: meal.imagePreview ? '55px' : '120px', justifyContent: 'center' }}>
                                                                    <span className="file-icon mx-auto">
                                                                        <i className="fa-solid fa-upload"></i>
                                                                    </span>
                                                                    <span className="file-label">
                                                                        {meal.imageFile ? meal.imageFile.name : "Choose a photo..."}
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        </div>

                                                        {meal.imagePreview && (
                                                            <div className="image mb-2" style={{ overflow: 'hidden', borderRadius: '4px', maxHeight: '120px' }}>
                                                                <img src={meal.imagePreview} alt="Meal preview" style={{ objectFit: 'cover', height: '120px', width: '100%' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <button
                                                    className={`button is-success is-fullwidth ${loadingNutrition === index ? 'is-loading' : ''}`}
                                                    type="button"
                                                    onClick={() => getNutritionFromGemini(index)}
                                                    disabled={loadingNutrition === index}
                                                >
                                                    <i className="fa-solid fa-brain"></i>&nbsp;Get Nutrition Info
                                                </button>
                                                <p className="is-size-7 has-text-grey mt-1">This will overwrite any manually entered values below.</p>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Error handling notification block */}
                {error && <p className="has-text-danger has-text-centered mb-3">{error}</p>}

                {/* Submission and Control Navigation Footer */}
                <div className="has-text-centered my-4">
                    <div className="buttons is-centered">
                        <button className="button is-success" type="button" onClick={handleSubmit}>
                            {isEditing ? 'UPDATE MEAL PLAN' : 'SUBMIT MEAL PLAN'}
                        </button>
                        {isEditing && (
                            <button className="button" type="button" onClick={() => navigate(`/view/${id}`)}>
                                <i className="fa-solid fa-x"></i>&nbsp;CANCEL
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Create;