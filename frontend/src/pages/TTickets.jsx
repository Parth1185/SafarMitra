import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import stationsData from "../data/stations";
import "./TTickets.css";
import logo from "/assets/Logo.png";

const TTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Store logged-in user data
  const navigate = useNavigate();

  // ================== Fetch Tickets ==================
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/tickets/thistory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(res.data || []);

      // Decode user from localStorage or API if available
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ================== Cancel Ticket ==================
  const cancelTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/tickets/cancel/${ticketId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Ticket cancelled successfully!");
      fetchTickets(); // Refresh ticket list
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      alert("Failed to cancel the ticket. Please try again.");
    }
  };

  // ================== Logout ==================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <p className="loading-text">Loading your tickets...</p>;

  return (
    <div className="mytickets-page">
      {/* Navbar */}
      <nav className="nabr">
        <div className="left">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="centr">SafarMitra Railway Ticket Booking</div>

        <div className="rigt">
    
            <>
              <span className="wel">
                🙏 Namaste, {user.name || user.username}!
              </span>
              <button
                onClick={() => navigate("/tdashboard")}
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

      <h1 className="page-title">Your Booked Tickets</h1>

      {/* Tickets List */}
      {tickets.length > 0 ? (
        tickets.map((ticket) => {
          // Get full station names
          const fromStationFull =
            stationsData.find((s) => s.code === ticket.fromStation)?.name ||
            ticket.fromStation;
          const toStationFull =
            stationsData.find((s) => s.code === ticket.toStation)?.name ||
            ticket.toStation;

          // QR text containing all ticket details
          const qrText = `
PNR: ${ticket.pnr}
Passenger: ${ticket.passengerName} (${ticket.age}, ${ticket.gender})
Train: ${ticket.trainName} (${ticket.trainNumber})
From: ${fromStationFull} (${ticket.fromStation})  Dep: ${ticket.fromTime}
To: ${toStationFull} (${ticket.toStation})  Arr: ${ticket.toTime}
Seat: ${ticket.seatNumber}
Class: ${ticket.travelClass}
Date: ${new Date(ticket.dateOfJourney).toLocaleDateString()}
Mobile: ${ticket.mobile}
          `;

          return (
            <div key={ticket._id} className="ticket">
              <div className="ticket-content">
                {/* Ticket Info */}
                <div className="ticket-info">
                  <p><strong>🧾 PNR:</strong> {ticket.pnr}</p>
                  <p>
                    <strong>👤 Passenger:</strong> {ticket.passengerName} (
                    {ticket.age} years, {ticket.gender})
                  </p>
                  <p>
                    <strong>🚆 Train:</strong> {ticket.trainName} (
                    {ticket.trainNumber})
                  </p>

                  {/* Timeline with Departure and Arrival */}
                  <div className="timeline">
                    <div className="station dep">
                      <p>
                        <strong>📍 {fromStationFull}</strong> ({ticket.fromStation})
                      </p>
                      <p className="time">Dep: {ticket.fromTime}</p>
                    </div>
                    <div className="line"></div>
                    <div className="station arr">
                      <p>
                        <strong>📍 {toStationFull}</strong> ({ticket.toStation})
                      </p>
                      <p className="time">Arr: {ticket.toTime}</p>
                    </div>
                  </div>

                  <p>
                    <strong>📅 Date:</strong>{" "}
                    {new Date(ticket.dateOfJourney).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>📱 Mobile:</strong> {ticket.mobile}
                  </p>
                  <p>
                    <strong>🪑 Seat No.:</strong> {ticket.seatNumber}
                  </p>
                  <p>
                    <strong>💺 Class:</strong> {ticket.travelClass}
                  </p>
                  <center>
                    <button
                      className="cancel-btn"
                      onClick={() => cancelTicket(ticket._id)}
                    >
                      Cancel Ticket
                    </button>
                  </center>
                </div>

                {/* QR Code Section */}
                <div className="qr-code">
                  <QRCodeCanvas value={qrText} size={180} />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="no-tickets">No tickets booked yet.</p>
      )}

      <button className="book-btn" onClick={() => navigate("/tbook")}>
        Book New Ticket
      </button>
    </div>
  );
};

export default TTickets;
