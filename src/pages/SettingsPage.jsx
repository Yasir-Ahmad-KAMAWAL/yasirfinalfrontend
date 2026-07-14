import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyCompanyApi, getCompanyUsersApi } from "../api/company.api";

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [company, setCompany] = useState(null);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [companyRes, usersRes] = await Promise.all([
          getMyCompanyApi(),
          getCompanyUsersApi(),
        ]);
        setCompany(companyRes.data.data);
        setCompanyUsers(usersRes.data.data);
      } catch (err) {
        // fine to fail silently here — page still renders account info
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const isOwner = company?.owner === user?._id;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your account and company
        </p>
      </div>

      <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-5 mb-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Account</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          Log out
        </button>
      </div>

      {!loading && company && (
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-5 mb-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            {company.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {isOwner ? "You are the owner of this company" : "Company workspace"}
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Company Invite Code
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 truncate">
                {company._id}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(company._id);
                  alert("Copied! Share this with a teammate — they'll paste it into the Signup page.");
                }}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors shrink-0"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              Share this code with teammates — they'll use it on the Signup page to join your company.
            </p>
          </div>
        </div>
      )}

      {!loading && companyUsers.length > 0 && (
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            Company Members ({companyUsers.length})
          </h3>
          <div className="flex flex-col gap-3">
            {companyUsers.map((u) => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {getInitials(u.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {u.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;