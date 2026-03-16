import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar-custom navbar navbar-expand-lg px-4">
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-4">
          <i className="bi bi-github navbar-github-icon"></i>

          <div className="d-flex align-items-center gap-4">
            <a href="/" className="navbar-link">
              Home
            </a>
            <a href="/" className="navbar-link">
              Profile
            </a>
            <a href="/" className="navbar-link">
              Dashboard
            </a>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control navbar-search"
            placeholder="Search or jump to..."
          />

          <button type="button" className="btn btn-outline-light">
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
