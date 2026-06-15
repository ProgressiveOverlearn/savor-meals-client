import { useNavigate } from "react-router-dom";
import { useState } from 'react';

function Signup({ setUser }) {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [heightNumber, setHeightNumber] = useState('');
    const [heightUnit, setHeightUnit] = useState('');
    const [weightNumber, setWeightNumber] = useState('');
    const [weightUnit, setWeightUnit] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {

        // Check required fields
        if (!email || !password || !username) {
            setError('Please fill in all required fields.');
            return;
        }

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

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    heightNumber: heightNumber ? parseFloat(heightNumber) : undefined,
                    heightUnit: heightUnit || undefined,
                    weightNumber: weightNumber ? parseFloat(weightNumber) : undefined,
                    weightUnit: weightUnit || undefined,
                    gender: gender || undefined,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                setError(err.error || 'Failed to create account.');
                setLoading(false);
                return;
            }

            // Auto login after signup - fetch full user profile
            const loginResponse = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const userData = await loginResponse.json();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/account');

        } catch (err) {
            console.error('❌ Signup error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="p-1 m-1">

                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">Account Sign Up</h1>
                    <h2 className="p-1 m-1 is-size-5">Creating an account is FREE!</h2>
                </div>

                <div className="columns is-multiline p-2 m-2">

                    {/* Left: Required fields */}
                    <div className="column is-12-mobile is-12-tablet is-half-desktop">
                        <div className="notification is-success is-light">
                            <p className="has-text-centered mb-4 is-size-7">✱ Required fields</p>

                            <div className="field">
                                <label className="label has-text-centered" htmlFor="email">Email Address ✱</label>
                                <div className="control has-icons-left">
                                    <input className="input" type="email" id="email" name="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                    <span className="icon is-left">
                                        <i className="fa-solid fa-envelope"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label has-text-centered" htmlFor="password">Create a Password ✱</label>
                                <div className="control has-icons-left">
                                    <input className="input" type="password" id="password" name="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                                    <span className="icon is-left">
                                        <i className="fa-solid fa-lock"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label has-text-centered" htmlFor="username">Username ✱</label>
                                <div className="control has-icons-left">
                                    <input className="input" type="text" id="username" name="username" placeholder="Ex: fitmaster1" value={username} onChange={(event) => setUsername(event.target.value)} required />
                                    <span className="icon is-left">
                                        <i className="fa-solid fa-user"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Optional fields */}
                    <div className="column is-12-mobile is-12-tablet is-half-desktop">
                        <div className="notification is-success is-light">
                            <p className="has-text-centered mb-4 is-size-7">The fields below are optional.</p>

                            {/* Height */}
                            <div className="field">
                                <label className="label has-text-centered" htmlFor="height">Your Height</label>
                                <div className="columns is-mobile">
                                    <div className="column">
                                        <div className="control">
                                            <input className="input" type="number" id="height" name="height" placeholder="Height number" value={heightNumber} onChange={(event) => setHeightNumber(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="column is-narrow">
                                        <div className="control">
                                            <div className="select is-success">
                                                <select value={heightUnit} onChange={(event) => setHeightUnit(event.target.value)}>
                                                    <option value="" disabled>Select a unit</option>
                                                    <option value="inches">inches</option>
                                                    <option value="centimeters">centimeters</option>
                                                    <option value="">Don't provide</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Weight */}
                            <div className="field">
                                <label className="label has-text-centered" htmlFor="weight">Your Weight</label>
                                <div className="columns is-mobile">
                                    <div className="column">
                                        <div className="control">
                                            <input className="input" type="number" id="weight" name="weight" placeholder="Weight number" value={weightNumber} onChange={(event) => setWeightNumber(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="column is-narrow">
                                        <div className="control">
                                            <div className="select is-success">
                                                <select value={weightUnit} onChange={(event) => setWeightUnit(event.target.value)}>
                                                    <option value="" disabled>Select a unit</option>
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

                            {/* Gender */}
                            <div className="field">
                                <label className="label has-text-centered" htmlFor="gender">Your Gender</label>
                                <div className="control has-text-centered">
                                    <div className="select is-success">
                                        <select id="gender" name="gender" value={gender} onChange={(event) => setGender(event.target.value)}>
                                            <option value="" disabled>Select a gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary</option>
                                            <option value="">Don't provide</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && <div className="column is-12 has-text-centered has-text-danger">{error}</div>}

                    {/* Sign Up button */}
                    <div className="column is-12 has-text-centered">
                        <button
                            className={`button is-success ${loading ? 'is-loading' : ''}`}
                            onClick={handleSignup}
                            disabled={loading}
                        >
                            <i className="fa-solid fa-user-plus"></i>&nbsp;Sign Up
                        </button>
                    </div>

                </div>

            </div>
        </main>
    );
}

export default Signup;