import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { TECHNOLOGIES } from "../data/technologies.js";
import "./LoginPage.css";

function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [regStep, setRegStep] = useState(1); // 1 = credentials, 2 = tech selection

  // Credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Tech selections (arrays of IDs)
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  function toggleSelection(list, setList, id) {
    if (list.includes(id)) {
      setList(list.filter((item) => item !== id));
    } else {
      setList([...list, id]);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleNextStep(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setRegStep(2);
  }

  async function handleRegisterSubmit() {
    setError("");
    setSubmitting(true);
    try {
      await register(
        username,
        password,
        firstName,
        lastName,
        selectedLanguages,
        selectedTools,
        selectedDatabases,
      );
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function renderTechGrid(category, selected, setSelected) {
    return (
      <div className="d-flex flex-wrap gap-2">
        {TECHNOLOGIES[category].map((tech) => {
          const isSelected = selected.includes(tech.id);
          return (
            <button
              key={tech.id}
              type="button"
              className={`login-tech-option ${isSelected ? "login-tech-option-selected" : ""}`}
              onClick={() => toggleSelection(selected, setSelected, tech.id)}
            >
              <img src={tech.badgeUrl} alt={tech.name} className="login-tech-badge" />
              {isSelected && (
                <span className="login-tech-check">
                  <i className="bi bi-check-circle-fill"></i>
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // --- LOGIN FORM ---
  if (!isRegistering) {
    return (
      <div className="login-page">
        <nav className="login-navbar">
          <i className="bi bi-file-earmark-code login-navbar-icon"></i>
        </nav>

        <div className="login-container">
          <h1 className="login-brand">RepoScout</h1>
          <p className="login-tagline">Stay on top of your FOSS journey!</p>

          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="alert alert-danger login-error">{error}</div>}

            <input
              type="text"
              className="form-control login-input"
              placeholder="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className={`btn login-submit-btn ${username.trim() && password.trim() ? "login-submit-btn-ready" : "login-submit-btn-dim"}`}
              disabled={submitting}
            >
              {submitting ? "Please wait..." : "Login"}
            </button>
          </form>

          <p className="login-toggle-text">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => {
                setIsRegistering(true);
                setRegStep(1);
                setError("");
              }}
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    );
  }

  // --- REGISTER STEP 1: Credentials ---
  if (regStep === 1) {
    return (
      <div className="login-page">
        <nav className="login-navbar">
          <i className="bi bi-file-earmark-code login-navbar-icon"></i>
        </nav>

        <div className="login-container">
          <h1 className="login-brand">Create Account</h1>
          <p className="login-tagline">Step 1 of 2 — Your info</p>

          <form className="login-form" onSubmit={handleNextStep}>
            {error && <div className="alert alert-danger login-error">{error}</div>}

            <input
              type="text"
              className="form-control login-input"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="form-control login-input"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              className="form-control login-input"
              placeholder="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control login-input"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className={`btn login-submit-btn ${username.trim() && password.length >= 6 ? "login-submit-btn-ready" : "login-submit-btn-dim"}`}
            >
              Next — Pick your skills
            </button>
          </form>

          <p className="login-toggle-text">
            Already have an account?{" "}
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => {
                setIsRegistering(false);
                setRegStep(1);
                setError("");
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    );
  }

  // --- REGISTER STEP 2: Tech Selection ---
  return (
    <div className="login-page">
      <nav className="login-navbar">
        <i className="bi bi-file-earmark-code login-navbar-icon"></i>
      </nav>

      <div className="login-container login-container-wide">
        <h1 className="login-brand-sm">Almost there, {firstName || username}!</h1>
        <p className="login-tagline">Step 2 of 2 — Select your skills so we can match repos for you</p>

        {error && <div className="alert alert-danger login-error mb-3">{error}</div>}

        <div className="login-tech-section">
          <h3 className="login-tech-section-title">Languages</h3>
          {renderTechGrid("languages", selectedLanguages, setSelectedLanguages)}
        </div>

        <div className="login-tech-section">
          <h3 className="login-tech-section-title">Frameworks, Libraries &amp; Tools</h3>
          {renderTechGrid("tools", selectedTools, setSelectedTools)}
        </div>

        <div className="login-tech-section">
          <h3 className="login-tech-section-title">Databases</h3>
          {renderTechGrid("databases", selectedDatabases, setSelectedDatabases)}
        </div>

        <div className="d-flex gap-2 mt-4 justify-content-center">
          <button
            type="button"
            className="btn btn-outline-secondary login-back-btn"
            onClick={() => setRegStep(1)}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>

          <button
            type="button"
            className={`btn login-submit-btn ${(selectedLanguages.length + selectedTools.length + selectedDatabases.length) > 0 ? "login-submit-btn-ready" : "login-submit-btn-dim"}`}
            onClick={handleRegisterSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <p className="login-skip-text">
          <button
            type="button"
            className="login-toggle-btn"
            onClick={handleRegisterSubmit}
            disabled={submitting}
          >
            Skip — I&apos;ll add these later
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;