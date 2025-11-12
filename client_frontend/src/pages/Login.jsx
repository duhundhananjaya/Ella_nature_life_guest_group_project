import React, { useState } from "react";
import bgImage1 from "../assets/loginpageback.jpg";
const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Login Successful!");
  };

  // Background styling (same as Register)
  const backgroundStyle = {
    
    backgroundImage: `url(${bgImage1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    filter: "blur(5px)",
    zIndex: 1,
  };

  const overlayStyle = {
    position: "relative",
    zIndex: 2,
  };

  const labelStyle = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#222",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Blurred background */}
      <div style={backgroundStyle}></div>

      {/* Foreground content */}
      <div
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={overlayStyle}
      >
        <div
          className="card shadow border-0 rounded-3 w-100 mx-3"
          style={{
            maxWidth: "400px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="card-body p-4">
            <h4 className="text-center mb-3 fw-semibold text-primary">
              Welcome Back
            </h4>
            <p className="text-center text-muted small mb-4">
              Login to manage your hotel bookings
            </p>

            <form onSubmit={handleSubmit}>
              {/* Username / Email */}
              <div className="mb-3">
                <label style={labelStyle}>Username or Email</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label className="form-check-label small">Remember me</label>
                </div>
                <a
                  href="/forgot-password"
                  className="small text-decoration-none text-primary"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-1 fw-semibold mt-2"
              >
                Login
              </button>
            </form>

            <p className="text-center mt-3 mb-0 small">
              Don’t have an account?{" "}
              <a href="/register" className="text-decoration-none text-primary">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
