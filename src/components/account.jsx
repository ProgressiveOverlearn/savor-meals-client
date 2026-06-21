import { useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import loadingIcon from '../assets/loading.gif';

function Account({ user, setUser }) {

    const navigate = useNavigate();
    const [heightNumber, setHeightNumber] = useState(user.heightNumber || '');
    const [heightUnit, setHeightUnit] = useState(user.heightUnit || '');
    const [weightNumber, setWeightNumber] = useState(user.weightNumber || '');
    const [weightUnit, setWeightUnit] = useState(user.weightUnit || '');
    const [gender, setGender] = useState(user.gender || '');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [savedPlans, setSavedPlans] = useState([]);
    const [likedPlans, setLikedPlans] = useState([]);
    const [loading, setLoading] = useState(true);

        //used conditionally. if the user is logged in, use it. otherwise, you have to log in.
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch posts created by this user from the backend
                const postsResponse = await fetch(`https://savor-meals-server.onrender.com/api/meal-plans/user/${user.username}`); // local link: `http://localhost:8080/api/meal-plans/user/${user.username}`
                const postsData = await postsResponse.json();
                setUserPosts(Array.isArray(postsData) ? postsData : []);

                // Fetch full user profile to get savedPlans and likedPlans
                const userResponse = await fetch(`https://savor-meals-server.onrender.com/api/users/${user.username}`); // local link: `http://localhost:8080/api/users/${user.username}`
                const userData = await userResponse.json();
                setSavedPlans(userData.savedPlans || []);
                setLikedPlans(userData.likedPlans || []);

            } catch (err) {
                console.error('❌ Error fetching manage data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user.username]);

    if (loading) return (
        <main>
            <div className="p-1 m-1 has-text-centered">
                <p className="is-size-5">Cooking up your account dashboard, be patient!</p>
                <img src={loadingIcon} alt={"Loading"} width="50%"/>
            </div>
        </main>
    );

    const updateBodyMeasurements = async () => {

        // Check if only one of height fields is filled
        if (heightNumber && !heightUnit || !heightNumber && heightUnit) {
            setError('Please fill in both height number and unit.');
            return;
        }

        // Check if only one of weight fields is filled
        if (weightNumber && !weightUnit || !weightNumber && weightUnit) {
            setError('Please fill in both weight number and unit.');
            return;
        }

        // Check for negative or zero values
        if (heightNumber && heightNumber <= 0) {
            setError('Height must be a positive number.');
            return;
        }

        if (weightNumber && weightNumber <= 0) {
            setError('Weight must be a positive number.');
            return;
        }

        // Check for unrealistic values
        if (heightNumber && heightNumber > 120) {
            setError('Please enter a realistic height.');
            return;
        }

        if (weightNumber && weightNumber > 1000) {
            setError('Please enter a realistic weight.');
            return;
        }

        setError('');

        try {
            // local link: `http://localhost:8080/api/users/${user.username}`
            const response = await fetch(`https://savor-meals-server.onrender.com/api/users/${user.username}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ heightNumber, heightUnit, weightNumber, weightUnit, gender }),
            });

            if (!response.ok) {
                const err = await response.json();
                setError(err.error || 'Failed to update profile.');
                return;
            }

            const updatedData = await response.json();

            const height = heightNumber && heightUnit ? `${heightNumber} ${heightUnit}` : 'Not provided';
            const weight = weightNumber && weightUnit ? `${weightNumber} ${weightUnit}` : 'Not provided';

            const updatedUser = {
                ...user,
                heightNumber: updatedData.heightNumber,
                heightUnit: updatedData.heightUnit,
                weightNumber: updatedData.weightNumber,
                weightUnit: updatedData.weightUnit,
                gender: updatedData.gender,
                height,
                weight
            };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
            console.log('✅ Profile updated successfully!');
        } catch (err) {
            console.error('❌ Error updating profile:', err);
            setError('Something went wrong. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser({});
        navigate("/login");
    };

    return (
        <main>
            <div className="p-1 m-1">

                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">Account</h1>
                    <h2 className="p-1 m-1 is-size-5">Welcome, {user.username}!</h2>
                </div>

            <div className="p-2">
                <div className="columns is-multiline mb-1">

                {/* Profile information */}
                <div className="column is-12-mobile is-6-tablet is-3-desktop">
                    <div className="notification is-success is-light has-text-centered" style={{ height: '100%' }}>

                        <h3 className="is-size-5 has-text-weight-semibold mb-3">
                            <i className="fa-solid fa-circle-user"></i> User Information
                        </h3>
                        <p><strong>Username:</strong> {user.username}</p>

                        {isEditing ? (
                            <>
                                <div className="field">
                                    <label className="label has-text-black">Height:</label>
                                    <div className="field has-addons">
                                        <div className="control is-expanded">
                                            <input
                                                className="input"
                                                type="number"
                                                placeholder="Height number"
                                                value={heightNumber}
                                                onChange={(event) => setHeightNumber(event.target.value)}
                                            />
                                        </div>
                                        <div className="control">
                                            <div className="select is-success">
                                                <select value={heightUnit} onChange={(event) => setHeightUnit(event.target.value)}>
                                                    <option value="" disabled>Select unit</option>
                                                    <option value="inches">inches</option>
                                                    <option value="centimeters">centimeters</option>
                                                    <option value="">Don't provide</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label has-text-black">Weight:</label>
                                    <div className="field has-addons">
                                        <div className="control is-expanded">
                                            <input
                                                className="input"
                                                type="number"
                                                placeholder="Weight number"
                                                value={weightNumber}
                                                onChange={(event) => setWeightNumber(event.target.value)}
                                            />
                                        </div>
                                        <div className="control">
                                            <div className="select is-success">
                                                <select value={weightUnit} onChange={(event) => setWeightUnit(event.target.value)}>
                                                    <option value="" disabled>Select unit</option>
                                                    <option value="pounds">pounds</option>
                                                    <option value="kilograms">kilograms</option>
                                                    <option value="stones">stones</option>
                                                    <option value="">Don't provide</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label has-text-black">Gender:</label>
                                    <div className="control">
                                        <div className="select is-success">
                                            <select id="gender" name="gender" value={gender} onChange={(event) => setGender(event.target.value)}>
                                                <option value="" disabled>Select gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Non-binary">Non-binary</option>
                                                <option value="">Don't provide</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="has-text-danger has-text-centered mt-2 mb-2">{error}</p>}

                                <div className="mt-3 is-flex" style={{ gap: '0.5rem', justifyContent: 'center' }}>
                                    <button className="button is-success" onClick={updateBodyMeasurements}>
                                        <i className="fa-solid fa-check"></i>&nbsp;Save
                                    </button>
                                    <button className="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p><strong>Height:</strong> {user.heightNumber && user.heightUnit ? `${user.heightNumber} ${user.heightUnit}` : user.height || 'Not provided'}</p>
                                <p><strong>Weight:</strong> {user.weightNumber && user.weightUnit ? `${user.weightNumber} ${user.weightUnit}` : user.weight || 'Not provided'}</p>
                                <p><strong>Gender:</strong> {user.gender || 'Not provided'}</p>
                                <div className="mt-3 is-flex" style={{ gap: '0.5rem', justifyContent: 'center' }}>
                                    <button className="button is-success" onClick={() => setIsEditing(true)}>
                                        <i className="fa-solid fa-pen"></i>&nbsp;Change
                                    </button>
                                    <button className="button is-success is-warning" onClick={handleLogout}>
                                        <i className="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Posts */}
                <div className="column is-12-mobile is-6-tablet is-3-desktop">
                    <div className="notification is-success is-light has-text-centered" style={{ height: '100%' }}>
                        <h3 className="is-size-5 has-text-weight-semibold mb-3">
                            <i className="fa-solid fa-file-lines"></i> Posts: {userPosts.length}
                        </h3>
                        <div className="is-flex is-flex-direction-column" style={{ gap: '0.5rem', overflowY: 'auto', height: '300px' }}>
                            {userPosts.length === 0 ? (
                                <p className="is-size-7 has-text-grey">No posts yet.</p>
                            ) : (
                                userPosts.map((plan) => (
                                    <button key={plan.id} className="button is-success is-light is-fullwidth" onClick={() => navigate(`/view/${plan.id}`)}>
                                        <img src={plan.image} width="10%"></img>
                                        {plan.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Saves */}
                <div className="column is-12-mobile is-6-tablet is-3-desktop">
                    <div className="notification is-success is-light has-text-centered" style={{ height: '100%' }}>
                        <h3 className="is-size-5 has-text-weight-semibold mb-3">
                            <i className="fa-solid fa-bookmark"></i> Saves: {savedPlans.length}
                        </h3>
                        <div className="is-flex is-flex-direction-column" style={{ gap: '0.5rem', overflowY: 'auto', height: '300px' }}>
                            {savedPlans.length === 0 ? (
                                <p className="is-size-7 has-text-grey">No saves yet.</p>
                            ) : (
                                savedPlans.map((plan) => (
                                    <button key={plan.id || plan._id} className="button is-success is-light is-fullwidth" onClick={() => navigate(`/view/${plan.id || plan._id}`)}>
                                        <img src={plan.image} width="10%"></img>
                                        {plan.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Likes */}
                <div className="column is-12-mobile is-6-tablet is-3-desktop">
                    <div className="notification is-success is-light has-text-centered" style={{ height: '100%' }}>
                        <h3 className="is-size-5 has-text-weight-semibold mb-3">
                            <i className="fa-solid fa-heart"></i> Likes: {likedPlans.length}
                        </h3>
                        <div className="is-flex is-flex-direction-column" style={{ gap: '0.5rem', overflowY: 'auto', height: '300px' }}>
                            {likedPlans.length === 0 ? (
                                <p className="is-size-7 has-text-grey">No likes yet.</p>
                            ) : (
                                likedPlans.map((plan) => (
                                    <button key={plan.id || plan._id} className="button is-success is-light is-fullwidth" onClick={() => navigate(`/view/${plan.id || plan._id}`)}>
                                        <img src={plan.image} width="10%"></img>
                                        {plan.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                </div>
            </div>

            </div>
        </main>
    );
}

export default Account;