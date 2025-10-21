"use client";

import { useEffect, useState } from "react";

export default function ClientHeader({ studentId }: { studentId: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const next = saved === "dark";
      setIsDark(next);
      document.documentElement.dataset.theme = next ? "dark" : "light";
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const theme = next ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  };

  return (
    <div className="flex items-center gap-3">
      <div className="font-mono text-sm">Student#: {studentId}</div>

      <button
        className="burger p-2 border rounded"
        aria-label="Menu"
        onClick={() => alert("Menu placeholder")}
      >
        ≡
      </button>

      <div className="toggle-wrap flex items-center gap-2">
        <label className="switch">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
          />
          <span className="slider" />
        </label>
        <span className="toggle-label">Dark Mode</span>
      </div>
    </div>
  );
}
