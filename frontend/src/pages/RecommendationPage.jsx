import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import RepoCard from "../components/RepoCard/RepoCard.jsx";
import Pagination from "../components/Pagination/Pagination.jsx";
import { rankRepos } from "../utils/scoring.js";
import "./RecommendationPage.css";

const MATCHES_PER_PAGE = 10;

function RecommendationPage() {
  const [profile, setProfile] = useState(null);
  const [allRepos, setAllRepos] = useState([]);
  const [ranked, setRanked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch profile and repos on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch profile first
        const profileRes = await fetch("/api/profile");
        let profileData = null;
        if (profileRes.ok) {
          profileData = await profileRes.json();
        }
        setProfile(profileData);

        // Try hybrid match endpoint first, fall back to seeded repos
        let reposData = [];
        const matchRes = await fetch("/api/match");
        if (matchRes.ok) {
          reposData = await matchRes.json();
        } else {
          const fallbackRes = await fetch("/api/tracked-repos");
          if (!fallbackRes.ok) {
            throw new Error(`Failed to load repos: ${fallbackRes.status}`);
          }
          reposData = await fallbackRes.json();
        }
        setAllRepos(reposData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Re-rank whenever repos or profile change
  useEffect(() => {
    if (allRepos.length > 0 && profile) {
      const results = rankRepos(allRepos, profile, 100);
      setRanked(results);
    }
  }, [allRepos, profile]);

  // Filter ranked results by search text
  const filtered = searchFilter.trim()
    ? ranked.filter((r) => {
        const q = searchFilter.toLowerCase();
        return (
          (r.name || "").toLowerCase().includes(q) ||
          (r.fullName || "").toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (r.language || "").toLowerCase().includes(q) ||
          (r.topics || []).some((t) => t.toLowerCase().includes(q))
        );
      })
    : ranked;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / MATCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * MATCHES_PER_PAGE;
  const paginatedMatches = filtered.slice(startIndex, startIndex + MATCHES_PER_PAGE);

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const [trackedIds, setTrackedIds] = useState(new Set());

  // Fetch already-tracked repos on mount
  useEffect(() => {
    async function fetchTracked() {
      try {
        const res = await fetch("/api/tracked-repos/user");
        if (res.ok) {
          const data = await res.json();
          setTrackedIds(new Set(data.map((r) => r.githubId)));
        }
      } catch (err) {
        console.error("Error loading tracked repos:", err);
      }
    }
    fetchTracked();
  }, []);

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

        if (res.ok) {
          setTrackedIds((prev) => new Set([...prev, repo.githubId]));
        } else if (res.status === 409) {
          setTrackedIds((prev) => new Set([...prev, repo.githubId]));
        } else {
          console.error("Failed to track repo:", res.status);
        }
      } catch (err) {
        console.error("Error tracking repo:", err);
      }
    },
    [trackedIds],
  );

  return (
    <div className="recommendation-page">
      <Navbar />

      <div className="container-fluid recommendation-page-content py-4 px-4 mt-5">
        {/* Page header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-telescope recommendation-page-icon"></i>
            <h1 className="recommendation-page-title bi-lightning-charge-fill mb-0">Your Matches</h1>
          </div>

          <div className="recommendation-page-search">
            <input
              type="text"
              className="form-control recommendation-search-input"
              placeholder="Filter repos..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
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

        {/* No profile */}
        {!loading && !error && !profile && (
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            No profile found. <a href="/profile">Create your profile</a> first
            so we can match repos to your skills.
          </div>
        )}

        {/* No matches */}
        {!loading && !error && profile && filtered.length === 0 && (
          <div className="alert alert-info">
            {searchFilter
              ? "No repos match your filter. Try a different search term."
              : "No matching repos found. Try adding more languages or tools to your profile."}
          </div>
        )}

        {/* Results */}
        {!loading && filtered.length > 0 && (
          <>
            <p className="recommendation-results-count">
              Showing {filtered.length} matches — page {currentPage} of{" "}
              {totalPages}
            </p>

            <div className="row g-3">
              {paginatedMatches.map((repo) => (
                <div
                  key={repo.githubId || repo._id}
                  className="col-12 col-md-6"
                >
                  <RepoCard
                    repo={repo}
                    score={repo.score}
                    reasons={repo.reasons}
                    isTracked={trackedIds.has(repo.githubId)}
                    onTrack={handleTrack}
                  />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default RecommendationPage;