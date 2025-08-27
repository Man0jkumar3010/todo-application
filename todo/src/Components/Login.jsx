import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/login.css";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5001/api/login", form, {
        withCredentials: true,        
      });
      setForm({ email: "", password: "" });
      toast.success("Login successful");
      setTimeout(() => {
        onLogin();
      }, 2000);
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="auth-form">
      <h1>Login</h1>
      <form onSubmit={handleOnSubmit}>
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={form.email}
          onChange={handleOnChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleOnChange}
        />
        <button type="submit">Login</button>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Login;
