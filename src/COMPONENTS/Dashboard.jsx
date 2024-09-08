import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome, {user.email}</h1>
      <nav>
        <ul>
          <li>
            <Link to="/map">View Map</Link>
          </li>
          <li>
            <Link to="/messaging">Messages</Link>
          </li>
          <li>
            <Link to="/service-requests">Service Requests</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
