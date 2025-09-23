import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faBookmark,
  faClock,
  faCheck,
  faHeadphones,
  faCreditCard,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faCheckCircle,
  faStar,
  faMoon,
  faSun,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

// Brand icons
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";


export default function Dashboard() {
  const [popupMessage, setPopupMessage] = useState("");
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Theme setup
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("safarMitraTheme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("safarMitraTheme");
    if (savedTheme) setTheme(savedTheme);
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Click Handlers
  const handleTrainClick = () => navigate("/tdashboard");
  const handleBusClick = () => setPopupMessage("🚌 Bus Booking Coming Soon!");
  const handleFlightClick = () => setPopupMessage("✈️ Flight Booking Coming Soon!");
  const closePopup = () => setPopupMessage("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className={`main-dashboard ${theme}`}>
      {/* -------- NAVBAR -------- */}
      <nav className="dashboard-navbar" aria-label="Main Navigation">
        <Link to="/" className="navbar-logo">
          <img src="/assets/Logo.png" alt="SafarMitra Logo" className="dashboard-logo" />
        </Link>
        <span className="dashboard-title">SafarMitra</span>
        <div className="navbar-right">
          {user ? (
            <>
              <span className="dashboard-welcome">
                🙏 Namaste, {user?.name || user?.username || "User"}
              </span>
              <Link to="/profile" className="dashboard-btn">
                Profile
              </Link>
              <button className="dashboard-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="dashboard-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="dashboard-btn" onClick={() => navigate("/signup")}>
                Signup
              </button>
            </>
          )}
          <button
            className="dashboard-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <FontAwesomeIcon icon={faMoon} />
            ) : (
              <>☀︎</>

            )}
          </button>
        </div>
      </nav>

      {/* -------- MAIN CONTENT -------- */}
      <div className={`dashboard-wrapper ${!user ? "logged-out" : "logged-in"}`}>
        <div className="dashboard-content">
          <h1 className="dashboard-heading">
            SafarMitra — Your Journey, Your Story, Your Companion
          </h1>
          <p className="dashboard-subtitle">
            Seamless bookings, trusted rides, and memories that last — connecting people, places, and adventures without limits.
          </p>
          {!user ? (
            <div className="dashboard-guest-card">
              <div className="rotating-star">✨</div>
              <h2 className="guest-title">Join SafarMitra Today!</h2>
              <p className="guest-subtitle">
                Please{" "}
                <Link to="/signup" className="guest-link">
                  Signup
                </Link>{" "}
                /{" "}
                <Link to="/login" className="guest-link">
                  Login
                </Link>{" "}
                to proceed further and start your journey
              </p>
              <p className="guest-footer">
                🎁🎉 Unlock exclusive deals and seamless booking experience
              </p>
            </div>
          ) : (
            <div className="dashboard-card-area">
              {/* Train Booking */}
              <div
                className="dashboard-card"
                style={{
                  backgroundImage: `url("https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYWNhYjUwM2UwLTVmNmQtMTFmMC05MTIyLTg5YjRhMjgyZWQzNS5qcGc=")`,
                }}
                onClick={handleTrainClick}
                aria-label="Train Booking"
              >
                <div className="dashboard-card-content">
                  <p>Train Booking</p>
                </div>
              </div>
              {/* Bus Booking */}
              <div
                className="dashboard-card"
                style={{
                  backgroundImage: `url("https://www.zingbus.com/blog/wp-content/uploads/2024/11/zingbusmaxxbus2-1024x683.jpeg")`,
                }}
                onClick={handleBusClick}
                aria-label="Bus Booking"
              >
                <div className="dashboard-card-content">
                  <p>Bus Booking</p>
                </div>
              </div>
              {/* Flight Booking */}
              <div
                className="dashboard-card"
                style={{
                  backgroundImage: `url("https://ik.imgkit.net/3vlqs5axxjf/TW/uploadedImages/Art/2022/1205/T1205VISTARA.jpg?n=1646&tr=w-1200%2Cfo-auto")`,
                }}
                onClick={handleFlightClick}
                aria-label="Flight Booking"
              >
                <div className="dashboard-card-content">
                  <p>Flight Booking</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* -------- WHY CHOOSE US -------- */}
        <div className="why-section-bg">
          <div className="why-container">
            <div className="why-title">Why Choose SafarMitra?</div>
            <div className="why-subtitle">
              Your trusted travel companion for seamless booking experiences across buses, trains, and flights
            </div>
            <div className="why-card-grid">
              <div className="why-card">
                <div className="why-card-icon">
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <div className="why-card-title">100% Secure Booking</div>
                <div className="why-card-desc">
                  Your personal and payment information is protected with bank-level security
                </div>
              </div>
              <div className="why-card">
                <div className="why-card-icon">
                  <FontAwesomeIcon icon={faBookmark} />
                </div>
                <div className="why-card-title">Best Price Guarantee</div>
                <div className="why-card-desc">
                  We ensure you get the lowest prices available with our price match promise
                </div>
              </div>
              <div className="why-card">
                <div className="why-card-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="why-card-title">24/7 Customer Support</div>
                <div className="why-card-desc">
                  Round-the-clock assistance for all your travel needs and booking queries
                </div>
              </div>
              <div className="why-card">
                <div className="why-card-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <div className="why-card-title">Instant Confirmation</div>
                <div className="why-card-desc">
                  Get immediate booking confirmations via SMS and email
                </div>
              </div>
              <div className="why-card">
                <div className="why-card-icon">
                  <FontAwesomeIcon icon={faHeadphones} />
                </div>
                <div className="why-card-title">Expert Travel Assistance</div>
                <div className="why-card-desc">
                  Our travel experts help you plan the perfect journey every time
                </div>
              </div>
              <div className="why-card">
                <div className="why-card-icon">
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <div className="why-card-title">Flexible Payment Options</div>
                <div className="why-card-desc">
                  Multiple payment methods including cards, wallets, and EMI options
                </div>
              </div>
            </div>
            <Link to="/login" className="why-cta-btn">
              Join over 1 million happy travelers!
            </Link>
          </div>
        </div>

        <footer className="footer-bg">
          <div className="footer-container">
            <div className="footer-main">
              <div className="footer-brand">
                <div className="brand-title">SafarMitra</div>
                <p>
                  Your trusted travel companion for seamless journey planning. Book buses, trains, and flights with confidence and ease.
                </p>

                <div className="contact-info">
                  <div><FontAwesomeIcon icon={faMapMarkerAlt} /> #187, Feroze Gandhi Market, Ludhiana - 141013</div>
                  <div><FontAwesomeIcon icon={faPhone} /> +91 94173 53263</div>
                  <div><FontAwesomeIcon icon={faEnvelope} /> support@safarmitra.com</div>
                </div>
              </div>
              <div className="footer-columns">
                <div className="footer-col">
                  <div className="col-title">Company</div>
                  <Link to="/about">About Us</Link>
                  <Link to="/careers">Careers</Link>
                  <Link to="/press">Press</Link>
                  <Link to="/blog">Blog</Link>
                  <Link to="/investors">Investors</Link>
                </div>
                <div className="footer-col">
                  <div className="col-title">Support</div>
                  <Link to="/help">Help Center</Link>
                  <Link to="/contact">Contact Us</Link>
                  <Link to="/cancellation">Cancellation</Link>
                  <Link to="/refunds">Refunds</Link>
                  <Link to="/guidelines">Travel Guidelines</Link>
                </div>
                <div className="footer-col">
                  <div className="col-title">Services</div>
                  <Link to="/bus">Bus Booking</Link>
                  <Link to="/train">Train Booking</Link>
                  <Link to="/flight">Flight Booking</Link>
                  <Link to="/hotel">Hotel Booking</Link>
                  <Link to="/insurance">Travel Insurance</Link>
                </div>
                <div className="footer-col">
                  <div className="col-title">Legal</div>
                  <Link to="/privacy">Privacy Policy</Link>
                  <Link to="/terms">Terms of Service</Link>
                  <Link to="/cookies">Cookie Policy</Link>
                  <Link to="/disclaimer">Disclaimer</Link>
                </div>
              </div>
            </div>

            <form className="footer-newsletter">
              <div className="footer-stats">
                <span className="verified">
                  <FontAwesomeIcon icon={faCheckCircle} /> Verified
                </span>
                <span className="rating">
                  <FontAwesomeIcon icon={faStar} style={{ color: '#ff8800ff' }} /> 4.8 Rating
                </span>
              </div>
              <br />
              <span className="newsletter-title">Stay Updated</span>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>

            <div className="footer-social">
              <a href="https://www.facebook.com/" className="facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://x.com/" className="twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://instagram.com" className="instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://linkedin.com" className="linkedin">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://youtube.com" className="youtube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>


            <div className="footer-base">
              <div>© 2025 SafarMitra. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>

      {/* -------- POPUP MODAL -------- */}
      {popupMessage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="popup-content">
              <h2>{popupMessage}</h2>
              <p>We are working hard to bring this feature to you soon.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
