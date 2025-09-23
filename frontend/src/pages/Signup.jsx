import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./sign.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFlash(null);

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        username,
        email,
        password,
      });

      navigate("/login", {
        state: {
          flash: { type: "success", msg: "Signup successful! Please login." },
        },
      });
    } catch (err) {
      setFlash({
        type: "error",
        msg: err.response?.data?.message || "Signup failed, try again",
      });
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="auth-container" role="main">
                <img src="/assets/Logo.png" alt="SafarMitra Logo" className="logo" />

        <h1>Signup</h1>
        {flash && <div className={`flash ${flash.type}`}>{flash.msg}</div>}

        {loading ? (
          <div className="spinner" />
        ) : (
          <form onSubmit={handleSignup} className={shake ? "shake" : ""}>
            <label htmlFor="name" className="login-label">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />

            <label htmlFor="username" className="login-label">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />

            <label htmlFor="email" className="login-label">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <label htmlFor="password" className="login-label">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <button type="submit">Signup</button>
          </form>
        )}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
