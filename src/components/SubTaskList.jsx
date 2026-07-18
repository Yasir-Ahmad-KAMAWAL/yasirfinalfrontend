import { useState, useEffect } from "react";
import { Plus, ChevronDown, ChevronRight, ListTree } from "lucide-react";
import { getSubTasksApi, createSubTaskApi } from "../api/task.api";
import UserPickerModal from "./UserPickerModal";

const PRIORITY_STYLES = {
  high: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
};

const STATUS_LINE = {
  todo: "bg-orange-500",
  "in-progress": "bg-blue-500",
  done: "bg-green-500",
};

const SubTaskList = ({ projectId, taskId, isLead, members, onUpdateTask, onSubTaskChange }) => {
  const [subTasks, setSubTasks] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewSubTask, setShowNewSubTask] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const [newSubTask, setNewSubTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
  });

  const loadSubTasks = async () => {
    if (!expanded) return;
    setLoading(true);
    try {
      const res = await getSubTasksApi(projectId, taskId);
      setSubTasks(res.data.data);
    } catch {
      setSubTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      loadSubTasks();
    }
  }, [expanded, taskId]);

  const handleCreateSubTask = async () => {
    if (!newSubTask.title || !newSubTask.assignedTo) return;
    try {
      await createSubTaskApi(projectId, taskId, newSubTask);
      setNewSubTask({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: getTodayStr() });
      setShowNewSubTask(false);
      await loadSubTasks();
      if (onSubTaskChange) onSubTaskChange();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create sub-task.");
    }
  };

  const handleStatusChange = async (subTaskId, status) => {
    try {
      await onUpdateTask(subTaskId, { status });
      setSubTasks((prev) => prev.map((t) => (t._id === subTaskId ? { ...t, status } : t)));
    } catch {
      // Error handled by parent
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  // Not expanded — show a prominent button with sub-issue count
  if (!expanded) {
    return (
      <div className="flex items-center gap-2 mt-1.5 mb-1">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2.5 py-1 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
        >
          <ListTree size={13} />
          Sub-issues
          {subTasks.length > 0 && (
            <span className="ml-1 text-[10px] font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
              {subTasks.length}
            </span>
          )}
        </button>

        {isLead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
              setTimeout(() => setShowNewSubTask(true), 100);
            }}
            className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2.5 py-1 rounded-lg transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
          >
            <Plus size={12} /> Add Sub-issue
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="ml-2 mt-2 mb-2 border-l-2 border-blue-200 dark:border-blue-800 pl-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setExpanded(false)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronDown size={14} />
          <ListTree size={13} />
          Sub-issues ({subTasks.length})
        </button>

        {isLead && (
          <button
            onClick={() => setShowNewSubTask((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Plus size={12} /> Add Sub-issue
          </button>
        )}
      </div>

      {/* New sub-task form */}
      {showNewSubTask && (
        <div className="mb-3 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
          <input
            type="text"
            placeholder="Sub-issue title *"
            value={newSubTask.title}
            onChange={(e) => setNewSubTask((p) => ({ ...p, title: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newSubTask.description}
            onChange={(e) => setNewSubTask((p) => ({ ...p, description: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-black text-slate-600 dark:text-slate-300 outline-none border border-slate-200 dark:border-white/10 text-left truncate hover:border-blue-400"
            >
              {newSubTask.assignedTo
                ? members.find((m) => m.userId?._id === newSubTask.assignedTo)?.userId?.name || "Assigned"
                : "Assign to *"}
            </button>
            <select
              value={newSubTask.priority}
              onChange={(e) => setNewSubTask((p) => ({ ...p, priority: e.target.value }))}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-black text-slate-600 dark:text-slate-300 outline-none border border-slate-200 dark:border-white/10"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => { setShowNewSubTask(false); setNewSubTask({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: getTodayStr() }); }}
              className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateSubTask}
              disabled={!newSubTask.title || !newSubTask.assignedTo}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
            >
              Create Sub-issue
            </button>
          </div>
        </div>
      )}

      {/* Sub-tasks list */}
      {loading ? (
        <p className="text-xs text-slate-400 py-2">Loading sub-issues…</p>
      ) : subTasks.length === 0 ? (
        <div className="text-xs text-slate-400 py-3 text-center italic border border-dashed border-slate-300 dark:border-white/10 rounded-lg">
          No sub-issues yet. {isLead ? "Click 'Add Sub-issue' above to create one." : ""}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {subTasks.map((subTask) => (
            <div
              key={subTask._id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              {/* Status indicator */}
              <div className={`w-[3px] h-7 shrink-0 rounded-r ${STATUS_LINE[subTask.status]}`} />

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  #{subTask.taskNumber} {subTask.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {subTask.assignedTo && (
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[6px] font-semibold shrink-0">
                        {getInitials(subTask.assignedTo.name)}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate max-w-[100px]">{subTask.assignedTo.name}</span>
                    </div>
                  )}
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${PRIORITY_STYLES[subTask.priority] || ""}`}>
                    {subTask.priority}
                  </span>
                </div>
              </div>

              <select
                value={subTask.status}
                onChange={(e) => handleStatusChange(subTask._id, e.target.value)}
                className="text-[10px] px-1.5 py-1 rounded-lg bg-white dark:bg-black text-slate-600 dark:text-slate-300 outline-none border border-slate-200 dark:border-white/10 shrink-0"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {showPicker && (
        <UserPickerModal
          title="Assign sub-issue to"
          excludeIds={[]}
          onClose={() => setShowPicker(false)}
          onSelect={(user) => {
            setNewSubTask((p) => ({ ...p, assignedTo: user._id }));
            setShowPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default SubTaskList;