import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import "./Profile.css";




const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setFormData({
        name: savedUser.name || "",
        username: savedUser.username || "",
        email: savedUser.email || "",
        currentPassword: "",
        newPassword: "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("message")) setMessage(params.get("message"));
    if (params.get("error")) setError(params.get("error"));
  }, [location.search]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/"); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update profile.");
        return;
      }

      const updatedData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
      };

      if (formData.currentPassword && formData.newPassword) {
        updatedData.currentPassword = formData.currentPassword;
        updatedData.newPassword = formData.newPassword;
      }

      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"/auth/edit-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Profile updated successfully!");
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setError("");
        setIsEditing(false);

        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      } else {
        setError(result.error || "Failed to update profile.");
        console.error("Update error:", result);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating. Please try again.");
    }
  };

  if (!user) return <p className="loading-text">Loading profile...</p>;

  return (
    <div className="profile-page">
      
      <nav className="dashboard-navbar" aria-label="Main Navigation">
        <Link to="/" className="navbar-logo">
          <img src="/assets/Logo.png" alt="SafarMitra Logo" className="dashboard-logo" />
        </Link>
        <span className="dashboard-title">SafarMitra</span>

        <div className="navbar-right">
          <span className="dashboard-welcome">
            🙏 Namaste, {user?.name || user?.username || "User"}
          </span>
          <Link to="/dashboard" className="dashboard-btn">
            Dashboard
          </Link>
          <button className="dashboard-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      
      <main className="main-content">
        <div className="profile-container">
          <h2>My Profile</h2>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {!isEditing ? (
            <>
              <div className="profile-item">
                <span className="label">Name:</span> {user.name}
              </div>
              <div className="profile-item">
                <span className="label">Username:</span> {user.username}
              </div>
              <div className="profile-item">
                <span className="label">Email:</span> {user.email}
              </div>
              <div className="back-btn">
                <button className="button" onClick={() => navigate("/dashboard")}>
                  ← Back
                </button>
                <button className="button" onClick={toggleEdit}>
                  ✎ Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              {["name", "username", "email"].map((field) => (
                <div className="profile-item" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div className="profile-item">
                <label>Current Password (optional):</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Leave blank if not changing"
                />
              </div>
              <div className="profile-item">
                <label>New Password (optional):</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank if not changing"
                />
              </div>
              <div className="back-btn">
                <button type="submit" className="button">
                  Save
                </button>
                <button type="button" className="button" onClick={toggleEdit}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

 <footer className="footer-bg">
          <div className="footer-container">
              <div>© 2025 SafarMitra. All rights reserved.</div>

          </div>
        </footer>
      </div>   
  );
};

export default Profile;
