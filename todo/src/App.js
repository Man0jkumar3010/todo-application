import React, { useState, useEffect } from "react";
import Login from "./Components/Login";
import List from "./Components/List";
import Register from "./Components/Register";
import axios from "axios";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5001/api/todos", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleRegister = () => {
    setIsAuthenticated(false);
    setShowRegister(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleForm = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div className="todo">
      {!isAuthenticated ? (
        <div className="auth-container">
          {showRegister ? (
            <div>
              <Register onRegister={handleRegister} />
              <p>
                Already have an account?{" "}
                <a href="#" onClick={toggleForm}>
                  Login
                </a>
              </p>
            </div>
          ) : (
            <div>
              <Login onLogin={handleLogin} />
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={toggleForm}>
                  Register
                </a>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <List onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
};

export default App;
