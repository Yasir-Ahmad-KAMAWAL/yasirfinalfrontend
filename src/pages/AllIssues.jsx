import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectsContext";
import { getAllIssuesApi } from "../api/issues.api";
import { getMyProjectsApi } from "../api/project.api";
import { getProjectTasksApi, updateTaskApi } from "../api/task.api";
import { createTaskApi } from "../api/task.api";
import { getProjectMembersApi } from "../api/projectMember.api";
import { X, Calendar, User, AlignLeft, Plus, Star } from "lucide-react";
import { getFavoriteStatusApi, toggleFavoriteApi } from "../api/favorites.api";
import { useToast } from "../components/Toast";

const PRIORITY_STYLES = {
  high: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
};

const STATUS_LINE_COLORS = {
  todo: "bg-orange-500",
  "in-progress": "bg-blue-500",
  done: "bg-green-500",
};

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "todo", label: "Todo" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const AVATAR_COLORS = [
  "bg-blue-600", "bg-emerald-600", "bg-orange-600", "bg-purple-600", "bg-pink-600",
  "bg-teal-600", "bg-indigo-600", "bg-rose-600", "bg-cyan-600", "bg-amber-600",
  "bg-violet-600", "bg-lime-600", "bg-fuchsia-600", "bg-sky-600", "bg-red-600",
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const getProjectInitials = (name = "") => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }
  return words[0]?.slice(0, 2).toUpperCase() || "";
};

