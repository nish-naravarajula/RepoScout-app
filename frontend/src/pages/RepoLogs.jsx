import { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import RepoLogEntry from "../components/RepoLogEntry/RepoLogEntry.jsx";
import RepoLogsTimeline from "../components/RepoLogsTimeline/RepoLogsTimeline.jsx";
import "./RepoLogs.css";

function RepoLogPage() {
  const [logs, setLogs] = useState([]);

  const repo_name = "repo_name"; // UPDATE LATER TO DYNAMIC REPO NAME BASED ON USER SELECTION

  useEffect(() => {
    async function fetchRepoLogs() {
      try {
        const response = await fetch(
          `/api/repo-logs?repoName=${encodeURIComponent(repo_name)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch repo logs.");
        }

        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching repo logs:", error);
      }
    }

    fetchRepoLogs();
  }, [repo_name]);

  async function handleAddLog(newLogEntry) {
    try {
      const response = await fetch("/api/repo-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLogEntry),
      });

      if (!response.ok) {
        throw new Error("Failed to save repo log.");
      }

      const savedLog = await response.json();

      setLogs((prevLogs) => [savedLog, ...prevLogs]);
    } catch (error) {
      console.error("Error saving repo log:", error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="project-log-page">
        <div className="project-log-container">
          <h1 className="project-log-page-title">
            Open-source repo: {repo_name}
          </h1>
          <div className="project-log-layout">
            <div className="project-log-left">
              <RepoLogEntry repoName={repo_name} onAddLog={handleAddLog} />
            </div>

            <div className="project-log-right">
              <RepoLogsTimeline logs={logs} setLogs={setLogs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepoLogPage;
