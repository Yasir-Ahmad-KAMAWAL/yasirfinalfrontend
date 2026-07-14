import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMyProjectsApi } from "../api/project.api";
import { useAuth } from "./AuthContext";

const ProjectsContext = createContext();

// Shared project list for the whole dashboard — both the Sidebar and the
// Projects page read from here, so creating a project in one place is
// immediately visible in the other without needing a browser refresh.
export const ProjectsProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskRefreshVersion, setTaskRefreshVersion] = useState(0);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await getMyProjectsApi();
      setProjects(res.data.data);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const bumpTaskRefresh = useCallback(() => {
    setTaskRefreshVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    if (user) {
      refreshProjects();
    }
  }, [user, refreshProjects]);

  return (
    <ProjectsContext.Provider value={{ projects, loading, refreshProjects, taskRefreshVersion, bumpTaskRefresh }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);