// ─── Issue Detail Modal ───────────────────────────────────────────────
const IssueDetailModal = ({ task, projectId, onClose, onUpdate, onBumpTaskRefresh }) => {
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (status === task.status) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      await updateTaskApi(projectId, task._id, { status });
      onUpdate(task._id, { status });
      if (onBumpTaskRefresh) onBumpTaskRefresh();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update task.");
    } finally {
      setSaving(false);
    }
  };

  const statusColor = STATUS_LINE_COLORS[task.status] || "bg-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-[3px] h-6 rounded-r ${statusColor}`} />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {task.title}
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {getProjectInitials(task.projectName)}-{task.taskNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Description */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              <AlignLeft size={13} />
              Description
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                <User size={13} />
                Assignee
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${getAvatarColor(task.assignedTo?.name)} flex items-center justify-center text-white text-[9px] font-semibold`}>
                  {getInitials(task.assignedTo?.name)}
                </div>
                <span className="text-sm text-slate-800 dark:text-slate-200">
                  {task.assignedTo?.name || "Unassigned"}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Priority
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md inline-block ${PRIORITY_STYLES[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Project
              </div>
              <span className="text-sm text-slate-800 dark:text-slate-200">
                {task.projectName}
              </span>
            </div>

            {task.dueDate && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  <Calendar size={13} />
                  Due Date
                </div>
                <span className="text-sm text-slate-800 dark:text-slate-200">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Status update */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Status
            </div>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400 transition-colors"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button
                onClick={handleSave}
                disabled={saving || status === task.status}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {saving ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── New Task Modal ────────────────────────────────────────────────────
const NewTaskModal = ({ projects, onClose, onCreateTask }) => {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedProjectId) {
      setMembers([]);
      return;
    }
    const loadMembers = async () => {
      setLoadingMembers(true);
      try {
        const res = await getProjectMembersApi(selectedProjectId);
        setMembers(res.data.data);
      } catch {
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };
    loadMembers();
  }, [selectedProjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!selectedProjectId) {
      setError("Please select a project.");
      return;
    }
    if (!form.assignedTo) {
      setError("Please assign the task to a team member.");
      return;
    }
    try {
      setSubmitting(true);
      await createTaskApi(selectedProjectId, form);
      onCreateTask();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">New Task</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Task title"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">Assign To</label>
              <select
                value={form.assignedTo}
                onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
                disabled={!selectedProjectId}
              >
                <option value="">{loadingMembers ? "Loading" : !selectedProjectId ? "Select project first" : "Assign to"}</option>
                {members.map((m) => (
                  <option key={m._id} value={m.userId._id}>{m.userId.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">Due Date (optional)</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors">
              {submitting ? "Creating" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main AllIssues Component ──────────────────────────────────────────
const AllIssues = () => {
  const { user } = useAuth();
  const { projects, bumpTaskRefresh, taskRefreshVersion } = useProjects();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const isAdmin = user?.isCompanyAdmin;
  const isPrivileged = isAdmin || user?.isProjectLead;

  useEffect(() => {
    if (!user) return;
    const loadTasks = async () => {
      try {
        if (isAdmin) {
          // Admin: see all issues across the entire company
          const res = await getAllIssuesApi();
          setTasks(res.data.data);
        } else {
          // Lead or regular member: see all tasks from projects they're involved in
          const projectsRes = await getMyProjectsApi();
          const projects = projectsRes.data.data;
          const allTasksNested = await Promise.all(
            projects.map(async (project) => {
              const tasksRes = await getProjectTasksApi(project._id);
              return tasksRes.data.data.map((task) => ({
                ...task,
                projectName: project.name,
                projectId: project._id,
              }));
            })
          );
          setTasks(allTasksNested.flat());
        }
      } catch (err) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [user, isAdmin, taskRefreshVersion]);

  // Load favorite status
  useEffect(() => {
    if (!user) return;
    const loadFavorites = async () => {
      try {
        const res = await getFavoriteStatusApi();
        setFavoriteIds(new Set(res.data.data || []));
      } catch {
        // ignore
      }
    };
    loadFavorites();
  }, [user]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  const filteredTasks =
    activeTab === "all" ? tasks : tasks.filter((t) => t.status === activeTab);

  const handleTaskUpdate = (taskId, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, ...updates } : t))
    );
  };

  const handleToggleFavorite = async (e, taskId) => {
    e.stopPropagation();
    try {
      await toggleFavoriteApi(taskId);
      const wasFavorited = favoriteIds.has(taskId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(taskId)) {
          next.delete(taskId);
        } else {
          next.add(taskId);
        }
        return next;
      });
      addToast(wasFavorited ? "Removed from favorites" : "Added to favorites");
    } catch {
      addToast("Failed to update favorite", "error");
    }
  };

  const refreshTasks = async () => {
    try {
      if (isAdmin) {
        const res = await getAllIssuesApi();
        setTasks(res.data.data);
      } else {
        const projectsRes = await getMyProjectsApi();
        const projects = projectsRes.data.data;
        const allTasksNested = await Promise.all(
          projects.map(async (project) => {
            const tasksRes = await getProjectTasksApi(project._id);
            return tasksRes.data.data.map((task) => ({
              ...task,
              projectName: project.name,
              projectId: project._id,
            }));
          })
        );
        setTasks(allTasksNested.flat());
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">Loading all issues\u2026</p>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            All Issues
          </h1>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
             <span className="font-semibold text-green-600 dark:text-green-400">{stats.done}</span> done{' · '}
             <span className="font-semibold text-orange-600 dark:text-orange-400">{stats.inProgress}</span> in progress{' · '}
             <span className="font-semibold">{stats.total}</span> total
           </p>
          {/* Progress bar: gradient from red \u2192 purple \u2192 indigo */}
          <div className="max-w-[260px] h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: stats.total ? `${(stats.done / stats.total) * 100}%` : "0%",
                background: "linear-gradient(90deg, #ef4444, #a855f7, #6366f1)",
              }}
            />
          </div>
        </div>
        {isPrivileged && (
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shrink-0 mt-1"
          >
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 border-l-4 border-l-slate-400 dark:border-l-slate-500 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Open Issues
          </p>
          <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">{stats.todo}</p>
        </div>
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 border-l-4 border-l-orange-500 dark:border-l-orange-500 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            In Progress
          </p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 border-l-4 border-l-green-500 dark:border-l-green-500 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Completed
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.done}</p>
        </div>
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 border-l-4 border-l-blue-500 dark:border-l-blue-500 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Total Issues
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
        </div>
      </div>

      {/* One single block \u2014 header tabs + issues list together inside the card */}
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
        {/* Tabs inside the block */}
        <div className="px-4 py-4">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-lg">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-black text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Issues list */}
        {filteredTasks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 p-6 text-center">
            No issues here.
          </p>
        ) : (
          filteredTasks.map((task) => {
            const lineColor = STATUS_LINE_COLORS[task.status] || STATUS_LINE_COLORS.todo;
            return (
              <div
                key={task._id}
                onClick={() => setSelectedTask(task)}
                className="flex items-center pl-0 pr-5 py-2 border-b border-slate-100 dark:border-white/5 last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                {/* Straight status color line \u2014 full height vertical stripe with left margin */}
                <div className={`ml-3 w-[3px] self-stretch shrink-0 rounded-r ${lineColor}`} />

                {/* Project initials + task number */}
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 hidden md:block w-14 text-center">
                  {getProjectInitials(task.projectName)}-{task.taskNumber}
                </span>

                {/* Star icon */}
                <button
                  onClick={(e) => handleToggleFavorite(e, task._id)}
                  className="mx-1 shrink-0 transition-colors"
                  title={favoriteIds.has(task._id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    size={14}
                    className={favoriteIds.has(task._id) ? "text-yellow-500 fill-yellow-500" : "text-slate-300 dark:text-slate-600 hover:text-yellow-400"}
                  />
                </button>

                <p className="flex-1 min-w-0 text-sm font-medium text-slate-900 dark:text-white truncate px-3">
                  {task.title}
                </p>

                {/* Fixed-width columns: project name, assignee, priority, status */}
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block w-[120px] text-center truncate">
                  {task.projectName}
                </span>

                <div className="w-[60px] flex justify-center shrink-0">
                  <div className={`w-6 h-6 rounded-full ${getAvatarColor(task.assignedTo?.name)} flex items-center justify-center text-white text-[9px] font-semibold`}>
                    {getInitials(task.assignedTo?.name)}
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md w-[60px] text-center shrink-0 ${PRIORITY_STYLES[task.priority]}`}
                >
                  {task.priority}
                </span>

                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 capitalize w-[80px] text-center shrink-0">
                  {task.status}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Issue detail modal */}
      {selectedTask && (
        <IssueDetailModal
          task={selectedTask}
          projectId={selectedTask.projectId}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onBumpTaskRefresh={bumpTaskRefresh}
        />
      )}

      {/* New task modal */}
      {showNewTaskModal && (
        <NewTaskModal
          projects={projects}
          onClose={() => setShowNewTaskModal(false)}
          onCreateTask={() => {
            refreshTasks();
            bumpTaskRefresh();
          }}
        />
      )}
    </div>
  );
};

export default AllIssues;