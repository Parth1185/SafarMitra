import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import "./TBook.css";
import stationsData from "../data/stations";

export default function TBook() {
  const navigate = useNavigate();
  const fromDropdownRef = useRef(null);
const toDropdownRef = useRef(null);


  // ======================= State =========================
  const [formData, setFormData] = useState({
    passengerName: "",
    age: "",
    gender: "",
    mobile: "",
    dateOfJourney: "",
    fromStation: "",
    fromStationCode: "",
    toStation: "",
    toStationCode: "",
    trainName: "",
    trainNumber: "",
    travelClass: "",
    fromTime: "",
    toTime: "",
  });

  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [dropdownType, setDropdownType] = useState(null);
  const [trains, setTrains] = useState([]);
  const [trainInfo, setTrainInfo] = useState("");

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState(""); // fromStation or toStation

  // Highlighted index for dropdown keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const highlightedItemRef = useRef(null);

  // ======================= Setup =========================
  useEffect(() => setStations(stationsData), []);

  // Scroll dropdown to keep highlighted item visible
  useEffect(() => {
    if (highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  // ======================= Speech Recognition =========================
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startListening = (fieldType) => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    setActiveField(fieldType);
    setIsListening(true);
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setIsListening(false);

      if (fieldType === "fromStation") {
        setFormData((prev) => ({
          ...prev,
          fromStation: speechResult,
        }));
        filterStations(speechResult, "fromStation");
      } else if (fieldType === "toStation") {
        setFormData((prev) => ({
          ...prev,
          toStation: speechResult,
        }));
        filterStations(speechResult, "toStation");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  };

  // ======================= Station Filter =========================
  const filterStations = (value, type) => {


    setDropdownType(type);
    if (!value.trim()) {
      setFilteredStations([]);
      setHighlightedIndex(-1);
      return;
    }
    const filtered = stations.filter(
      (station) =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.code.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStations(filtered);
    setHighlightedIndex(filtered.length > 0 ? 0 : -1);
  };

  const selectStation = (station, type) => {
    if (type === "fromStation") {
      if (formData.toStationCode === station.code)
        return alert("Source and destination cannot be the same");
      setFormData({
        ...formData,
        fromStation: station.name,
        fromStationCode: station.code,
      });
    } else {
      if (formData.fromStationCode === station.code)
        return alert("Source and destination cannot be the same");
      setFormData({
        ...formData,
        toStation: station.name,
        toStationCode: station.code,
      });
    }
    setFilteredStations([]);
    setHighlightedIndex(-1);
  };

  // ======================= Dropdown Keyboard Navigation =========================
  const handleStationInputKeyDown = (e, type) => {
    if (!filteredStations.length) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredStations.length - 1 ? prev + 1 : 0
      );
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredStations.length - 1
      );
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && filteredStations[highlightedIndex]) {
        selectStation(filteredStations[highlightedIndex], type);
        e.preventDefault();
      }
    }
  };

  // ======================= Train Fetching =========================
  const formatDateForAPI = (isoDate) => {
    if (!isoDate) return "";
    const [yyyy, mm, dd] = isoDate.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  const fetchTrains = async () => {
    if (!formData.fromStationCode || !formData.toStationCode || !formData.dateOfJourney) return;

    const dateParam = formatDateForAPI(formData.dateOfJourney);
    const url = `${import.meta.env.VITE_API_BASE_URL}/train/getTrainOn?from=${encodeURIComponent(
      formData.fromStationCode
    )}&to=${encodeURIComponent(formData.toStationCode)}&date=${encodeURIComponent(
      dateParam
    )}`;

    try {
      setTrainInfo("Searching trains...");
      const res = await fetch(url);
      const rawText = await res.text();
      const data = JSON.parse(rawText);

      if (!data || !data.success)
        return setTrainInfo(data?.data || "No trains found or API error.");

      const trainsList = Array.isArray(data.data) ? data.data : [];

      if (trainsList.length === 0)
        return setTrainInfo("No trains run on the selected date for this route.");

      // Sort trains by departure time
      trainsList.sort((a, b) => {
        const timeA = a.train_base?.from_time || "00:00";
        const timeB = b.train_base?.from_time || "00:00";
        return timeA.localeCompare(timeB);
      });

      setTrains(trainsList);
      setTrainInfo(`${trainsList.length} trains found. Choose one to continue.`);
    } catch (err) {
      console.error("Error fetching trains:", err);
      setTrainInfo("Error fetching trains. Check console.");
    }
  };

  useEffect(() => {
    if (formData.fromStationCode && formData.toStationCode && formData.dateOfJourney)
      fetchTrains();
    // Only fetch if all fields are filled
    // eslint-disable-next-line
  }, [formData.fromStationCode, formData.toStationCode, formData.dateOfJourney]);

  // ======================= Form Handlers =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.passengerName ||
      !formData.age ||
      !formData.gender ||
      !formData.mobile ||
      !formData.fromStationCode ||
      !formData.toStationCode ||
      !formData.trainName ||
      !formData.trainNumber ||
      !formData.travelClass
    )
      return alert("Please fill in all required fields.");

    if (formData.fromStationCode === formData.toStationCode)
      return alert("Origin and Destination cannot be the same.");

    const formatDate = (dateStr) => {
      const [yyyy, mm, dd] = dateStr.split("-");
      return `${dd}-${mm}-${yyyy}`;
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"/tickets/tbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passengerName: formData.passengerName,
          age: formData.age,
          gender: formData.gender,
          mobile: formData.mobile,
          dateOfJourney: formatDate(formData.dateOfJourney),
          fromStation: formData.fromStationCode,
          toStation: formData.toStationCode,
          trainName: formData.trainName,
          trainNumber: formData.trainNumber,
          travelClass: formData.travelClass,
          fromTime: formData.fromTime,
          toTime: formData.toTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `🎉 Ticket Booked Successfully!\n\nPassenger: ${data.ticket.passengerName}\nPNR: ${data.ticket.pnr}`
        );
        navigate("/thistory");
      } else {
        alert(data.message || "Failed to book ticket.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while booking the ticket.");
    }
  };

  // ======================= Render =========================
  return (
    <div className="page-background">
      <div className="ticket-booking">
        <marquee behavior="scroll" direction="left" scrollamount="8">
          <h1 id="hd">WELCOME TO SAFARMITRA RAILWAY TICKET BOOKING PORTAL</h1>
        </marquee>

        <form onSubmit={handleSubmit} className="ticket-form">
          {/* Passenger Details */}
          <fieldset>
            <h2>Passenger Details</h2>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="passengerName"
                value={formData.passengerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                min="1"
                max="90"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mobile:</label>
              <input
                type="tel"
                name="mobile"
                pattern="[0-9]{10}"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </fieldset>

          {/* Travel Details */}
          <fieldset>
            <h2>Travel Details</h2>
            <div className="form-group">
              <label>Date of Journey:</label>
              <input
                type="date"
                name="dateOfJourney"
                value={formData.dateOfJourney}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                required
              />
            </div>

<div className="form-group search-container" ref={fromDropdownRef}>
              <label>Origin Station:</label>
              <div className="input-with-mic">
                <input
                  type="text"
                  name="fromStation"
                  value={formData.fromStation}
                  onChange={(e) => {
                    handleChange(e);
                    filterStations(e.target.value, "fromStation");
                  }}
                  className="search-input"
                  onKeyDown={(e) =>
                    handleStationInputKeyDown(e, "fromStation")
                  }
                  required
                />
                <button
                  type="button"
                  className={`mic-button ${isListening && activeField === "fromStation" ? "listening" : ""}`}
                  onClick={() => startListening("fromStation")}
                  title="Speak station name"
                >
                  <FaMicrophone />
                </button>
              </div>
              {dropdownType === "fromStation" && filteredStations.length > 0 && (
                <div className="search-dropdown show">
                  {filteredStations.map((station, i) => (
                    <div
                      key={station.code}
                      className={`dropdown-item${highlightedIndex === i ? " highlighted" : ""}`}
                      onClick={() => selectStation(station, "fromStation")}
                      onMouseEnter={() => setHighlightedIndex(i)}
                      ref={highlightedIndex === i ? highlightedItemRef : null}
                      tabIndex={0}
                    >
                      {station.name} ({station.code})
                    </div>
                  ))}
                </div>
              )}
            </div>

<div className="form-group search-container" ref={toDropdownRef}>
              <label>Destination Station:</label>
              <div className="input-with-mic">
                <input
                  type="text"
                  name="toStation"
                  value={formData.toStation}
                  onChange={(e) => {
                    handleChange(e);
                    filterStations(e.target.value, "toStation");
                  }}
                  className="search-input"
                  onKeyDown={(e) =>
                    handleStationInputKeyDown(e, "toStation")
                  }
                  required
                />
                <button
                  type="button"
                  className={`mic-button ${isListening && activeField === "toStation" ? "listening" : ""}`}
                  onClick={() => startListening("toStation")}
                  title="Speak station name"
                >
                  <FaMicrophone />
                </button>
              </div>
              {dropdownType === "toStation" && filteredStations.length > 0 && (
                <div className="search-dropdown show">
                  {filteredStations.map((station, i) => (
                    <div
                      key={station.code}
                      className={`dropdown-item${highlightedIndex === i ? " highlighted" : ""}`}
                      onClick={() => selectStation(station, "toStation")}
                      onMouseEnter={() => setHighlightedIndex(i)}
                      ref={highlightedIndex === i ? highlightedItemRef : null}
                      tabIndex={0}
                    >
                      {station.name} ({station.code})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Train List */}
            <div className="form-group">
              <label>Train:</label>
              <select
                name="trainName"
                value={formData.trainName}
                onChange={(e) => {
                  const selected = trains.find(
                    (train) => train.train_base?.train_name === e.target.value
                  );
                  setFormData({
                    ...formData,
                    trainName: selected?.train_base?.train_name || "",
                    trainNumber: selected?.train_base?.train_no || "",
                    fromTime: selected?.train_base?.from_time || "",
                    toTime: selected?.train_base?.to_time || "",
                  });
                }}
                required
              >
                <option value="">Choose Train</option>
                {trains.map((train, index) => {
                  const base = train.train_base || {};
                  return (
                    <option key={index} value={base.train_name}>
                      {`${base.train_name} (${base.train_no}) — Dep: ${base.from_time} / Arr: ${base.to_time}`}
                    </option>
                  );
                })}
              </select>
              {trainInfo && <p>{trainInfo}</p>}
            </div>

            {/* Class */}
            <div className="form-group">
              <label>Class:</label>
              <select
                name="travelClass"
                value={formData.travelClass}
                onChange={handleChange}
                required
              >
                <option value="">Choose Class</option>
                <option value="CC">CC</option>
                <option value="SL">SL</option>
                <option value="3A">3A</option>
                <option value="2A">2A</option>
                <option value="1A">1A</option>
                <option value="EC">EC</option>
              </select>
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              className="go-back-button"
              onClick={() => navigate("/tdashboard")}
            >
              Go Back
            </button>
            <button type="submit" className="submit-button">
              Book Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
