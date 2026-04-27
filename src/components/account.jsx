import { useNavigate } from "react-router-dom";
import { useState } from 'react';

function Account({ user, setUser }) {

    const navigate = useNavigate();
    const [heightNumber, setHeightNumber] = useState();
    const [heightUnit, setHeightUnit] = useState('');
    const [weightNumber, setWeightNumber] = useState();
    const [weightUnit, setWeightUnit] = useState('');
    const [gender, setGender] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const updateBodyMeasurements = () => {
    // Check if only one of height fields is filled. Lots of possibilities for error checking, but will update...
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

    // Check for crazy values
    if (heightNumber && heightNumber > 120) {
        setError('Please enter a realistic height.');
        return;
    }

    if (weightNumber && weightNumber > 1000) {
        setError('Please enter a realistic weight.');
        return;
    }

    // No errors? Great, now we can update the user settings!
    setError('');
    const height = heightNumber && heightUnit ? `${heightNumber} ${heightUnit}` : 'Not provided';
    const weight = weightNumber && weightUnit ? `${weightNumber} ${weightUnit}` : 'Not provided';
    const genderValue = gender || 'Not provided';
    const updatedUser = { ...user, heightNumber, heightUnit, weightNumber, weightUnit, gender: genderValue, height, weight };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
};

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser({});
        navigate("/login");
    };

    return(

    <main>
        <div className="p-1 m-1">

            <div className="p-1 m-1 has-text-centered">
                <h1 className="is-size-3 has-text-weight-bold">Account Settings</h1>
                <h2 className="p-1 m-1 is-size-5">View and modify your settings here.</h2>
            </div>

            <div className="p-2 m-2">
                <div className="columns is-multiline">

                    {/* <!-- Profile Info --> */}
                    <div className="column is-12-mobile is-4-tablet">
                        <div className="notification is-success is-light has-text-centered">
                            <h3 className="is-size-5 has-text-weight-semibold mb-3">
                                <i className="fa-solid fa-circle-user"></i> Profile
                            </h3>
                                <p><strong>Username:</strong> {user.username}</p>
                        </div>
                    </div>

                    {/* <!-- Body Measurements --> */}
                    <div className="column is-12-mobile is-4-tablet">
                        <div className="notification is-success is-light has-text-centered">
                            <h3 className="is-size-5 has-text-weight-semibold mb-3">
                                <i className="fa-solid fa-weight-scale"></i> Body Measurements
                            </h3>
                            
                            {/* Switch between data entry and viewing depending on the editing state */}
                            {isEditing ? (
                            
                            <>
                            <div className="field">
                                <label className="label">Height</label>
                                <div className="columns is-mobile">
                                    <div className="column">
                                        <div className="control">
                                            <input className="input" type="number" placeholder="Height number" value={heightNumber} onChange={(event) => setHeightNumber(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="column is-narrow">
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
                            </div>
                            
                            <div className="field">
                                <label className="label">Weight</label>
                                <div className="columns is-mobile">
                                    <div className="column">
                                        <div className="control">
                                            <input className="input" type="number" placeholder="Weight number" value={weightNumber} onChange={(event) => setWeightNumber(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="column is-narrow">
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
                            </div>
                            
                            <div className="control has-text-centered">
                                <label className="label">Gender</label>
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
                            
                            {error && <p className="has-text-danger has-text-centered mb-2">{error}</p>}
                            <div className="mt-3 is-flex" style={{ gap: '0.5rem', justifyContent: 'center' }}>
                                <button className="button is-success" onClick={updateBodyMeasurements}>
                                    <i className="fa-solid fa-check"></i>&nbsp;Save
                                </button>
                                <button className="button" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                            </>    
                            
                            ) : (
                                <>
                                <p><strong>Height:</strong>{` ${user.height}`}</p>
                                <p><strong>Weight:</strong> {` ${user.weight}`}</p>
                                <p><strong>Gender:</strong> { user.gender }</p>
                            <div className="mt-3">
                                <button id="change-body-measurement" className="button is-success" onClick={() => setIsEditing(true)}>
                                        <i className="fa-solid fa-pen"></i>&nbsp;Change
                                </button>
                            </div>
                            </>
                        )}
                        </div>
                    </div>

                    {/* <!-- Account Actions --> */}
                    <div className="column is-12-mobile is-4-tablet">
                        <div className="notification is-success is-light has-text-centered">
                            <h3 className="is-size-5 has-text-weight-semibold mb-3">
                                <i className="fa-solid fa-gear"></i>Account
                            </h3>
                                <div className="is-flex is-flex-direction-column" style={{ gap: '0.75rem' }}>
                                    {/* Saving this for the backend portion */}
                                {/* <a href="/password" className="button is-success is-fullwidth">
                                    <i className="fa-solid fa-lock"></i>&nbsp;Change Password
                                </a> */}
                                <a href="/manage" className="button is-success is-fullwidth">
                                    <i className="fa-solid fa-table-list"></i>Manage Activity
                                </a>
                                    <button className="button is-success is-fullwidth" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </main>
    )
}

export default Account;