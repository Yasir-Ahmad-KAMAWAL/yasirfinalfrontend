import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Calendar, User, AlignLeft } from "lucide-react";
import { getAllIssuesApi } from "../api/issues.api";
import { updateTaskApi } from "../api/task.api";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectsContext";

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
  if (words.length >= 2) return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return words[0]?.slice(0, 2).toUpperCase() || "";
};

// ─── Issue Detail Modal (inside search) ───────────────────────────────
const SearchIssueDetailModal = ({ task, onClose, onStatusChange }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (status === task.status) { onClose(); return; }
    setSaving(true);
    try {
      // Extract projectId as a plain string — the search API may return it as an object
      const projectId = task.projectId?._id || task.projectId?.toString?.() || task.projectId;
      await updateTaskApi(projectId, task._id, { status });
      if (onStatusChange) onStatusChange();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update task.");
    } finally {
      setSaving(false);
    }
  };

  const statusColor = STATUS_LINE_COLORS[task.status] || "bg-slate-400";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-[3px] h-6 rounded-r ${statusColor}`} />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{task.title}</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {getProjectInitials(task.projectName)}-{task.taskNumber}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              <AlignLeft size={13} /> Description
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{task.description || "No description provided."}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                <User size={13} /> Assignee
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${getAvatarColor(task.assignedTo?.name)} flex items-center justify-center text-white text-[9px] font-semibold`}>
                  {getInitials(task.assignedTo?.name)}
                </div>
                <span className="text-sm text-slate-800 dark:text-slate-200">{task.assignedTo?.name || "Unassigned"}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Priority</div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md inline-block ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Project</div>
              <span className="text-sm text-slate-800 dark:text-slate-200">{task.projectName}</span>
            </div>
            {task.dueDate && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  <Calendar size={13} /> Due Date
                </div>
                <span className="text-sm text-slate-800 dark:text-slate-200">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Status</div>
            <div className="flex items-center gap-2">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex-1 px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400 transition-colors">
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button onClick={handleSave} disabled={saving || status === task.status} className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Global Search Component ───────────────────────────────────────────
const GlobalSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bumpTaskRefresh } = useProjects();
  const [query, setQuery] = useState("");
  const [allIssues, setAllIssues] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load all issues once
  useEffect(() => {
    if (!user || loaded) return;
    const load = async () => {
      try {
        const res = await getAllIssuesApi();
        setAllIssues(res.data.data || []);
        setLoaded(true);
      } catch {
        setAllIssues([]);
        setLoaded(true);
      }
    };
    load();
  }, [user, loaded]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const filteredIssues = !trimmed
    ? []
    : allIssues.filter((task) => {
        const titleMatch = task.title?.toLowerCase().includes(trimmed);
        const numberMatch = task.taskNumber?.toString().includes(trimmed);
        const projectMatch = task.projectName?.toLowerCase().includes(trimmed);
        return titleMatch || numberMatch || projectMatch;
      });

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter" && filteredIssues.length > 0) {
      handleSelectTask(filteredIssues[0]);
    }
  };

  return (
    <>
      <div className="relative w-full max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setShowDropdown(true);
          }}
          onFocus={() => { if (query.trim()) setShowDropdown(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search issues..."
          className="w-full pl-9 pr-3 py-1.5 rounded-lg text-sm bg-white dark:bg-black text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400 dark:focus:border-blue-500/50 transition-colors"
        />

        {/* Search results dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {filteredIssues.length === 0 && trimmed ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 p-4 text-center">
                No issues found for "{trimmed}".
              </p>
            ) : (
              filteredIssues.map((task) => {
                const lineColor = STATUS_LINE_COLORS[task.status] || "bg-slate-400";
                return (
                  <button
                    key={task._id}
                    onClick={() => handleSelectTask(task)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-white/5 last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors text-left"
                  >
                    <div className={`w-[3px] h-8 shrink-0 rounded-r ${lineColor}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {getProjectInitials(task.projectName)}-{task.taskNumber} · {task.projectName}
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
                      {task.priority}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedTask && (
        <SearchIssueDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={() => bumpTaskRefresh()}
        />
      )}
    </>
  );
};

export default GlobalSearch;