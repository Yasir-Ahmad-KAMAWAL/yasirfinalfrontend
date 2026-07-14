import React from "react";

const roles = [
  {
    label: "Admin",
    title: "Administrator",
    desc: "Full system access. Manage users, projects, settings, and permissions.",
    badgeClasses:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  },
  {
    label: "Project Manager",
    title: "Project Manager",
    desc: "Create sprints, assign issues, monitor progress, and generate reports.",
    badgeClasses:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    label: "Developer",
    title: "Developer",
    desc: "View and update assigned issues. Log activity and track your own progress.",
    badgeClasses:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  }
];

const Roles = () => {
  return (
    <section
      id="roles"
      className="py-24 px-6 md:px-[5%] bg-slate-50 dark:bg-black transition-colors duration-300"
    >
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-orange-500 dark:text-orange-400 text-[40px] font-semibold uppercase tracking-widest mb-3">
          User roles
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          The right access for everyone
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          KabulTrack's role system maps directly to how real Kabul IT teams are structured.
        </p>
      </div>

      <div className="mt-14 max-w-5xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role.label}
            className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500/40 transition-all duration-200"
          >
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${role.badgeClasses}`}
            >
              {role.label}
            </span>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
              {role.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {role.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Roles;
