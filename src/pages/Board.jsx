import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useProjects } from "../context/ProjectsContext";
import { getProjectTasksApi, updateTaskApi } from "../api/task.api";

const PRIORITY_STYLES = {
  high: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
};

const COLUMNS = [
  { key: "todo", label: "Todo", dot: "bg-slate-400" },
  { key: "in-progress", label: "In Progress", dot: "bg-orange-500" },
  { key: "done", label: "Done", dot: "bg-green-500" },
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

const Board = () => {
  const { projects, bumpTaskRefresh } = useProjects();
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0]._id);
    }
  }, [projects, activeProjectId]);

  useEffect(() => {
    if (!activeProjectId) return;
    const loadTasks = async () => {
      setLoading(true);
      try {
        const res = await getProjectTasksApi(activeProjectId);
        setTasks(res.data.data);
      } catch (err) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [activeProjectId]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskApi(activeProjectId, taskId, { status });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
      bumpTaskRefresh();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update task.");
    }
  };

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No projects yet. Create one from the Projects page first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Board</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {projects.find((p) => p._id === activeProjectId)?.name}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-1">
          {projects.map((project) => (
            <button
              key={project._id}
              onClick={() => setActiveProjectId(project._id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeProjectId === project._id
                  ? "bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading board…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.key);
            return (
              <div key={column.key}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`w-2 h-2 rounded-full ${column.dot}`} />
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {column.label}
                  </h3>
                  <span className="text-xs text-slate-400">{columnTasks.length}</span>
                </div>

                <div className="flex flex-col gap-2">
                  {columnTasks.length === 0 ? (
                    <div className="border border-dashed border-slate-300 dark:border-white/10 rounded-xl p-4 text-center text-xs text-slate-400">
                      No tasks
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3"
                      >
                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                          {task.title}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${PRIORITY_STYLES[task.priority]}`}
                          >
                            {task.priority}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <div className={`w-5 h-5 rounded-full ${getAvatarColor(task.assignedTo?.name)} flex items-center justify-center text-white text-[9px] font-semibold shrink-0`}>
                              {getInitials(task.assignedTo?.name)}
                            </div>
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              className="text-[10px] px-1 py-0.5 rounded bg-white dark:bg-black text-slate-600 dark:text-slate-300 outline-none border border-slate-200 dark:border-white/10"
                            >
                              <option value="todo">Todo</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Board;