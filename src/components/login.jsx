import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userData from '../data/userData';

function Login({ setUser }) {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        const foundUser = userData.find(user => user.email === email && user.password === password);

        if (foundUser) {
            setUser(foundUser);
            navigate('/account');
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
    <main>
        <div className="p-1 m-1">

            <div className="p-1 m-1 has-text-centered">
                <h1 className="is-size-3 has-text-weight-bold">Account Sign In</h1>
            </div>

            <div className="columns is-centered p-2 m-2">
                <div className="column is-12-mobile is-half-tablet is-one-third-desktop">
                    <div>

                        <div className="field">
                            <label className="label has-text-centered" htmlFor="email">Email Address</label>
                            <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="Email" />
                                    <span className="icon is-left">
                                        <i className="fa-solid fa-envelope"></i>
                                    </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label has-text-centered" htmlFor="password">Password</label>
                            <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="Password" />
                                    <span className="icon is-left">
                                        <i className="fa-solid fa-lock"></i>
                                    </span>
                            </div>
                        </div>
                        
                        {/* Show error message if login fails */}
                        {error && <p className="has-text-danger has-text-centered">{error}</p>}

                        <div className="field mt-4 has-text-centered">
                            <div className="control">
                                <button className="button is-success" onClick={handleLogin}>
                                    <i className="fa-solid fa-right-to-bracket"></i>&nbsp;Log In
                                </button>
                            </div>
                        </div>

                            <div className="mt-4 has-text-centered is-flex is-flex-direction-column" style={{ gap: "0.5rem" }}>
                            {/* Will work on this when I get into the backend */}
                            {/* <a href="/password">Forgot your password?</a> */}
                            <a href="/signup">Don't have an account?</a>
                        </div>

                    </div>
                </div>
            </div>

        </div>
        </main>
    )
}

export default Login;