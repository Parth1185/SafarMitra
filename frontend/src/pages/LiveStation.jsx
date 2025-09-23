import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/assets/Logo.png";
import "./LiveStation.css";

const LiveStation = ({ user, handleLogout }) => {
  const [stationCode, setStationCode] = useState("");
  const [liveData, setLiveData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchLiveStation = async () => {
    if (!stationCode) {
      setError("Please enter a valid station code.");
      return;
    }

    try {
      setLoading(true); // Show popup
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/train/stationLive?code=${stationCode}`
      );
      const result = await response.json();
      console.log("Live Station API Response:", result);

      if (result?.data && Array.isArray(result.data)) {
        setLiveData(result.data);
      } else {
        setError("No trains found for this station.");
        setLiveData([]);
      }
    } catch (err) {
      console.error("Error fetching live station:", err);
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false); // Hide popup
    }
  };

  // Safely filter train list
  const filteredTrains = liveData.filter(
    (train) =>
      train?.train_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train?.train_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train?.source_stn_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train?.dstn_stn_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ls-page-wrapper">
      {/* Navbar */}
      <nav className="ls-navbar">
        <img src={logo} alt="Logo" className="ls-navbar-logo" />

        <div className="ls-navbar-title">SafarMitra Railway Ticket Booking</div>

        <div className="ls-navbar-right">
          {user ? (
            <>
              <span className="ls-welcome-text">
                🙏 Namaste, {user.name || user.username}!
              </span>
              <button
                onClick={() => navigate("/dashboard")}
                className="ls-nav-btn"
              >
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

      {/* Main Content */}
      <h2 className="ls-page-title">Live Station Arrival & Departure</h2>

      {/* Search Input */}
      <div className="ls-input-section">
        <input
          type="text"
          className="ls-station-input"
          placeholder="Enter station code"
          value={stationCode}
          onChange={(e) => setStationCode(e.target.value.toUpperCase())}
        />
        <button className="ls-search-btn" onClick={fetchLiveStation}>
          Search
        </button>
      </div>

      {/* Filter Bar */}
      {liveData.length > 0 && (
        <div className="ls-search-filter">
          <input
            type="text"
            placeholder="Search by train name, number, or station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ls-filter-input"
          />
        </div>
      )}

      {/* === Loading Popup === */}
      {loading && (
        <div className="ls-loading-overlay">
          <div className="ls-loading-popup">
            <div className="ls-spinner"></div>
            <p>LOADING TRAINS...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="ls-error-text">{error}</p>}

      {/* Train List */}
      <div className="ls-train-list">
        {filteredTrains.length > 0 ? (
          filteredTrains.map((train, index) => (
            <div key={index} className="ls-train-card">
              <h3 className="ls-train-title">
                {train?.train_no || "N/A"} : {train?.train_name || "Unknown Train"}
              </h3>
              <p className="ls-train-info">
                <strong>From:</strong> {train?.source_stn_name || "N/A"} →{" "}
                <strong>To:</strong> {train?.dstn_stn_name || "N/A"}
              </p>
              <p className="ls-train-info">
                <strong>Time:</strong> {train?.time_at || "N/A"}
              </p>
            </div>
          ))
        ) : (
          !loading && <p className="ls-no-trains"></p>
        )}
      </div>
    </div>
  );
};

export default LiveStation;
