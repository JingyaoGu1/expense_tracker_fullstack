// import React from 'react'

// export const Header = () => {
//   return (
//     <h1 className='header'>
//       Expense Tracker
//     </h1>
//   )
// }


import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Header.css';
import { GlobalContext } from '../context/GlobalState';


export const Header = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const { setUser, logout } = useContext(GlobalContext);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleOperationError = (errorMessage) => {
    setPopupMessage({ show: true, message: errorMessage, type: 'error' });
  };


  const Popup = ({ message, onClose }) => {
    return (
      <div className="popup">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };


  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login', credentials);
      console.log(response)
      console.log(credentials)
      localStorage.setItem('token', response.data.token);
      setUser(response.data.name)
      setIsLoggedIn(true);
      setShowLoginForm(false);
      setPopupMessage('Logged in successfully!');
      setShowPopup(true);
    } catch (error) {
      console.error('Login error:', error);
      handleOperationError('Login failed. Please try again.');
      // Handle login error (show message to user, etc.)
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users', credentials);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setShowLoginForm(false);
      setPopupMessage('Registered successfully!');
      setShowPopup(true);
    } catch (error) {
      console.error('Login error:', error);
      handleOperationError('Fail to register. Please try again.');

      // Handle login error (show message to user, etc.)
    }
  };

  const handleLogout = () => {
    logout(); // Call the logout function from context
    setIsLoggedIn(false);  // Make sure to set isLoggedIn to false
    setShowLoginForm(false);  // Reset any other related states if necessary
    setShowRegistrationForm(false);
    setUser(null); // Reset the user in the global state
    setPopupMessage('Logged out successfully!');
    setShowPopup(true);
  };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     getTransactions();
// }, [isLoggedIn]);  

  return (
    <div className='header'>
      <h1>Expense Tracker</h1>
      <div className="auth-buttons">
        {!showLoginForm && !showRegistrationForm && !isLoggedIn && (
          <>
            <button onClick={() => setShowLoginForm(true)}>Login</button>
            <button onClick={() => setShowRegistrationForm(true)}>Or click here to sign up</button>
          </>
        )}
        {showLoginForm && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        )}
        {showRegistrationForm && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={credentials.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Register</button>
          </form>
        )}
        <button onClick={handleLogout}>Logout</button>
        {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
};