import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import logo from "../assets/img/Screenshot 2025-02-14 213021.png";
 import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
     
  });
  const [error, setError] = useState("");
 
  
   

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
  
      const data = await response.json();
      console.log("Response:", data);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        
        if (data.role === "admin") {
          navigate("/admindash");
        } else if (data.role === "user") {
          console.log("Last login time:", data.lastActivity);  // عرض وقت آخر تسجيل دخول للمستخدمين
          navigate("/home"); // ✅ التوجيه باستخدام navigate
        }
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  };
  
  

  return (
    <div className="signup-page-container">
      <nav className="signup-navbar">
        <div className="signup-logo">
          <span className="signup-logo-text">PADEL</span>
        </div>
      </nav>

      <div className="signup-content">
        <div className="signup-left">
          <div className={`signup-logo-circle`}>
            <img src={logo} alt="PADEL Logo" className="signup-logo"/>
          </div>
          <h1>Welcome Back</h1>
          <p>Login to your account</p>
        </div>

        <div className="signup-right">
          <h2>Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="signup-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="signup-input"
            />
            {error && <div className="signup-error">{error}</div>}
            <Link to="/register" className="signup-login-link">
              Don't have an account? Sign up
            </Link>
            <button type="submit" className="signup-button">Login</button>
          </form>
        </div>
      </div>

       

      <footer className="signup-footer">
        <span>&copy; 2025 HAMZEH ALZU'BI</span>
      </footer>
    </div>
  );
};

export default Login;
