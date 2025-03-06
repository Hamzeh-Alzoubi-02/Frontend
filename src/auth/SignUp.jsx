import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import logo from "../assets/img/Screenshot 2025-02-14 213021.png";
import USERCOUNT from "../assets/img/eae32d36cf7f89de3ad2108632b68765.jpg";
import UserpostCount from "../assets/img/94d4564d86d9f5af8559e62ab739c971.jpg";
import UsercountProject from "../assets/img/42198e221f9844ce0c9ec63956ebf6f3.jpg";
  // استيراد ملف الـ CSS

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    deviceId: localStorage.getItem("deviceId"),
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [userpostCount, setUserPostCount] = useState(0);
  const [userprjectCount, setUserProjectCount] = useState(0);

  useEffect(() => {
    let storedDeviceId = localStorage.getItem("deviceId");
    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem("deviceId", storedDeviceId);
    }
    setFormData((prevData) => ({ ...prevData, deviceId: storedDeviceId }));
    getUserCount();
    getUserPostCount();
    getUserCountProject();
  }, []);
  const getUserCountProject = async () => {
    try{
      const response = await fetch("http://localhost:5000/api/all-projects");
      const data = await response.json();
      if (response.ok) {
        setUserProjectCount(data.project);
        console.log(data.project);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
    }
    
  

  const getUserPostCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/postusers/all");
      const data = await response.json();
      if (response.ok) {
        setUserPostCount(data.post);
        console.log(data.post);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
  } 
  const getUserCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getuser");
      const data = await response.json();
      if (response.ok) {
        setUserCount(data.count);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("deviceId", data.deviceId);
        setIsRegistered(true);

        setTimeout(() => {
          setIsRegistered(false);
          window.location.href = "/login";
        }, 5000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error");
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
          <div className={`signup-logo-circle ${isRegistered ? "registered" : ""}`}>
            <img src={logo} alt="PADEL Logo" className="signup-logo"/>
          </div>
          <h1>Join PADEL Today</h1>
          <p>Be part of our growing community</p>
        </div>

        <div className="signup-right">
          <h2>Create New Account</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="signup-input"
            />
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
            <Link to="/login" className="signup-login-link">
              Already have an account? Login
            </Link>
            <button type="submit" className="signup-button">Sign Up</button>
          </form>
        </div>
      </div>

      <div className="signup-user-count">
        <img src={USERCOUNT} alt="User Count" />
        <p>Users Registered: <span>{userCount}</span></p>
      
        <img src={UserpostCount} alt="Post Count" />
        <p>Posts: <span>{userpostCount}</span></p>

        <img src={UsercountProject} alt="Project Count" />
        <p>Projects: <span>{userprjectCount}</span></p>
      </div>

      <footer className="signup-footer">
        <span>&copy; 2025 HAMZEH ALZU'BI</span>
      </footer>
    </div>
  );
};

export default SignUp;
