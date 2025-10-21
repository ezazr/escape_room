import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ClientHeader from "./components/ClientHeader";
import ThemeBoot from './components/ThemeBoot';
export const metadata: Metadata = {
  title: "LTU A2",
  description: "Assignment 2",
};

const TODAY = new Date().toISOString().slice(0, 10);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const studentId = "22016197";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
              var t = localStorage.getItem('theme') || 'light';
              document.documentElement.dataset.theme = t;
            } catch (e) {}`}
        </Script>
      </head>
      <body>
        <header className="topbar">
          <div className="brand">
            <span className="title">Title</span>
            <span className="student">Student No.</span>
          </div>

          <nav className="tabs" aria-label="Primary">
            <Link href="/">Tabs</Link>
            <Link href="/prelab">Pre-lab Questions</Link>
            <Link href="/escape">Escape Room</Link>
            <Link href="/coding-races">Coding Races</Link>
            <Link href="/about">About</Link>
          </nav>

          <ClientHeader studentId={studentId} />
        </header>

        <main className="container">{children}</main>

        <footer className="footer">
          Copyright Your Name, Student No, {TODAY}
        </footer>
      </body>
    </html>
  );
}
