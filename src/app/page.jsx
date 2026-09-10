import React from "react";
import Link from "next/link";
const company = {
  name: "Theory Computers",
  shortName: "Theory Computers",

  system: { name: "K-Chord POS" },

  // K-Chord POS branding
  poweredBy: "K-Chord POS",
  developer: "K-Chord",

  contact: {
    phone: "",
    email: "",
    address: "",
  },

  branding: {
    primary: "#0B1738",
    accent: "#1521A8",
  },
};

const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Navigation */}
      <nav className="w-full border-b border-slate-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          {/* K-Chord Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1738] text-xs font-bold text-white">
              KC
            </div>

            <div className="leading-none">
              <p className="text-sm font-bold tracking-tight text-[#0B1738]">
                K-Chord
              </p>
              <p className="mt-1 text-[9px] font-medium uppercase tracking-widest text-slate-400">
                POS
              </p>
            </div>
          </div>

          {/* Client */}
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Business
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {company.name}
            </p>
          </div>
        </div>
      </nav>

      {/* Main */}
      <section className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-xl text-center">
          {/* Brand mark */}

          {/* Heading */}
          <p className=" font-black uppercase tracking-[0.2em] text-blue-600 text-lg">
            {company.system.name}
          </p>

          <h1 className="mt-3 text-4xl tracking-wide text-gray-600 sm:text-5xl uppercase">
            Welcome to {company.name}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
            Your business management system for sales, inventory, customers and
            everyday operations.
          </p>

          {/* Main Actions */}
          <div className="mx-auto mt-6 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
            {/* POS */}
            <Link
              href="/pos"
              className="group flex min-h-28 flex-col items-center justify-center rounded-2xl bg-blue-600 px-5 py-6 text-white shadow-lg shadow-slate-200
               transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl "
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">▣</span>

                <span className="text-base font-bold">POS</span>

                <span className="text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              <span className="mt-1 text-xs text-slate-300">
                Open point of sale
              </span>
            </Link>

            {/* Admin */}
            <Link
              href="/admin"
              className="group flex min-h-28 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-6 text-slate-800 shadow-sm 
              transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md "
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙</span>

                <span className="text-base font-bold">Administration</span>

                <span className="text-lg text-slate-400 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              <span className="mt-1 text-xs text-slate-400">
                Manage your business
              </span>
            </Link>
          </div>

          {/* Small status */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            System ready
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-5 py-6 sm:flex-row sm:px-8">
          <p className="text-center text-[14px] text-slate-400">
            © {new Date().getFullYear()} K-Chord · Business Management Solutions
          </p>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
