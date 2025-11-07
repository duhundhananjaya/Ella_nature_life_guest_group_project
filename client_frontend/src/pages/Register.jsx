import React, { useState } from "react";
import bgImage from "../assets/registerpagebackground.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    country: "",
    agree: false,
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
    alert("Registration Successful!");
  };
  const labelStyle = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#222",
    marginBottom: "4px",
    display: "block",
  };

  const backgroundStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    filter: "blur(8px)",
    zIndex: 1,
  };

  const overlayStyle = {
    position: "relative",
    zIndex: 2,
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Background image with blur */}
      <div style={backgroundStyle}></div>

      {/* Overlay content */}
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
          <div className="card-body p-3 p-md-4">
            <h4 className="text-center mb-3 fw-semibold text-primary">
              Create Account
            </h4>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-2">
                <label className="form-label small" style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-2">
                <label className="form-label small" style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-2">
                <label className="form-label small" style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Username */}
              <div className="mb-2">
                <label className="form-label small" style={labelStyle}>Username</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-2">
                <label className="form-label small" style={labelStyle}>Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-2">
                <label className="form-label small" style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Country */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={labelStyle}
                >
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #007bff",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "#b5c3d1ff",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) =>
                    (e.target.style.border = "1px solid #007bff")
                  }
                  onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                >
                  <option value="">Select Country</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              </div>

              {/* Terms */}
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label small">
                  I agree to the Terms & Conditions
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-1 fw-semibold mt-2"
              >
                Register
              </button>
            </form>

            <p className="text-center mt-3 mb-0 small">
              Already have an account?{" "}
              <a href="/login" className="text-decoration-none text-primary">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
