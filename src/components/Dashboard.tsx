import React from "react";
import { useLocation } from "react-router-dom";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const { username, user } = location.state;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {username}</h2>
      <h3>User Data</h3>
      <p>Username: {user.username}</p>
      <p>Password: {user.password}</p>
      <p>Money: ${user.money.toFixed(2)}</p>
    </div>
  );
};

export default Dashboard;
