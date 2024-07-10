import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState<{
    username: string;
    password: string;
    money: number;
  } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      });
      console.log(response);
      if (response.data.message === "Login successful!") {
        setUserData(response.data.user);
        navigate("/dashboard", {
          state: { username, user: response.data.user },
        });
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      setMessage("An error occurred");
    }
  };

  return (
    <div className="login-container">
      <h2>BBVA Digital Bank Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      {userData && (
        <div>
          <h3>User Data</h3>
          <p>Username: {userData.username}</p>
          <p>Password: {userData.password}</p>
          <p>Money: ${userData.money.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
