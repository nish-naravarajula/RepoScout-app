import { useEffect, useState } from "react";

function RepoList() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    loadRepos();
  }, []);

  async function loadRepos() {
    try {
      const response = await fetch("/api/tracked-repos");
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Error loading repos:", error);
    }
  }

  return (
    <div>
      <h1>Open Source Repositories</h1>

      <ul>
        {repos.map((repo) => (
          <li key={repo.githubId}>
            <h3>{repo.fullName}</h3>
            <p>{repo.description}</p>
            <p>
              Language: {repo.language} ⭐ {repo.stars}
            </p>

            <a href={repo.url} target="_blank">
              View Repository
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RepoList;
