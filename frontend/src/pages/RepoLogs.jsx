import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import RepoLogEntry from "../components/RepoLogEntry/RepoLogEntry.jsx";
import "./RepoLogs.css";

function ProjectLogPage() {
  const [logs, setLogs] = useState([]);

  function handleAddLog(newLog) {
    setLogs((prevLogs) => {
      return [newLog, ...prevLogs];
    });
  }

  return (
    <div>
      <RepoLogEntry repoName="repo_name" onAddLog={handleAddLog} />
    </div>
  );
}

export default ProjectLogPage;