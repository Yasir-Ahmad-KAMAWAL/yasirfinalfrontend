import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Roles from '../components/Roles'
import About from '../components/About'

const IntroductionPage = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
  {
    title: "Features",
    path: "#features",
    description:
      "Powerful project tracking, task management, team collaboration, analytics, and reporting tools.",
  },
  {
    title: "How it works",
    path: "#how-it-works",
    description:
      "Create projects, assign tasks, monitor progress, and deliver results through a streamlined workflow.",
  },
  {
    title: "Roles",
    path: "#roles",
    description:
      "Separate permissions for Administrators, Project Managers, Team Members, and Clients.",
  },
  {
    title: "About",
    path: "#about",
    description:
      "A modern project management platform built to help organizations plan, collaborate, and succeed.",
  },
];

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col overflow-hidden transition-colors duration-300">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-[5%] h-16 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-slate-200 dark:border-white/10">

        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <svg width="270" height="78" viewBox="0 0 270 78" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[150px] md:w-[190px] h-auto">
            <path d="M4 20 L22 39 L4 58"  stroke="#1D4ED8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.25"/>
            <path d="M14 20 L32 39 L14 58" stroke="#1D4ED8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.55"/>
            <path d="M24 20 L42 39 L24 58" stroke="#F97316" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <text x="58" y="36" font-family="-apple-system,BlinkMacSystemFont,'Inter',sans-serif" font-size="22" font-weight="700" fill="#1D4ED8" letter-spacing="-0.4">Kabul<tspan fill="#F97316">Track</tspan></text>
            <text x="59" y="53" font-family="-apple-system,BlinkMacSystemFont,'Inter',sans-serif" font-size="9" fill="#888" letter-spacing="0.2em">FORWARD MOTION · KT</text>
          </svg>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-5 lg:gap-7 px-4 min-w-0">
          {navItems.map((item) => (
            <div key={item.title} className="relative group shrink-0">
              <a
                href={item.path}
                className="text-sm text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                {item.title}
              </a>

              <div className="absolute left-1/2 top-10 z-50 w-72 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-2xl">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <ThemeToggle />
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-white/30 rounded-lg hover:border-slate-500 dark:hover:border-white/60 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200 whitespace-nowrap"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all duration-200 whitespace-nowrap"
          >
            Sign up free
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
            <button
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10 px-6 py-4 flex flex-col gap-3 md:hidden">
            {navItems.map((item) => (
              <a
                key={item.title}
                href={item.path}
                className="text-sm text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.title}
              </a>
            ))}
            <hr className="border-slate-200 dark:border-white/10" />
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-900 dark:text-white text-center border border-slate-300 dark:border-white/30 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold text-white bg-orange-500 px-4 py-2 rounded-lg text-center hover:bg-orange-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Sign up free
            </Link>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section id="top" className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-[5%] pt-16 overflow-hidden">

        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl py-16">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-500 dark:text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            Built for Kabul IT teams
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-5">
            Manage projects.{' '}
            <span className="text-blue-600 dark:text-blue-500">Track issues.</span>{' '}
            Ship{' '}
            <span className="text-orange-500">faster.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mb-10">
            KabulTrack helps Kabul IT firms plan sprints, log bugs, assign tasks,
            and ship better software — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <Link
              to="/signup"
              className="px-7 py-3.5 text-base font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 hover:-translate-y-0.5"
            >
              Get started for free
            </Link>
            <a
              href="#features"
              className="px-7 py-3.5 text-base font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-white/30 rounded-xl hover:border-slate-500 dark:hover:border-white/60 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200"
            >
              View features →
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">500<span className="text-orange-500">+</span></p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Issues tracked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">12<span className="text-orange-500">+</span></p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Teams onboarded</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">4<span className="text-orange-500">x</span></p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Faster sprints</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTIONS (revealed when nav items are clicked) ─── */}
      <Features />
      <HowItWorks />
      <Roles />
      <About />

      {/* ─── FOOTER ─── */}
      <div className="relative z-10 text-center py-6 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10">
        <p className="text-xs text-slate-400 dark:text-slate-600">
          © 2025 KabulTrack · Built for Kabul IT teams
        </p>
      </div>

    </div>
  )
}

export default IntroductionPage
