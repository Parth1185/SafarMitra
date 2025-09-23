import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getTrain, betweenStations } from "../services/RailApi";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, skip login page
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) navigate("/dashboard");
  }, [navigate]);

  // Show flash if redirected from signup
  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash);
      window.history.replaceState({}, document.title, window.location.pathname);
      const timer = setTimeout(() => setFlash(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlash(null);

    try {
      const res = await api.post("/auth/login", form);

      // Normalize user object
      const userData = res.data?.user || res.data;
      if (!userData) throw new Error("Invalid server response");

      const safeUser = {
        id: userData.id || userData._id,
        name: userData.name || userData.username || "Traveler",
        username: userData.username || "",
        email: userData.email || "",
      };

      localStorage.setItem("user", JSON.stringify(safeUser));

      if (res.data?.token) localStorage.setItem("token", res.data.token);

      setFlash({ type: "success", msg: "Login successful! Redirecting..." });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setTimeout(() => {
        setError(err.response?.data?.message || "Invalid username or password");
        setLoading(false);

        // Shake effect
        const container = document.querySelector(".auth-container");
        if (container) {
          container.classList.add("shake");
          setTimeout(() => container.classList.remove("shake"), 500);
        }
      }, 400);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <img src="/assets/Logo.png" alt="SafarMitra Logo" className="logo" />

        <h1>Login to your account</h1>

        {/* Flash messages */}
        {flash && (
          <div className={`flash ${flash.type}`} role="alert" aria-live="assertive">
            {flash.msg}
          </div>
        )}

        {error && (
          <div className="flash error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {loading ? (
          <div className="loading-container" aria-busy="true" aria-live="polite">
            <div className="spinner" aria-hidden="true"></div>
            <p className="loading-text">Logging in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="username" className="login-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />

            <label htmlFor="password" className="login-label">
              Password
            </label>
            <div className="password-wrapper" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                  userSelect: "none",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </span>
            </div>

            <button type="submit">Login</button>
          </form>
        )}

        <p>
          New user? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}
