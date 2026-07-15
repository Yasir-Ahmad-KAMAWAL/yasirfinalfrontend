import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import GlobalSearch from "../components/GlobalSearch";
import { ToastProvider } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <ToastProvider>
    <div className="flex min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between gap-4 px-6 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black">
          <GlobalSearch />

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={17} />
            </button>
            {user && (
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                {getInitials(user.name)}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 min-w-0 p-6">
          <Outlet />
        </main>
      </div>
    </div>
    </ToastProvider>
  );
};

export default MainLayout;
