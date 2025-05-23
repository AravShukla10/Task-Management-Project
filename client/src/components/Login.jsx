import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/Login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", res.data.username);
      
       setUser(res.data.username);
      setResponseMessage("Login successful!");
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setResponseMessage(error?.response?.data?.message || "Login failed");
      console.log(error);
      setIsSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-card">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>

        {responseMessage && (
          <div
            className={`response-message ${isSuccess ? "success" : "error"}`}
          >
            {responseMessage}
          </div>
        )}

        <p className="login-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
