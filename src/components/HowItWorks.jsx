import React from "react";

const steps = [
  {
    num: "1",
    title: "Create a project",
    desc: "Set up your IT project, define its goals, and invite your team members.",
  },
  {
    num: "2",
    title: "Log issues",
    desc: "Add bugs, features, and tasks. Assign them, set priority, and link to sprints.",
  },
  {
    num: "3",
    title: "Track & ship",
    desc: "Move cards through your workflow. Deliver faster, communicate better, miss nothing.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 md:px-[5%] bg-white dark:bg-black transition-colors duration-300"
    >
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-orange-500 dark:text-orange-400 text-[40px] font-semibold uppercase tracking-widest mb-3">
          How it works
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Up and running in minutes
        </h2>
      </div>

      <div className="mt-16 max-w-4xl mx-auto relative">
        <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-500/30 to-transparent" />

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.num} className="text-center px-4">
              <div
                className={`relative z-10 w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg font-bold mx-auto mb-5 bg-white dark:bg-black ${
                  index === 2
                    ? "border-orange-500 text-orange-500"
                    : "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                }`}
              >
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
