// src/auth/AuthScreen.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createClient } from "@supabase/supabase-js";
import "./AuthScreen.css"; // We'll define styles below

// Initialize Supabase
const supabaseUrl = "https://lvauizjdocxinwhfducq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YXVpempkb2N4aW53aGZkdWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDE5NTMsImV4cCI6MjA4MTQ3Nzk1M30.lOtq29C2hZ2SyD9Pn7lHpeLP65BhvbINk-Nwi6kWx3c";
const supabase = createClient(supabaseUrl, supabaseKey);

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  
  // Get role from localStorage that was set during role selection
  const selectedRole = localStorage.getItem('selectedRole');
  
  // Set initial mode based on location state or props
  React.useEffect(() => {
    if (location.state?.mode) {
      setIsLogin(location.state.mode === 'login');
    }
  }, [location.state]);

  // ===============================================================
  // Handle Form Submit
  // ===============================================================
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password || (!isLogin && !fullName)) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      let result;
      if (isLogin) {
        // Use the login function from AuthContext
        result = await login(email, password);
      } else {
        // Use the signup function from AuthContext
        result = await signup(fullName, email, password);
      }

      if (result.success) {
        // Redirect to appropriate dashboard based on role
        navigate('/dashboard');
      } else {
        setErrorMessage(result.error || 'Authentication failed');
      }
    } catch (e) {
      setErrorMessage(e.message || e.toString());
    }
  };

  

  // ===============================================================
  // Render Login/Signup Form
  // ===============================================================
  return (
    <div className="auth-screen">
      <div className="auth-container">
        <h2 className="auth-title">
          {isLogin ? "Login to your account" : "Create a new account"}
        </h2>

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <InputField
              label="Full Name"
              value={fullName}
              setValue={setFullName}
              type="text"
            />
          )}

          <InputField label="Email" value={email} setValue={setEmail} type="email" />

          <InputField
            label="Password"
            value={password}
            setValue={setPassword}
            type="password"
          />

          {!isLogin && (
            <InputField
              label="Confirm Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              type="password"
            />
          )}

          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Sign Up"}
          </button>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}
        </form>

        <p
          className="auth-toggle"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage(null);
            setConfirmPassword("");
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, value, setValue, type = "text" }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="auth-input"
      />
    </div>
  );
};

export default AuthScreen;
