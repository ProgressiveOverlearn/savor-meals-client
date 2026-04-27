import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import planData from '../data/planData';

function Manage({ user }) {

    const navigate = useNavigate();

    // Require login
    if (!user?.username) {
        return <Navigate to="/login" />;
    }

    // Get plans created by the logged in user. Easy to do right now because of the data file
    const userPosts = planData.filter((plan) => plan.creator === user.username);

    // Get saved and liked plans from localStorage...for now. Will worry more about this the backend
    const savedPlans = JSON.parse(localStorage.getItem('savedPlans')) || [];
    const likedPlans = JSON.parse(localStorage.getItem('likedPlans')) || [];

    return (
        <main>
            <div className="p-1 m-1">

                <div className="p-1 m-1 has-text-centered">
                    <h1 className="is-size-3 has-text-weight-bold">View &amp; Manage Posts, Saves, Likes</h1>
                    <h2 className="p-1 m-1 is-size-5">Click on your posts, saves, or likes to view them.</h2>
                </div>

                <div className="p-2 m-2">
                    <div className="columns is-multiline">

                        {/* Posts */}
                        <div className="column is-12-mobile is-4-tablet has-text-centered">
                            <div className="notification is-success is-light">
                                <h3 className="is-size-5 has-text-weight-semibold mb-3">
                                    <i className="fa-solid fa-file-lines"></i> Posts: {userPosts.length}
                                </h3>
                                <div className="is-flex is-flex-direction-column" style={{ gap: '0.5rem' }}>
                                    {userPosts.length === 0 ? (
                                        <p className="is-size-7 has-text-grey">No posts yet.</p>
                                    ) : (
                                        userPosts.map((plan) => (
                                            <button key={plan.id} className="button is-success is-light is-fullwidth" onClick={() => navigate(`/view/${plan.id}`)}>
                                                {plan.name}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Saves */}
                        <div className="column is-12-mobile is-4-tablet has-text-centered">
                            <div className="notification is-success is-light">
                                <h3 className="is-size-5 has-text-weight-semibold mb-3">
                                    <i className="fa-solid fa-bookmark"></i> Saves: {savedPlans.length}
                                </h3>
                                <div className="is-flex is-flex-direction-column" style={{ gap: '0.5rem' }}>
                                    {savedPlans.length === 0 ? (
                                        <p className="is-size-7 has-text-grey">No saves yet.</p>
                                    ) : (
                                        savedPlans.map((plan) => (
                                            <button key={plan.id} className="button is-success is-light is-fullwidth" onClick={() => navigate(`/view/${plan.id}`)}>
                                                {plan.name}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Likes */}
                        <div className="column is-12-mobile is-4-tablet has-text-centered">
                            <div className="notification is-success is-light">
                                <h3 className="is-size-5 has-text-weight-semibold mb-3">
                                    <i className="fa-solid fa-heart"></i> Likes: {likedPlans.length}
                                </h3>
                                <div className="is-flex is-flex-direction-column" style={{ gap: '0.5rem' }}>
                                    {likedPlans.length === 0 ? (
                                        <p className="is-size-7 has-text-grey">No likes yet.</p>
                                    ) : (
                                        likedPlans.map((plan) => (
                                            <button key={plan.id} className="button is-success is-light is-fullwidth" onClick={() => navigate(`/view/${plan.id}`)}>
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

export default Manage;