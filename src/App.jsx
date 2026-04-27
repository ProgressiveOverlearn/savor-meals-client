import Header from './shared/header';
import Footer from './shared/footer';
import Home from './components/home';
import Discover from './components/discover';
import Account from './components/account';
import Create from './components/create';
import Find from './components/find';
import Login from './components/login';
import Manage from './components/manage';
import Password from './components/password';
import Results from './components/results';
import Signup from './components/signup';
import View from './components/view';
import '@fortawesome/fontawesome-free/css/all.min.css'; //fontawesome :)

import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

function App() {

    // Load user from localStorage then set the savedUser to the user that's set after logging in or out
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {};
  });

  // Set the user that comes from localStorage whenever the user changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <div className='app'>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/account" element={<Account user={user} setUser={setUser} />} />
        <Route path="/create" element={<Create user={user} />} />
        <Route path="/find" element={<Find />} />
        <Route path="/login" element={<Login user={user} setUser={setUser} />} />
        <Route path="/manage" element={<Manage user={user} />} />
        <Route path="/password" element={<Password />} />
        <Route path="/results" element={<Results />} />
        <Route path="/signup" element={<Signup user={user} setUser={setUser} />} />
        <Route path="/view/:id" element={<View />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;