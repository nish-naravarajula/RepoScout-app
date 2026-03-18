// import RepoList from "./components/RepoList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RecommendationPage from "./pages/RecommendationPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import RepoLogPage from "./pages/RepoLogs.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/matches" element={<RecommendationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/repo-logs/:repoName" element={<RepoLogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
