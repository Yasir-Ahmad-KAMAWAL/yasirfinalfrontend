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

// Member view: only sees tasks assigned to them on this project. No visibility
// into other members' tasks or the full roster — matches the backend's
// role-based filtering exactly (the API only ever returns their own tasks).
const ProjectMemberView = ({ tasks, onUpdateTask }) => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">
        My Tasks ({tasks.length})
      </h2>

      <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400 p-6 text-center">
            No tasks assigned to you yet.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-center pl-0 pr-5 py-0.5 border-b border-slate-100 dark:border-white/5 last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer`}
            >
              {/* Straight status color line — centered with extra left margin */}
              <div className={`ml-5 w-[3px] h-7 self-center shrink-0 rounded-r ${STATUS_LINE[task.status]}`} />
              <div className="flex-1 min-w-0 ml-3">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {task.description}
                  </p>
                )}
              </div>

              {task.dueDate && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 w-[100px] text-center shrink-0 hidden md:block">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}

              <span
                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md w-[60px] text-center shrink-0 ${PRIORITY_STYLES[task.priority]}`}
              >
                {task.priority}
              </span>

              <select
                value={task.status}
                onChange={(e) => onUpdateTask(task._id, { status: e.target.value })}
                className="text-[11px] px-1.5 py-0.5 rounded-lg bg-white dark:bg-black text-slate-700 dark:text-slate-300 outline-none border border-slate-200 dark:border-white/10 w-[80px] text-center shrink-0"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectMemberView;