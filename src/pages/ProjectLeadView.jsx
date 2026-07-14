import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import UserPickerModal from "../components/UserPickerModal";

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

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const getProjectInitials = (name = "") => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }
  return words[0]?.slice(0, 2).toUpperCase() || "";
};

// Full lead view: all members, all tasks grouped by member, assign/reassign,
// add/remove members. Props are provided by ProjectDetailPage, which owns
// all the data-fetching + API calls — this component is purely presentational.
const ProjectLeadView = ({
  members,
  tasks,
  onAddMember,
  onRemoveMember,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  const memberUserIds = members.map((m) => m.userId._id);

  const tasksByMember = members.map((member) => ({
    member,
    tasks: tasks.filter((t) => t.assignedTo?._id === member.userId._id),
  }));

  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo) return;
    onCreateTask(newTask);
    setNewTask({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" });
    setShowNewTaskForm(false);
  };

  return (
    <div>
      {/* Members section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
            Team Members ({members.length})
          </h2>
          <button
            onClick={() => setShowMemberPicker(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Plus size={14} /> Add Member
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <div
              key={m._id}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-semibold">
                {getInitials(m.userId.name)}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {m.userId.name}
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  m.role === "lead"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
                    : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                {m.role}
              </span>
              {m.role !== "lead" && (
                <button
                  onClick={() => onRemoveMember(m.userId._id)}
                  className="w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  aria-label={`Remove ${m.userId.name}`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
          Tasks
        </h2>
        <button
          onClick={() => setShowNewTaskForm((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={14} /> New Task
        </button>
      </div>

      {/* New task inline form */}
      {showNewTaskForm && (
        <form
          onSubmit={handleCreateTaskSubmit}
          className="mb-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
          className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
          />
          <textarea
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
            rows={2}
          className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400 resize-none"
          />
          <div className="grid grid-cols-3 gap-3">
            <select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask((p) => ({ ...p, assignedTo: e.target.value }))}
              className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10"
            >
              <option value="">Assign to…</option>
              {members.map((m) => (
                <option key={m.userId._id} value={m.userId._id}>
                  {m.userId.name}
                </option>
              ))}
            </select>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
              className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask((p) => ({ ...p, dueDate: e.target.value }))}
              className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewTaskForm(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      )}

      {/* Tasks grouped by member */}
      <div className="flex flex-col gap-6">
        {tasksByMember.map(({ member, tasks: memberTasks }) => (
          <div key={member._id}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-semibold">
                {getInitials(member.userId.name)}
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {member.userId.name}
              </p>
              <span className="text-xs text-slate-400">({memberTasks.length})</span>
            </div>

            <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
              {memberTasks.length === 0 ? (
                <p className="text-sm text-slate-400 p-4 text-center">No tasks assigned.</p>
              ) : (
                memberTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex items-center gap-3 pl-0 pr-4 py-2 border-b border-slate-100 dark:border-white/5 last:border-b-0`}
                  >
                    {/* Straight status color line with left margin */}
                    <div className={`ml-3 w-1 self-stretch shrink-0 ${STATUS_LINE[task.status]}`} />

                    <p className="flex-1 min-w-0 text-sm font-medium text-slate-900 dark:text-white truncate">
                      {task.title}
                    </p>

                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-md shrink-0 ${PRIORITY_STYLES[task.priority]}`}
                    >
                      {task.priority}
                    </span>

                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTask(task._id, { status: e.target.value })}
                      className="text-xs px-2 py-1.5 rounded-lg bg-white dark:bg-black text-slate-700 dark:text-slate-300 outline-none border border-slate-200 dark:border-white/10 shrink-0"
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>

                    <select
                      value={task.assignedTo?._id}
                      onChange={(e) => onUpdateTask(task._id, { assignedTo: e.target.value })}
                      className="text-xs px-2 py-1.5 rounded-lg bg-white dark:bg-black text-slate-700 dark:text-slate-300 outline-none border border-slate-200 dark:border-white/10 shrink-0"
                    >
                      {members.map((m) => (
                        <option key={m.userId._id} value={m.userId._id}>
                          {m.userId.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => onDeleteTask(task._id)}
                      className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      aria-label="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {showMemberPicker && (
        <UserPickerModal
          title="Add a team member"
          excludeIds={memberUserIds}
          onClose={() => setShowMemberPicker(false)}
          onSelect={(user) => {
            onAddMember(user._id);
            setShowMemberPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectLeadView;