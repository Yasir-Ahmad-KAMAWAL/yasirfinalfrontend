import { useEffect, useMemo, useState } from "react";
import { useProjects } from "../context/ProjectsContext";
import { getProjectTasksApi } from "../api/task.api";

const STATUS_COLORS = {
  todo: "bg-slate-400",
  "in-progress": "bg-orange-500",
  done: "bg-green-500",
};

const PRIORITY_COLORS = {
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const Analytics = () => {
  const { projects } = useProjects();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllTasks = async () => {
      if (projects.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const nested = await Promise.all(
          projects.map(async (project) => {
            const res = await getProjectTasksApi(project._id);
            return res.data.data;
          })
        );
        setTasks(nested.flat());
      } catch (err) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadAllTasks();
  }, [projects]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const byStatus = {
      todo: tasks.filter((t) => t.status === "todo").length,
      "in-progress": tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
    const byPriority = {
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    };

    const workloadMap = {};
    tasks.forEach((t) => {
      if (!t.assignedTo) return;
      const key = t.assignedTo._id;
      if (!workloadMap[key]) {
        workloadMap[key] = { name: t.assignedTo.name, count: 0 };
      }
      workloadMap[key].count += 1;
    });
    const workload = Object.values(workloadMap).sort((a, b) => b.count - a.count);

    const completionRate = total === 0 ? 0 : Math.round((byStatus.done / total) * 100);

    return { total, byStatus, byPriority, workload, completionRate };
  }, [tasks]);

  if (loading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading analytics…</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Performance across all your projects
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Total Issues
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Completion Rate
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completionRate}%</p>
        </div>
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            In Progress
          </p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.byStatus["in-progress"]}</p>
        </div>
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Projects
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{projects.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            Issues by Status
          </h3>
          <div className="flex flex-col gap-3">
            {Object.entries(stats.byStatus).map(([key, count]) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 capitalize">
                    {key.replace("-", " ")}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{count}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${STATUS_COLORS[key]} rounded-full transition-all`}
                    style={{ width: stats.total ? `${(count / stats.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            Issues by Priority
          </h3>
          <div className="flex flex-col gap-3">
            {Object.entries(stats.byPriority).map(([key, count]) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 capitalize">{key}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{count}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${PRIORITY_COLORS[key]} rounded-full transition-all`}
                    style={{ width: stats.total ? `${(count / stats.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Workload by Teammate
        </h3>
        {stats.workload.length === 0 ? (
          <p className="text-sm text-slate-400">No assigned tasks yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {stats.workload.map((person) => (
              <div key={person.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                  {getInitials(person.name)}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 w-32 truncate">
                  {person.name}
                </span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{
                      width: `${(person.count / Math.max(...stats.workload.map((w) => w.count))) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-6 text-right">
                  {person.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;