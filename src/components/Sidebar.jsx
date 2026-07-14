import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ListChecks,
  FolderKanban,
  Kanban,
  BarChart3,
  Settings,
  List,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectsContext";
import { getProjectTasksApi } from "../api/task.api";

const navItems = [
  { label: "My Issues", to: "/dashboard", icon: ListChecks, end: true },
  { label: "All Issues", to: "/dashboard/all-issues", icon: List },
  { label: "Projects", to: "/dashboard/projects", icon: FolderKanban },
  { label: "Board", to: "/dashboard/board", icon: Kanban },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

const navLinkClasses = ({ isActive }) =>
  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
    isActive
      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
  }`;

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// Dot color reflects the project's overall progress:
// orange = all open, blue = work in progress, green = fully complete.
const getStatusDotColor = (stats) => {
  if (!stats || stats.total === 0) return "bg-orange-500";
  if (stats.done === stats.total) return "bg-green-500";
  if (stats.inProgress > 0) return "bg-blue-500";
  return "bg-orange-500";
};

const Sidebar = () => {
  const { user } = useAuth();
  const { projects, taskRefreshVersion } = useProjects();
  const [taskStats, setTaskStats] = useState({});
  const navigate = useNavigate();

  const isCompanyAdmin = user?.isCompanyAdmin;
  const isPrivileged = user?.isCompanyAdmin || user?.isProjectLead;

  useEffect(() => {
    const loadStats = async () => {
      const stats = {};
      await Promise.all(
        projects.map(async (project) => {
          try {
            const res = await getProjectTasksApi(project._id);
            const tasks = res.data.data;
            stats[project._id] = {
              total: tasks.length,
              todo: tasks.filter((t) => t.status === "todo").length,
              inProgress: tasks.filter((t) => t.status === "in-progress").length,
              done: tasks.filter((t) => t.status === "done").length,
            };
          } catch {
            stats[project._id] = { total: 0, todo: 0, inProgress: 0, done: 0 };
          }
        })
      );
      setTaskStats(stats);
    };

    if (projects.length > 0) {
      loadStats();
    }
  }, [projects, taskRefreshVersion]);

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-white dark:bg-black border-r border-slate-200 dark:border-white/10 relative overflow-hidden">
      {/* Background pattern layer - visible in both themes */}
      <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden="true">
        {/* Light mode background pattern */}
        <div className="absolute inset-0 light-only" style={{
          backgroundImage: `
            /* Grid lines */
            linear-gradient(90deg, rgba(29,78,216,0.06) 1px, transparent 1px),
            linear-gradient(0deg, rgba(29,78,216,0.06) 1px, transparent 1px),
            /* Kanban board icon (top left) */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 70 30'%3E%3Crect x='0' y='0' width='18' height='24' rx='2' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Crect x='26' y='0' width='18' height='24' rx='2' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Crect x='52' y='0' width='18' height='24' rx='2' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='4' y1='6' x2='14' y2='6' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Cline x1='4' y1='10' x2='14' y2='10' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Cline x1='30' y1='6' x2='40' y2='6' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Cline x1='30' y1='10' x2='40' y2='10' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Cline x1='56' y1='6' x2='66' y2='6' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Cline x1='56' y1='10' x2='66' y2='10' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Ccircle cx='9' cy='20' r='1.5' fill='%23F97316' opacity='0.5'/%3E%3Ccircle cx='35' cy='20' r='1.5' fill='%23F97316' opacity='0.5'/%3E%3Ccircle cx='61' cy='20' r='1.5' fill='%23F97316' opacity='0.5'/%3E%3C/svg%3E"),
            /* Bar chart icon (top right) */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Crect x='0' y='0' width='26' height='26' rx='3' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Crect x='4' y='14' width='5' height='10' rx='0.5' fill='%231D4ED8' opacity='0.15'/%3E%3Crect x='11' y='10' width='5' height='14' rx='0.5' fill='%231D4ED8' opacity='0.15'/%3E%3Crect x='18' y='6' width='5' height='18' rx='0.5' fill='%23F97316' opacity='0.2'/%3E%3C/svg%3E"),
            /* Folder icon (mid left) */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 26'%3E%3Cpath d='M0 6 L6 6 L9 3 L16 3 L16 6' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Crect x='0' y='6' width='26' height='18' rx='2' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Ccircle cx='7' cy='15' r='1.5' fill='%23F97316' opacity='0.5'/%3E%3Ccircle cx='13' cy='15' r='1.5' fill='%23F97316' opacity='0.5'/%3E%3Ccircle cx='19' cy='15' r='1.5' fill='%23F97316' opacity='0.5'/%3E%3C/svg%3E"),
            /* People icon (center) */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Ccircle cx='8' cy='5' r='4' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Cpath d='M2 16 C2 11 5 9 8 9 C11 9 14 11 14 16' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Ccircle cx='26' cy='5' r='4' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Cpath d='M20 16 C20 11 23 9 26 9 C29 9 32 11 32 16' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3C/svg%3E"),
            /* Calendar icon (right) */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Crect x='0' y='3' width='26' height='24' rx='3' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='0' y1='10' x2='26' y2='10' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Cline x1='6' y1='0' x2='6' y2='6' stroke='%231D4ED8' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='20' y1='0' x2='20' y2='6' stroke='%231D4ED8' stroke-width='0.5' opacity='0.4'/%3E%3Ccircle cx='8' cy='16' r='1.5' fill='%23F97316' opacity='0.5'/%3E%3Ccircle cx='15' cy='16' r='1.5' fill='%23F97316' opacity='0.4'/%3E%3Ccircle cx='15' cy='22' r='1.5' fill='%23F97316' opacity='0.4'/%3E%3C/svg%3E"),
            /* Gantt/timeline icon (bottom) */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cline x1='2' y1='4' x2='26' y2='4' stroke='%231D4ED8' stroke-width='0.5' opacity='0.3'/%3E%3Cline x1='2' y1='11' x2='26' y2='11' stroke='%231D4ED8' stroke-width='0.5' opacity='0.3'/%3E%3Cline x1='2' y1='18' x2='26' y2='18' stroke='%231D4ED8' stroke-width='0.5' opacity='0.3'/%3E%3Cline x1='2' y1='25' x2='26' y2='25' stroke='%231D4ED8' stroke-width='0.5' opacity='0.3'/%3E%3Crect x='5' y='2' width='8' height='4' rx='1' fill='%231D4ED8' opacity='0.12'/%3E%3Crect x='7' y='9' width='12' height='4' rx='1' fill='%23F97316' opacity='0.15'/%3E%3Crect x='4' y='16' width='16' height='4' rx='1' fill='%231D4ED8' opacity='0.12'/%3E%3Crect x='12' y='23' width='10' height='4' rx='1' fill='%2322C55E' opacity='0.12'/%3E%3C/svg%3E"),
            /* Pie chart icon */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='12' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='14' y1='14' x2='14' y2='2' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Cline x1='14' y1='14' x2='25' y2='14' stroke='%231D4ED8' stroke-width='0.4' opacity='0.3'/%3E%3Cpath d='M14 14 L14 2 A12 12 0 0 1 25 14 Z' fill='%23F97316' opacity='0.12'/%3E%3C/svg%3E"),
            /* Gear icon */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Ccircle cx='13' cy='13' r='5' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Cpath d='M13 3 L13 7 M13 19 L13 23 M3 13 L7 13 M19 13 L23 13 M6 6 L9 9 M17 17 L20 20 M20 6 L17 9 M9 17 L6 20' stroke='%231D4ED8' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E"),
            /* Bell/notification icon */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 24'%3E%3Cpath d='M6 14 C6 9 8 5 14 5 C20 5 22 9 22 14 L22 17 L25 21 L3 21 L6 17 Z' fill='none' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='11' y1='22' x2='17' y2='22' stroke='%231D4ED8' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E"),
            /* Milestone/flag icon */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 28'%3E%3Cline x1='5' y1='0' x2='5' y2='26' stroke='%231D4ED8' stroke-width='0.6' opacity='0.4'/%3E%3Cpolyline points='5,3 22,7 5,13' fill='%23F97316' opacity='0.1' stroke='%23F97316' stroke-width='0.4' opacity='0.4'/%3E%3Ccircle cx='5' cy='24' r='2' fill='%231D4ED8' opacity='0.2'/%3E%3C/svg%3E"),
            /* Priority flag */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Cpolygon points='13,0 24,10 13,20' fill='%23F97316' opacity='0.1' stroke='%23F97316' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='5' y1='0' x2='5' y2='24' stroke='%231D4ED8' stroke-width='0.5' opacity='0.3'/%3E%3Ccircle cx='5' cy='22' r='2' fill='%231D4ED8' opacity='0.2'/%3E%3C/svg%3E")
          `,
          backgroundPosition: `
            0px 0px,
            0px 0px,
            12px 30px,
            176px 100px,
            20px 150px,
            30px 250px,
            180px 320px,
            10px 400px,
            175px 470px,
            15px 540px,
            185px 600px,
            10px 680px,
            175px 740px,
            10px 800px
          `,
          backgroundSize: `
            44px 44px,
            44px 44px,
            70px 30px,
            30px 30px,
            28px 26px,
            34px 22px,
            28px 28px,
            30px 30px,
            28px 28px,
            26px 26px,
            28px 24px,
            24px 28px,
            26px 26px,
            80px 80px
          `,
          backgroundRepeat: `
            repeat,
            repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat
          `
        }} />
        {/* Dark mode background pattern - more visible */}
        <div className="absolute inset-0 dark-only" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(29,78,216,0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(29,78,216,0.1) 1px, transparent 1px),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 70 30'%3E%3Crect x='0' y='0' width='18' height='24' rx='2' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Crect x='26' y='0' width='18' height='24' rx='2' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Crect x='52' y='0' width='18' height='24' rx='2' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Cline x1='4' y1='6' x2='14' y2='6' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='4' y1='10' x2='14' y2='10' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='30' y1='6' x2='40' y2='6' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='30' y1='10' x2='40' y2='10' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='56' y1='6' x2='66' y2='6' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='56' y1='10' x2='66' y2='10' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Ccircle cx='9' cy='20' r='1.5' fill='%23FB923C' opacity='0.6'/%3E%3Ccircle cx='35' cy='20' r='1.5' fill='%23FB923C' opacity='0.6'/%3E%3Ccircle cx='61' cy='20' r='1.5' fill='%23FB923C' opacity='0.6'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Crect x='0' y='0' width='26' height='26' rx='3' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Crect x='4' y='14' width='5' height='10' rx='0.5' fill='%234369FB' opacity='0.2'/%3E%3Crect x='11' y='10' width='5' height='14' rx='0.5' fill='%234369FB' opacity='0.2'/%3E%3Crect x='18' y='6' width='5' height='18' rx='0.5' fill='%23FB923C' opacity='0.25'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 26'%3E%3Cpath d='M0 6 L6 6 L9 3 L16 3 L16 6' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Crect x='0' y='6' width='26' height='18' rx='2' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Ccircle cx='7' cy='15' r='1.5' fill='%23FB923C' opacity='0.6'/%3E%3Ccircle cx='13' cy='15' r='1.5' fill='%23FB923C' opacity='0.6'/%3E%3Ccircle cx='19' cy='15' r='1.5' fill='%23FB923C' opacity='0.6'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Ccircle cx='8' cy='5' r='4' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Cpath d='M2 16 C2 11 5 9 8 9 C11 9 14 11 14 16' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Ccircle cx='26' cy='5' r='4' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Cpath d='M20 16 C20 11 23 9 26 9 C29 9 32 11 32 16' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Crect x='0' y='3' width='26' height='24' rx='3' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Cline x1='0' y1='10' x2='26' y2='10' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='6' y1='0' x2='6' y2='6' stroke='%234369FB' stroke-width='0.6' opacity='0.5'/%3E%3Cline x1='20' y1='0' x2='20' y2='6' stroke='%234369FB' stroke-width='0.6' opacity='0.5'/%3E%3Ccircle cx='8' cy='16' r='1.5' fill='%23FB923C' opacity='0.6'/%3E%3Ccircle cx='15' cy='16' r='1.5' fill='%23FB923C' opacity='0.5'/%3E%3Ccircle cx='15' cy='22' r='1.5' fill='%23FB923C' opacity='0.5'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cline x1='2' y1='4' x2='26' y2='4' stroke='%234369FB' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='2' y1='11' x2='26' y2='11' stroke='%234369FB' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='2' y1='18' x2='26' y2='18' stroke='%234369FB' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='2' y1='25' x2='26' y2='25' stroke='%234369FB' stroke-width='0.6' opacity='0.4'/%3E%3Crect x='5' y='2' width='8' height='4' rx='1' fill='%234369FB' opacity='0.15'/%3E%3Crect x='7' y='9' width='12' height='4' rx='1' fill='%23FB923C' opacity='0.2'/%3E%3Crect x='4' y='16' width='16' height='4' rx='1' fill='%234369FB' opacity='0.15'/%3E%3Crect x='12' y='23' width='10' height='4' rx='1' fill='%2322C55E' opacity='0.15'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='12' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Cline x1='14' y1='14' x2='14' y2='2' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Cline x1='14' y1='14' x2='25' y2='14' stroke='%234369FB' stroke-width='0.5' opacity='0.4'/%3E%3Cpath d='M14 14 L14 2 A12 12 0 0 1 25 14 Z' fill='%23FB923C' opacity='0.15'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Ccircle cx='13' cy='13' r='5' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Cpath d='M13 3 L13 7 M13 19 L13 23 M3 13 L7 13 M19 13 L23 13 M6 6 L9 9 M17 17 L20 20 M20 6 L17 9 M9 17 L6 20' stroke='%234369FB' stroke-width='0.6' opacity='0.4'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 24'%3E%3Cpath d='M6 14 C6 9 8 5 14 5 C20 5 22 9 22 14 L22 17 L25 21 L3 21 L6 17 Z' fill='none' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Cline x1='11' y1='22' x2='17' y2='22' stroke='%234369FB' stroke-width='0.6' opacity='0.4'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 28'%3E%3Cline x1='5' y1='0' x2='5' y2='26' stroke='%234369FB' stroke-width='0.8' opacity='0.5'/%3E%3Cpolyline points='5,3 22,7 5,13' fill='%23FB923C' opacity='0.15' stroke='%23FB923C' stroke-width='0.5' opacity='0.5'/%3E%3Ccircle cx='5' cy='24' r='2' fill='%234369FB' opacity='0.25'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Cpolygon points='13,0 24,10 13,20' fill='%23FB923C' opacity='0.15' stroke='%23FB923C' stroke-width='0.6' opacity='0.5'/%3E%3Cline x1='5' y1='0' x2='5' y2='24' stroke='%234369FB' stroke-width='0.6' opacity='0.4'/%3E%3Ccircle cx='5' cy='22' r='2' fill='%234369FB' opacity='0.25'/%3E%3C/svg%3E")
          `,
          backgroundPosition: `
            0px 0px,
            0px 0px,
            12px 30px,
            176px 100px,
            20px 150px,
            30px 250px,
            180px 320px,
            10px 400px,
            175px 470px,
            15px 540px,
            185px 600px,
            10px 680px,
            175px 740px,
            10px 800px
          `,
          backgroundSize: `
            44px 44px,
            44px 44px,
            70px 30px,
            30px 30px,
            28px 26px,
            34px 22px,
            28px 28px,
            30px 30px,
            28px 28px,
            26px 26px,
            28px 24px,
            24px 28px,
            26px 26px,
            80px 80px
          `,
          backgroundRepeat: `
            repeat,
            repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat,
            no-repeat
          `
        }} />
      </div>
      {/* Radar signal accent - bottom right glow */}
      <div className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none bg-gradient-to-tl from-orange-500/5 via-orange-500/2 to-transparent dark:from-orange-500/8 dark:via-orange-500/3 dark:to-transparent rounded-full" />
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white/30 dark:to-black" />
      {/* Logo + New Project button */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <svg width="150" height="43" viewBox="0 0 270 78" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto">
          <path d="M4 20 L22 39 L4 58" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25"/>
          <path d="M14 20 L32 39 L14 58" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55"/>
          <path d="M24 20 L42 39 L24 58" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <text x="58" y="36" fontFamily="-apple-system,BlinkMacSystemFont,'Inter',sans-serif" fontSize="22" fontWeight="700" fill="#1D4ED8" letterSpacing="-0.4">
            Kabul<tspan fill="#F97316">Track</tspan>
          </text>
          <text x="59" y="53" fontFamily="-apple-system,BlinkMacSystemFont,'Inter',sans-serif" fontSize="9" fill="#9CA3AF" letterSpacing="0.2em">
            FORWARD MOTION
          </text>
        </svg>
        {isCompanyAdmin && (
          <button
            onClick={() => navigate("/dashboard/projects?new=true")}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-100 text-white transition-colors shrink-0"
            title="New Project"
          >
            <Plus className="text-orange-500" size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="px-3 flex flex-col gap-0.5">
        {navItems
          .filter((item) => {
            if (item.label === "All Issues") return isCompanyAdmin || isPrivileged;
            if (item.label === "My Issues") return !isCompanyAdmin;
            return true;
          })
          .map((item) => (
            <NavLink key={item.label} to={item.to} end={item.end} className={navLinkClasses}>
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
      </nav>

      {/* Projects list */}
      <div className="mt-6 px-3 flex-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
          Projects
        </p>
        <div className="flex flex-col gap-0.5">
          {projects.map((project) => (
            <NavLink
              key={project._id}
              to={`/dashboard/projects/${project._id}`}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors duration-150 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-500/10 text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                }`
              }
            >
              <span className="flex items-center gap-2 truncate">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${getStatusDotColor(taskStats[project._id])}`}
                />
                <span className="truncate">{project.name}</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                {taskStats[project._id]?.total ?? 0}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* User card */}
      {user && (
        <div className="px-4 py-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;