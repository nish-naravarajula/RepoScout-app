import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal.jsx";
import "./DashboardPage.css";

function DashboardPage() {
  const [trackedRepos, setTrackedRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [untrackTarget, setUntrackTarget] = useState(null);

  useEffect(() => {
    fetchTracked();
  }, []);

  async function fetchTracked() {
    try {
      setLoading(true);
      const res = await fetch("/api/tracked-repos/user");
      if (!res.ok) {
        throw new Error(`Failed to load tracked repos: ${res.status}`);
      }
      const data = await res.json();
      setTrackedRepos(data);
    } catch (err) {
      console.error("Error loading tracked repos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleUntrackClick = useCallback((repo) => {
    setUntrackTarget(repo);
  }, []);

  const handleUntrackConfirm = useCallback(async () => {
    if (!untrackTarget) {
      return;
    }

    try {
      const res = await fetch(
        `/api/tracked-repos/user/${untrackTarget.githubId}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        setTrackedRepos((prev) =>
          prev.filter((r) => r.githubId !== untrackTarget.githubId),
        );
      } else {
        console.error("Failed to untrack repo:", res.status);
      }
    } catch (err) {
      console.error("Error untracking repo:", err);
    } finally {
      setUntrackTarget(null);
    }
  }, [untrackTarget]);

  // Filter
  const filtered = searchFilter.trim()
    ? trackedRepos.filter((r) => {
        const q = searchFilter.toLowerCase();
        return (
          (r.name || "").toLowerCase().includes(q) ||
          (r.fullName || "").toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (r.language || "").toLowerCase().includes(q)
        );
      })
    : trackedRepos;

  // Get unique languages for the summary
  const languages = [
    ...new Set(trackedRepos.map((r) => r.language).filter(Boolean)),
  ];

  function formatCount(n) {
    if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}k`;
    }
    return String(n);
  }

  function formatDate(dateStr) {
    if (!dateStr) {
      return "";
    }
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString();
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="container-fluid dashboard-page-content py-4 px-4 mt-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-circle dashboard-page-icon"></i>
            <h1 className="dashboard-page-title mb-0">Your Projects</h1>
          </div>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control dashboard-search-input"
              placeholder="Find a repository..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Summary card */}
        <div className="dashboard-summary-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="dashboard-summary-title mb-0">
              {trackedRepos.length} tracked{" "}
              {trackedRepos.length === 1 ? "repository" : "repositories"}
            </h2>
          </div>

          {trackedRepos.length > 0 && (
            <div className="d-flex flex-wrap gap-3">
              <div className="dashboard-stat-box">
                <i className="bi bi-journal-code"></i>
                <span>
                  <strong>{trackedRepos.length}</strong> repos
                </span>
              </div>

              <div className="dashboard-stat-box">
                <i className="bi bi-code-slash"></i>
                <span>
                  <strong>{languages.length}</strong> languages
                </span>
              </div>

              <div className="dashboard-stat-box">
                <i className="bi bi-star"></i>
                <span>
                  <strong>
                    {formatCount(
                      trackedRepos.reduce((sum, r) => sum + (r.stars || 0), 0),
                    )}
                  </strong>{" "}
                  total stars
                </span>
              </div>

              {languages.length > 0 && (
                <div className="dashboard-stat-box">
                  <i className="bi bi-translate"></i>
                  <span>{languages.join(", ")}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            {error}. Make sure your backend is running on port 3000.
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && trackedRepos.length === 0 && (
          <div className="dashboard-empty-state">
            <i className="bi bi-inbox dashboard-empty-icon"></i>
            <h3>No tracked repositories yet</h3>
            <p>
              Start by exploring repos on the{" "}
              <a href="/">Home page</a> or check your{" "}
              <a href="/matches">Matches</a> to find repos that fit your skills.
            </p>
          </div>
        )}

        {/* No filter results */}
        {!loading &&
          !error &&
          trackedRepos.length > 0 &&
          filtered.length === 0 && (
            <div className="alert alert-info">
              No tracked repos match your search.
            </div>
          )}

        {/* Tracked repos grid */}
        {!loading && filtered.length > 0 && (
          <div className="row g-3">
            {filtered.map((repo) => (
              <div
                key={repo.githubId || repo._id}
                className="col-12 col-md-6"
              >
                <div className="dashboard-repo-card">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-journal-code dashboard-repo-icon"></i>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dashboard-repo-name-link"
                      >
                        <span className="dashboard-repo-owner">
                          {repo.owner}
                        </span>
                        {" / "}
                        <span className="dashboard-repo-name">{repo.name}</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger dashboard-untrack-btn"
                      onClick={() => handleUntrackClick(repo)}
                    >
                      <i className="bi bi-x-lg"></i> Untrack
                    </button>
                  </div>

                  <p className="dashboard-repo-desc">
                    {repo.description || "No description provided."}
                  </p>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span key={topic} className="dashboard-repo-topic">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="dashboard-repo-footer">
                    <div className="dashboard-repo-stats">
                      {repo.language && (
                        <span className="dashboard-repo-stat">
                          <i className="bi bi-circle-fill dashboard-repo-lang-dot"></i>
                          {repo.language}
                        </span>
                      )}
                      <span className="dashboard-repo-stat">
                        <i className="bi bi-star"></i>{" "}
                        {formatCount(repo.stars)}
                      </span>
                      <span className="dashboard-repo-stat">
                        <i className="bi bi-diagram-2"></i>{" "}
                        {formatCount(repo.forks || 0)}
                      </span>
                    </div>

                    <span className="dashboard-repo-tracked-date">
                      Tracked {formatDate(repo.trackedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        show={untrackTarget !== null}
        title="Untrack Repository"
        message={
          untrackTarget
            ? `Are you sure you want to remove "${untrackTarget.fullName || untrackTarget.name}" from your tracked repos?`
            : ""
        }
        confirmLabel="Untrack"
        confirmVariant="danger"
        onConfirm={handleUntrackConfirm}
        onCancel={() => setUntrackTarget(null)}
      />
    </div>
  );
}

export default DashboardPage;