import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TTime.css";
import logo from "/assets/Logo.png";

const TTime = ({ user, handleLogout }) => {
  const [trainNo, setTrainNo] = useState("");
  const [trainData, setTrainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const numberFromURL = params.get("trainNo");
    if (numberFromURL) {
      setTrainNo(numberFromURL);
      fetchTimetable(numberFromURL);
    }
  }, [location.search]);

  const fetchTimetable = async (number) => {
    const tn = number || trainNo;

    if (!tn.trim()) {
      setError("Please enter a valid train number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTrainData(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/train/getRoute?trainNo=${tn}`
      );
      const result = await response.json();
      console.log("Timetable API Result:", result);

      if (result?.success && Array.isArray(result?.data) && result.data.length > 0) {
        setTrainData(result);
      } else {
        setError(result?.data || "No timetable found for this train.");
      }
    } catch (err) {
      console.error("Error fetching timetable:", err);
      setError("Something went wrong while fetching timetable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ttime-wrapper">
      <nav className="ls-navbar">
        <img src={logo} alt="Logo" className="ls-navbar-logo" />
        <div className="ls-navbar-title">SafarMitra Railway Ticket Booking</div>

        <div className="ls-navbar-right">
          {user ? (
            <>
              <span className="ls-welcome-text">
                🙏 Namaste, {user.name || user.username}!
              </span>
              <button onClick={() => navigate("/dashboard")} className="ls-nav-btn">
                Dashboard
              </button>
              <button onClick={handleLogout} className="ls-nav-btn">
                Logout
              </button>
            </>
          ) : (
            <div className="ls-auth-buttons">
              <a href="/tdashboard" className="ls-nav-btn">
                Dashboard
              </a>
              <a href="/tservices" className="ls-nav-btn">
                Train Services
              </a>
            </div>
          )}
        </div>
      </nav>

      <div className="ttime-container">
        <h2 className="ttime-title">Train Timetable Finder</h2>

        <div className="ttime-input-section">
          <input
            type="text"
            className="ttime-input"
            placeholder="Enter Train Number"
            value={trainNo}
            onChange={(e) => setTrainNo(e.target.value)}
          />
          <button
            className="ttime-search-btn"
            onClick={() => fetchTimetable()}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Search"}
          </button>
        </div>

        {error && <p className="ttime-error">{error}</p>}

        {loading && (
          <div className="ttime-popup-overlay">
            <div className="ttime-popup">
              <div className="ttime-loader" aria-label="Loading train timetable"></div>
              <p>Loading Train Timetable...</p>
            </div>
          </div>
        )}

        {trainData && (
          <div className="ttime-results">
            <h3 className="ttime-train-info">
              {trainData.train_no} - {trainData.train_name}
            </h3>

            <table className="ttime-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Station Name</th>
                  <th>Station Code</th>
                  <th>Arrival</th>
                  <th>Departure</th>
                  <th>Day</th>
                  <th>Distance (km)</th>
                  <th>Zone</th>
                </tr>
              </thead>
              <tbody>
                {trainData.data.map((stop, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{stop.source_stn_name}</td>
                    <td>{stop.source_stn_code}</td>
                    <td>{stop.arrive}</td>
                    <td>{stop.depart}</td>
                    <td>{stop.day}</td>
                    <td>{stop.distance}</td>
                    <td>{stop.zone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TTime;
