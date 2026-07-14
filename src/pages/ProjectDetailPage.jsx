import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Settings, Trash2 } from "lucide-react";
import { getProjectByIdApi, updateProjectApi, deleteProjectApi } from "../api/project.api";
import { getProjectMembersApi, addProjectMemberApi, removeProjectMemberApi } from "../api/projectMember.api";
import { getProjectTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from "../api/task.api";
import { useProjects } from "../context/ProjectsContext";
import { useAuth } from "../context/AuthContext";
import ProjectLeadView from "./ProjectLeadView";
import ProjectMemberView from "./ProjectMemberView";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { refreshProjects, bumpTaskRefresh } = useProjects();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ name: "", description: "" });
  const [settingsError, setSettingsError] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isCompanyAdmin = user?.isCompanyAdmin;
  const isActualLead = project?.myRole === "lead";
  const isLead = isActualLead || isCompanyAdmin;
  const canDeleteProject = isLead;
  const canEditSettings = isActualLead;

  const loadAll = async () => {
    if (!user) return;
    try {
      const projectRes = await getProjectByIdApi(projectId);
      const projectData = projectRes.data.data;
      setProject(projectData);
      setSettingsForm({ name: projectData.name, description: projectData.description || "" });

      const tasksRes = await getProjectTasksApi(projectId);
      setTasks(tasksRes.data.data);

      // Company admin or project lead can see all members
      if (projectData.myRole === "lead" || user.isCompanyAdmin) {
        const membersRes = await getProjectMembersApi(projectId);
        setMembers(membersRes.data.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    loadAll();
  }, [projectId, user?._id]);

  const handleAddMember = async (userId) => {
    try {
      await addProjectMemberApi(projectId, userId);
      loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add member.");
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeProjectMemberApi(projectId, userId);
      loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove member.");
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTaskApi(projectId, taskData);
      loadAll();
      bumpTaskRefresh();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create task.");
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await updateTaskApi(projectId, taskId, updates);
      loadAll();
      bumpTaskRefresh();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskApi(projectId, taskId);
      loadAll();
      bumpTaskRefresh();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete task.");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsError("");
    if (!settingsForm.name.trim()) {
      setSettingsError("Project name is required.");
      return;
    }
    try {
      setSavingSettings(true);
      await updateProjectApi(projectId, settingsForm);
      await loadAll();
      await refreshProjects();
      setShowSettings(false);
    } catch (err) {
      setSettingsError(err?.response?.data?.message || "Failed to update project.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      `Delete "${project.name}" permanently? This removes all its tasks and members too. This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteProjectApi(projectId);
      await refreshProjects();
      navigate("/dashboard/projects");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete project.");
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading project…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                isLead
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
                  : project.myRole === "admin"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
              }`}
            >
              {isLead && project?.myRole === "lead"
                ? "Your role: Lead"
                : isCompanyAdmin
                  ? "Your role: Company admin"
                  : `Your role: ${project.myRole}`}
            </span>
            {project.lead && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Project lead: <span className="font-medium text-slate-700 dark:text-slate-300">{project.lead.name}</span>
              </span>
            )}
          </div>
        </div>

        {(canEditSettings || canDeleteProject) && (
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            <Settings size={14} /> Project Settings
          </button>
        )}
      </div>

      {(canEditSettings || canDeleteProject) && showSettings && (
        <div className="mb-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            Project Settings
          </h3>

          {canEditSettings ? (
            <form onSubmit={handleSaveSettings} className="flex flex-col gap-3 mb-5">
              {settingsError && (
                <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
                  {settingsError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Project Name
                </label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={settingsForm.description}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400 resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
                >
                  {savingSettings ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Only the project lead can edit project details. As a company admin, you can delete this project below.
            </p>
          )}

          {canDeleteProject && (
            <div className="border-t border-slate-200 dark:border-white/10 pt-4">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">
                Danger Zone
              </p>
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Permanently delete this project, its tasks, and its member list.
                </p>
                <button
                  onClick={handleDeleteProject}
                  disabled={deleting}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 size={13} /> {deleting ? "Deleting…" : "Delete Project"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isLead ? (
        <ProjectLeadView
          members={members}
          tasks={tasks}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <ProjectMemberView tasks={tasks} onUpdateTask={handleUpdateTask} />
      )}
    </div>
  );
};

export default ProjectDetailPage;