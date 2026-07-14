import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { getCompanyUsersApi } from "../api/company.api";

// A simple modal for picking a user from the company (used for adding project
// members, or assigning a task). excludeIds lets the caller hide users who
// are already members/assignees where that doesn't make sense.
const UserPickerModal = ({ title, excludeIds = [], onSelect, onClose }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getCompanyUsersApi();
        setUsers(res.data.data);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users
    .filter((u) => !excludeIds.includes(u._id))
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400 transition-colors"
            />
          </div>

          <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
            {loading ? (
              <p className="text-sm text-slate-400 text-center py-4">Loading…</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No users found.</p>
            ) : (
              filteredUsers.map((u) => (
                <button
                  key={u._id}
                  onClick={() => onSelect(u)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                    {getInitials(u.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPickerModal;