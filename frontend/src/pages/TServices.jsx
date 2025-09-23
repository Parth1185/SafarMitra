import React from "react";
import { useNavigate } from "react-router-dom";
import "./TServices.css";
import logo from "/assets/Logo.png";


const TServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Live Station",
      description: "Check Live Arrivals and Departures",
img: "https://cdn-icons-png.flaticon.com/128/6113/6113801.png",
      path: "/live-station"
    },
    {
      title: "Find Trains",
      description: "Search for trains between two stations.",
      img: "https://cdn-icons-png.flaticon.com/128/15304/15304228.png",
      path: "/tlist"
    },
    {
      title: "Train Timetable",
      description: "Detailed timetable and schedule for a train.",
      img:"https://cdn-icons-png.flaticon.com/128/6525/6525685.png",
      path: "/ttime"
    },
  ];

  return (
    <div className="services-page">
      <nav className="nar">
        <div className="lft">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="cntr">SafarMitra Railway Ticket Booking</div>

        <div className="rgt">
          <button
            onClick={() => navigate("/tdashboard")}
            className="nav-bn"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <h1 className="pale">Explore Other Train Services</h1>

      <div className="services-container">
        {services.map((service, index) => (
<div
  className="service-card"
  key={index}
  onClick={() => navigate(service.path)}
  role="button"
  tabIndex={0}
  onKeyPress={(e) => { if (e.key === 'Enter') navigate(service.path); }}
  style={{ backgroundImage: "none" }} // Remove background image
>
  <div className="icon-container">
    <img src={service.img} alt={`${service.title} icon`} className="service-icon" />
  </div>
  <div className="card-content">
    <h2>{service.title}</h2>
    <p>{service.description}</p>
  </div>
</div>


        ))}
      </div>
    </div>
  );
};

export default TServices;
