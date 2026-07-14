import { Routes, Route } from "react-router-dom";
import IntroductionPage from "./pages/IntroductionPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";
import MyIssues from "./pages/MyIssues";
import AllIssues from "./pages/AllIssues";
import Board from "./pages/Board";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ProjectsProvider } from "./context/ProjectsContext";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroductionPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ProjectsProvider>
              <MainLayout />
            </ProjectsProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<MyIssues />} />
        <Route path="all-issues" element={<AllIssues />} />
        <Route path="board" element={<Board />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
