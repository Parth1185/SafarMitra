import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TFinder.css";
import logo from "/assets/Logo.png"; // Update path as needed

const TFinder = () => {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterQuery, setFilterQuery] = useState(""); // Filter input state

  const navigate = useNavigate();

  // Convert "HH.MM" -> total minutes
  const convertToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return 0;
    const [hours, minutes] = timeStr.split(".").map(Number);
    return hours * 60 + minutes;
  };

  // Convert travel time like "HH.MM" or "HH:MM" -> total minutes
  const convertTravelTime = (travelTimeStr) => {
    if (!travelTimeStr || typeof travelTimeStr !== "string") return 0;

    const cleanTime = travelTimeStr.includes(".")
      ? travelTimeStr.replace(".", ":")
      : travelTimeStr;

    const [hours, minutes] = cleanTime.split(":").map((num) => parseInt(num, 10));
    return (hours || 0) * 60 + (minutes || 0);
  };

  // Fetch trains between two stations
  const fetchTrains = async () => {
    if (!fromStation.trim() || !toStation.trim()) {
      setError("Please enter both Origin and Destination station codes.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTrains([]);

      const response = await fetch(
        `http://localhost:5000/api/train/betweenStations?from=${fromStation}&to=${toStation}`
      );
      const result = await response.json();
      console.log("API Result:", result);

      if (result.success && result.data.length > 0) {
        const sortedTrains = [...result.data].sort(
          (a, b) =>
            convertToMinutes(a.train_base.from_time) -
            convertToMinutes(b.train_base.from_time)
        );
        setTrains(sortedTrains);
      } else {
        setError("No trains found for these stations.");
      }
    } catch (err) {
      console.error("Error fetching trains:", err);
      setError("Something went wrong while fetching trains.");
    } finally {
      setLoading(false);
    }
  };

  // Sorting logic
  const handleSort = (option) => {
    setSortOption(option);
    const sorted = [...trains];

    switch (option) {
      case "shortest_duration":
        sorted.sort(
          (a, b) =>
            convertTravelTime(a.train_base.travel_time) -
            convertTravelTime(b.train_base.travel_time)
        );
        break;

      case "longest_duration":
        sorted.sort(
          (a, b) =>
            convertTravelTime(b.train_base.travel_time) -
            convertTravelTime(a.train_base.travel_time)
        );
        break;

      case "earliest_departure":
        sorted.sort(
          (a, b) =>
            convertToMinutes(a.train_base.from_time) -
            convertToMinutes(b.train_base.from_time)
        );
        break;

      case "latest_departure":
        sorted.sort(
          (a, b) =>
            convertToMinutes(b.train_base.from_time) -
            convertToMinutes(a.train_base.from_time)
        );
        break;

      case "earliest_arrival":
        sorted.sort(
          (a, b) =>
            convertToMinutes(a.train_base.to_time) -
            convertToMinutes(b.train_base.to_time)
        );
        break;

      case "latest_arrival":
        sorted.sort(
          (a, b) =>
            convertToMinutes(b.train_base.to_time) -
            convertToMinutes(a.train_base.to_time)
        );
        break;

      default:
        break;
    }

    setTrains(sorted);
  };

  // Running days display
  const renderRunningDays = (daysString) => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    return daysString.split("").map((day, index) => (
      <span
        key={index}
        className={`day ${day === "1" ? "running" : "not-running"}`}
      >
        {days[index]}
      </span>
    ));
  };

  const filteredTrains = trains.filter((train) => {
    return (
      train.train_base.train_name
        .toLowerCase()
        .includes(filterQuery.toLowerCase()) ||
      train.train_base.train_no.toString().includes(filterQuery)
    );
  });

  return (
    <div className="tfinder-container">
      {/* Navbar */}
      <nav className="ls-navbar">
        <img src={logo} alt="Logo" className="ls-navbar-logo" />
        <div className="ls-navbar-title">SafarMitra Railway Ticket Booking</div>
        <div className="ls-navbar-right">
          <div className="ls-auth-buttons">
            <a href="/tdashboard" className="ls-nav-btn">
              Dashboard
            </a>
            <a href="/tservices" className="ls-nav-btn">
              Train Services
            </a>
          </div>
        </div>
      </nav>

      <h2 className="tfinder-title">Find Trains Between Stations</h2>

      {/* Search Input Section */}
      <div className="tfinder-input-section">
        <input
          type="text"
          className="tfinder-input"
          placeholder="Origin Station Code"
          value={fromStation}
          onChange={(e) => setFromStation(e.target.value.toUpperCase())}
        />
        <input
          type="text"
          className="tfinder-input"
          placeholder="Destination Station Code"
          value={toStation}
          onChange={(e) => setToStation(e.target.value.toUpperCase())}
        />
        <button
          className="tfinder-search-btn"
          onClick={fetchTrains}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="tfinder-error">{error}</p>}

      {/* Loader */}
      {loading && (
  <div className="tfinder-popup-overlay">
    <div className="tfinder-popup">
      <div className="spinner"></div>
      <p>Loading Trains...</p>
    </div>
  </div>
)}


      {/* Results */}
      {trains.length > 0 && (
        <div className="tfinder-results">
          <div className="tfinder-results-header">
            <h3 className="tfinder-results-title">Available Trains</h3>

            {/* Sort Dropdown */}
            <select
              className="tfinder-sort-dropdown"
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="shortest_duration">Shortest Duration</option>
              <option value="longest_duration">Longest Duration</option>
              <option value="earliest_departure">Earliest Departure</option>
              <option value="latest_departure">Latest Departure</option>
              <option value="earliest_arrival">Earliest Arrival</option>
              <option value="latest_arrival">Latest Arrival</option>
            </select>

          </div>

          <table className="tfinder-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Train Number</th>
                <th>Train Name</th>
                <th>From</th>
                <th>Departure</th>
                <th>To</th>
                <th>Arrival</th>
                <th>Travel Time</th>
                <th>Running Days</th>
              </tr>
            </thead>
<tbody>
  {filteredTrains.map((train, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td
        className="train-number-link"
        onClick={() =>
          navigate(`/ttime?trainNo=${train.train_base.train_no}`)
        }
      >
        {train.train_base.train_no}
      </td>
      <td>{train.train_base.train_name}</td>
      <td>{train.train_base.from_stn_name}</td>
      <td>{train.train_base.from_time}</td>
      <td>{train.train_base.to_stn_name}</td>
      <td>{train.train_base.to_time}</td>
      <td>{train.train_base.travel_time}</td>
      <td className="running-days">
        {renderRunningDays(train.train_base.running_days)}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default TFinder;
