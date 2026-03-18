// import RepoList from "./components/RepoList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RecommendationPage from "./pages/RecommendationPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      { /* EDIT ROUTERS AS PAGES ARE ADDED, MISSING: HOMEPAGE AND DASHBOARD}
        { /* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/matches" element={<RecommendationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        { /* <Route path="/dashboard" element={<DashboardPage />} /> */ }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
