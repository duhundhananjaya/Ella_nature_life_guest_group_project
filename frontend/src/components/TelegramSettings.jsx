import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TelegramSettings = () => {
  const [settings, setSettings] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [formData, setFormData] = useState({
    bot_token: "",
    chat_id: "",
    is_active: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/telegram-settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.settings) {
        setSettings(response.data.settings);
        setFormData({
          bot_token: response.data.settings.bot_token || "",
          chat_id: response.data.settings.chat_id || "",
          is_active: response.data.settings.is_active !== undefined ? response.data.settings.is_active : true
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings", error);
      setError("Error loading settings");
      setTimeout(() => setError(null), 3000);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/telegram-settings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(null), 3000);
        fetchSettings();
      } else {
        setError(response.data.message || "Error saving settings");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Error saving settings. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setTestLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/telegram-settings/test`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess("Test notification sent! Check your Telegram.");
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(response.data.message || "Failed to send test notification");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Error sending test notification");
      setTimeout(() => setError(null), 5000);
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading && !formData.bot_token) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Telegram Alert Bot Settings</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Telegram Settings</li>
        </ol>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
            <button type="button" className="btn-close shadow-none" onClick={() => setError(null)}></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="fas fa-check-circle me-2"></i>{success}
            <button type="button" className="btn-close shadow-none" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        <div className="row">
          {/* Settings Form */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <i className="fas fa-cog me-2"></i>
                <span className="fw-semibold">Configure Your Telegram Bot</span>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="bot_token" className="form-label fw-medium">
                      Bot Token <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-none"
                      id="bot_token"
                      name="bot_token"
                      value={formData.bot_token}
                      onChange={handleInputChange}
                      placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                      required
                    />
                    <small className="text-muted">
                      Example: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="chat_id" className="form-label fw-medium">
                      Chat ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-none"
                      id="chat_id"
                      name="chat_id"
                      value={formData.chat_id}
                      onChange={handleInputChange}
                      placeholder="123456789 or -1001234567890"
                      required
                    />
                    <small className="text-muted">
                      Example: 123456789 (for personal) or -1001234567890 (for groups)
                    </small>
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="is_active">
                        Enable Telegram Notifications
                      </label>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary shadow-none"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          Save Settings
                        </>
                      )}
                    </button>

                    {settings && (
                      <button 
                        type="button"
                        className="btn btn-info shadow-none text-white"
                        onClick={handleTestNotification}
                        disabled={testLoading}
                      >
                        {testLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>Send Test
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div className="card-footer bg-light">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  These settings are used to send booking alerts to your Telegram account.
                </small>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <i className="fas fa-book me-2"></i>
                <span className="fw-semibold">Setup Instructions</span>
              </div>
              <div className="card-body p-4">
                <div className="instruction-section">
                  <h6 className="fw-bold mb-3">
                    <i className="fab fa-telegram-plane me-2"></i>How to Create Your Telegram Bot
                  </h6>

                  <div className="instruction-step mb-3">
                    <div className="d-flex align-items-start">
                      <span className="badge bg-primary rounded-circle me-3" style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>1</span>
                      <div>
                        <strong>Open Telegram & Find BotFather</strong>
                        <p className="mb-0 text-muted">Search for <strong>@BotFather</strong> in Telegram and start a chat.</p>
                      </div>
                    </div>
                  </div>

                  <div className="instruction-step mb-3">
                    <div className="d-flex align-items-start">
                      <span className="badge bg-primary rounded-circle me-3" style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>2</span>
                      <div>
                        <strong>Create a New Bot</strong>
                        <p className="mb-0 text-muted">Send the command:</p>
                        <code className="d-block p-2 bg-dark text-success rounded mt-1">/newbot</code>
                      </div>
                    </div>
                  </div>

                  <div className="instruction-step mb-3">
                    <div className="d-flex align-items-start">
                      <span className="badge bg-primary rounded-circle me-3" style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>3</span>
                      <div>
                        <strong>Name Your Bot</strong>
                        <p className="mb-0 text-muted">BotFather will ask for a name (e.g., "Hotel Alert Bot").</p>
                      </div>
                    </div>
                  </div>

                  <div className="instruction-step mb-3">
                    <div className="d-flex align-items-start">
                      <span className="badge bg-primary rounded-circle me-3" style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>4</span>
                      <div>
                        <strong>Set Username</strong>
                        <p className="mb-0 text-muted">Choose a username ending in "bot" (e.g., "myhotel_alert_bot").</p>
                      </div>
                    </div>
                  </div>

                  <div className="instruction-step mb-3">
                    <div className="d-flex align-items-start">
                      <span className="badge bg-primary rounded-circle me-3" style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>5</span>
                      <div>
                        <strong>Copy Your Bot Token</strong>
                        <p className="mb-0 text-muted">BotFather will provide a token like:</p>
                        <code className="d-block p-2 bg-dark text-success rounded mt-1">1234567890:ABCdefGHIjklMNOpqrsTUVwxyz</code>
                        <p className="mt-2 mb-0 text-danger"><strong>⚠️ Keep this token secret!</strong></p>
                      </div>
                    </div>
                  </div>

                  <div className="instruction-step mb-3">
                    <div className="d-flex align-items-start">
                      <span className="badge bg-primary rounded-circle me-3" style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>6</span>
                      <div>
                        <strong>Get Your Chat ID</strong>
                        <p className="mb-0 text-muted">Search for <strong>@userinfobot</strong> in Telegram and start it.</p>
                        <p className="mb-0 text-muted">It will show your Chat ID (a number like 123456789).</p>
                      </div>
                    </div>
                  </div>

                  <div className="instruction-step mb-3">
                    <div className="d-flex align-items-start">
                      <span className="badge bg-primary rounded-circle me-3" style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>7</span>
                      <div>
                        <strong>Start Your Bot</strong>
                        <p className="mb-0 text-muted">Find your newly created bot in Telegram and click <strong>Start</strong> or send <code>/start</code>.</p>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info mt-4">
                    <h6 className="fw-bold">
                      <i className="fas fa-lightbulb me-2"></i>For Group Notifications:
                    </h6>
                    <ol className="mb-0 ps-3">
                      <li>Add your bot to a Telegram group</li>
                      <li>Make it an admin (optional but recommended)</li>
                      <li>Use a bot like <strong>@getidsbot</strong> to get the group Chat ID (starts with -100)</li>
                    </ol>
                  </div>

                  <div className="alert alert-warning mt-3 mb-0">
                    <h6 className="fw-bold">
                      <i className="fas fa-shield-alt me-2"></i>Security Tips:
                    </h6>
                    <ul className="mb-0">
                      <li>Never share your bot token publicly</li>
                      <li>Only use this bot for hotel alerts</li>
                      <li>If compromised, regenerate token via BotFather</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .instruction-step {
          padding-bottom: 15px;
          border-bottom: 1px solid #e9ecef;
        }
        .instruction-step:last-child {
          border-bottom: none;
        }
        @media (max-width: 768px) {
          .instruction-step .badge {
            width: 25px !important;
            height: 25px !important;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </main>
  );
};

export default TelegramSettings;