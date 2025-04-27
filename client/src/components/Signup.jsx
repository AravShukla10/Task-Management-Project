// src/components/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Make the API call to register the user
      const res = await axios.post('http://localhost:5000/api/register', { email, password });
      localStorage.setItem('token', res.data.token);
      setResponseMessage('Registration successful!');
      setIsSuccess(true);
      
      // After a successful registration, navigate directly to the Dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setResponseMessage(error?.response?.data?.message || 'Signup failed');
      setIsSuccess(false);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-card">
        <h2 className="signup-title">Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          className="signup-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="signup-button">
          Sign Up
        </button>

        {responseMessage && (
          <div className={`response-message ${isSuccess ? 'success' : 'error'}`}>
            {responseMessage}
          </div>
        )}

        <p className="signup-footer">
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
