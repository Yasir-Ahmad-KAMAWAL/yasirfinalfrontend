import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section
      id="about"
      className="py-24 px-6 md:px-[5%] bg-white dark:bg-black transition-colors duration-300"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-orange-500 dark:text-orange-400 text-[40px] font-semibold uppercase tracking-widest mb-3">
          About
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
          Built for Kabul's IT community
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
          KabulTrack is a modern project management platform designed specifically
          for IT firms in Kabul. It helps teams plan sprints, track issues, assign
          tasks, and ship software with the same clarity and speed as the world's
          best engineering tools — built around how local teams actually work.
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          Whether you're a small startup or a growing development agency,
          KabulTrack gives every team member — from administrators to developers
          and testers — the right view of the work that matters to them.
        </p>
      </div>

      <div className="mt-14 max-w-2xl mx-auto bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Ready to bring order to your projects?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Join Kabul IT teams already using KabulTrack to ship better software, faster.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signup"
            className="px-6 py-3 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200"
          >
            Create free account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-white/30 rounded-xl hover:border-slate-500 dark:hover:border-white/60 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200"
          >
            Log in to workspace
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
