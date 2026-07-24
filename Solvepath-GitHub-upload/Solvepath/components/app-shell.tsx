"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLearning } from "@/components/learning-provider";

const navigation = [
  { href: "/app", label: "Home", mark: "H" },
  { href: "/solve", label: "Homework help", mark: "Q" },
  { href: "/practice", label: "Practice", mark: "P" },
  { href: "/mistakes", label: "Mistake book", mark: "M" },
  { href: "/progress", label: "Progress", mark: "R" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useLearning();
  const isDeveloper = pathname.startsWith("/developer");

  if (isDeveloper) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/app" aria-label="SolvePath home">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span>
            <strong>SolvePath</strong>
            <small>Australia</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <Link
                className={active ? "nav-link nav-link-active" : "nav-link"}
                href={item.href}
                key={item.href}
              >
                <span className="nav-mark" aria-hidden="true">
                  {item.mark}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span className="profile-avatar" aria-hidden="true">
            {state.profile.firstName.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{state.profile.firstName}</strong>
            <small>{state.profile.yearLevel}</small>
          </span>
        </div>
      </aside>

      <div className="app-main">
        <header className="mobile-header">
          <Link className="brand" href="/app">
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <strong>SolvePath</strong>
          </Link>
          <Link className="button button-primary button-small" href="/solve">
            Add question
          </Link>
        </header>
        <main className="page-container">{children}</main>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <Link
                className={active ? "mobile-link mobile-link-active" : "mobile-link"}
                href={item.href}
                key={item.href}
              >
                <span aria-hidden="true">{item.mark}</span>
                <small>{item.label.replace("Homework help", "Help")}</small>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
