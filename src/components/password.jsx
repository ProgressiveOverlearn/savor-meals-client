// This is on hold until I get into the backend
function Password() {

    return(
    <main>
        <div className="p-1 m-1">

            <div className="p-1 m-1 has-text-centered">
                <h1 className="is-size-3 has-text-weight-bold">Reset Password</h1>
                <h2 className="p-1 m-1 is-size-5">Enter your email address tied to your account.</h2>
            </div>

            <div className="columns is-centered p-2 m-2">
                <div className="column is-12-mobile is-half-tablet is-one-third-desktop">
                    <div>

                        <div className="field">
                            <label className="label has-text-centered" htmlFor="email">Email Address</label>
                            <div className="control has-icons-left">
                                <input className="input" type="email" id="email" name="email" placeholder="Email"/>
                                    <span className="icon is-left">
                                        <i className="fa-solid fa-envelope"></i>
                                    </span>
                            </div>
                        </div>

                        <div className="field mt-4">
                            <div className="control has-text-centered">
                                <button className="button is-success" type="submit">
                                    <i className="fa-solid fa-paper-plane"></i>&nbsp;Reset
                                </button>
                            </div>
                        </div>

                        {/* <!-- Shown after reset email is sent --> */}
                        <div className="mt-4 has-text-centered">
                            <p id="pw-notification">
                                <i className="fa-solid fa-circle-check"></i> An email has been sent to reset your password.
                            </p>
                            <a id="resend-pw-link" href="#script" className="mt-2" style={{display: "block;"}}>
                                Didn't receive an email?
                            </a>
                        </div>

                    </div>
                </div>
            </div>

        </div>
        </main>
    )
}
    
export default Password;