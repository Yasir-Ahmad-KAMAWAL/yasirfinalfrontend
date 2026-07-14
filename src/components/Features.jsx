import React from "react";

const features = [
  {
    title: "Project Tracking",
    desc: "Track projects in real time with status updates, deadlines, and progress overview.",
    icon: "📊",
  },
  {
    title: "Task Management",
    desc: "Create, assign, and manage tasks efficiently with priorities and deadlines.",
    icon: "✅",
  },
  {
    title: "Team Collaboration",
    desc: "Work together with your team using shared boards, comments, and updates.",
    icon: "👥",
  },
  {
    title: "Analytics Dashboard",
    desc: "Get insights into performance, productivity, and project health.",
    icon: "📈",
  },
  {
    title: "Reporting Tools",
    desc: "Generate detailed reports for projects, tasks, and team progress.",
    icon: "📄",
  },
  {
    title: "Role-Based Access",
    desc: "Admin, Project Manager, Developer, and Tester — each with the right permissions.",
    icon: "🔐",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 px-6 md:px-[5%] bg-slate-50 dark:bg-black transition-colors duration-300"
    >
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-orange-500 dark:text-orange-400 text-[40px] font-semibold uppercase tracking-widest mb-3">
          Features
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Everything your team needs
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          From small startups to large Kabul IT firms, KabulTrack scales with your team and your workflow.
        </p>
      </div>

      <div className="mt-14 max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-blue-400 dark:hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center text-xl mb-4">
              {item.icon}
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
              {item.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
