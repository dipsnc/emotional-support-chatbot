import React, { useState, useEffect } from "react";
import { ROTATING_AFFIRMATIONS } from "../../services/mindEaseService";

const Header = ({ tone, setTone }) => {
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAffirmationIndex((prev) => (prev + 1) % ROTATING_AFFIRMATIONS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-surface/80 backdrop-blur-xl border-b border-border py-4 sticky top-0 z-10 shadow-sm transition-all duration-300">
      <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-primary to-indigo-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform duration-300">
            ME
          </div>
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-text tracking-tight leading-none">
              MindEase
            </h1>
            <div className="h-5 overflow-hidden mt-1">
              <p className="text-sm text-muted animate-fade-in transition-opacity duration-500 font-medium">
                {ROTATING_AFFIRMATIONS[affirmationIndex]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-100 rounded-2xl p-1 border border-slate-200 shadow-inner">
          {["gentle", "balanced", "direct"].map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                tone === t
                  ? "bg-white shadow-md text-primary scale-100"
                  : "text-muted hover:text-text hover:bg-white/50"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
