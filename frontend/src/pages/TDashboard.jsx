import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TDash.css";
import logo from "/assets/Logo.png";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setChecking(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (checking) {
    return <div className="loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="background-container"></div>
      <div className="overlay"></div>

      <nav className="navbr">
        <div className="left">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="cener"> SafarMitra Railway Ticket Booking </div>

        <div className="right">
<>
              <span className="wl">
                🙏 Namaste, {user.name || user.username}!
              </span>
              <button
                onClick={() => navigate("/dashboard")}
                className="nav-bn"
              >
                Dashboard
              </button>
              <button onClick={handleLogout} className="nav-bn">
                Logout
              </button>
            </>
        </div>
      </nav>

      {user && (
        <div className="card-area">
          <div className="card-container">
            <div className="ation-card">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQYdgru5KXXzmLeQfFK4E1AHf9RTb4-FH7pw&s"
                alt="Book Ticket"
              />
              <a href="/tbook">Book Ticket</a>
            </div>

            <div className="ation-card">
              <img
                src="https://user-gen-media-assets.s3.amazonaws.com/gemini_images/84982465-f944-4ce6-aace-45a22bf1de78.png"
                alt="Show Tickets"
              />
              <a href="/thistory">Show My Tickets</a>
            </div>
             <div className="ation-card">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw3MCjuGn1n9_DmzN1ohXJBXMq5EcGJrBVUA&s"
                alt="Other Services"
              />
              <a href="/tservices">Other Train Services</a>
            </div>
          </div>
        </div>
      )}

      <footer>© 2025 SafarMitra. All Rights Reserved.</footer>
    </div>
  );
};

export default Dashboard;
