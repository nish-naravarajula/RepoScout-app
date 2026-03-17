// import RepoList from "./components/RepoList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      { /* EDIT ROUTERS AS PAGES ARE ADDED, MISSING: HOMEPAGE AND DASHBOARD}
        { /* <Route path="/" element={<HomePage />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        { /* <Route path="/dashboard" element={<DashboardPage />} /> */ }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
