import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import "./HomePage.css";

function HomePage() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [trackedIds, setTrackedIds] = useState(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [reposRes, trackedRes] = await Promise.all([
          fetch("/api/tracked-repos"),
          fetch("/api/tracked-repos/user"),
        ]);

        if (!reposRes.ok) {
          throw new Error(`Failed to load repos: ${reposRes.status}`);
        }
        const reposData = await reposRes.json();
        setRepos(reposData);

        if (trackedRes.ok) {
          const trackedData = await trackedRes.json();
          setTrackedIds(new Set(trackedData.map((r) => r.githubId)));
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get unique languages for the filter dropdown
  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))].sort();

  // Apply filters
  const filtered = repos.filter((r) => {
    const matchesSearch =
      !searchFilter.trim() ||
      (r.name || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
      (r.fullName || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(searchFilter.toLowerCase());

    const matchesLanguage =
      !languageFilter || r.language === languageFilter;

    return matchesSearch && matchesLanguage;
  });

  function formatCount(n) {
    if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}k`;
    }
    return String(n);
  }

  const handleTrack = useCallback(
    async (repo) => {
      if (trackedIds.has(repo.githubId)) {
        return;
      }
      try {
        const res = await fetch("/api/tracked-repos/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            githubId: repo.githubId,
            name: repo.name,
            fullName: repo.fullName,
            owner: repo.owner,
            description: repo.description,
            url: repo.url,
            language: repo.language,
            stars: repo.stars,
            forks: repo.forks,
            openIssues: repo.openIssues,
            topics: repo.topics,
          }),
        });
        if (res.ok || res.status === 409) {
          setTrackedIds((prev) => new Set([...prev, repo.githubId]));
        }
      } catch (err) {
        console.error("Error tracking repo:", err);
      }
    },
    [trackedIds],
  );

  return (
    <div className="home-page">
      <Navbar />

      <div className="container-fluid home-page-content py-4 px-4 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-collection home-page-icon"></i>
            <h1 className="home-page-title mb-0">Explore Repositories</h1>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <select
              className="form-select home-page-language-select"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="form-control home-page-search-input"
              placeholder="Search repos..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}. Make sure your backend is running on port 3000.
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="alert alert-info">
            No repos found matching your filters.
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p className="home-page-results-count">
              {filtered.length} repositories
            </p>

            <div className="row g-3">
              {filtered.map((repo) => (
                <div key={repo.githubId || repo._id} className="col-12 col-md-6 col-lg-4">
                  <div className="home-repo-card">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-journal-code home-repo-icon"></i>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="home-repo-name-link"
                      >
                        <span className="home-repo-owner">{repo.owner}</span>
                        {" / "}
                        <span className="home-repo-name">{repo.name}</span>
                      </a>
                    </div>

                    <p className="home-repo-desc">
                      {repo.description || "No description provided."}
                    </p>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {repo.topics.slice(0, 4).map((topic) => (
                          <span key={topic} className="home-repo-topic">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="home-repo-stats">
                      {repo.language && (
                        <span className="home-repo-stat">
                          <i className="bi bi-circle-fill home-repo-lang-dot"></i>
                          {repo.language}
                        </span>
                      )}
                      <span className="home-repo-stat">
                        <i className="bi bi-star"></i> {formatCount(repo.stars)}
                      </span>
                      <span className="home-repo-stat">
                        <i className="bi bi-diagram-2"></i> {formatCount(repo.forks || 0)}
                      </span>
                    </div>

                    <div className="mt-2">
                      <button
                        type="button"
                        className={`btn btn-sm home-repo-track-btn ${trackedIds.has(repo.githubId) ? "btn-outline-success" : "btn-success"}`}
                        onClick={() => handleTrack(repo)}
                        disabled={trackedIds.has(repo.githubId)}
                      >
                        {trackedIds.has(repo.githubId) ? (
                          <>
                            <i className="bi bi-check-lg"></i> Tracked
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-lg"></i> Track
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;