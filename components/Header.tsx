"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import type { NavGroup } from "@/lib/taxonomy";

function DesktopDropdown({
  group,
  alignRight = false,
}: {
  group: NavGroup;
  alignRight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const enter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };
  const leave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href={group.href}
        className="flex items-center gap-1.5 py-2 text-[11px] font-medium text-ink-700 hover:text-blush-600 transition-colors uppercase tracking-[0.18em]"
      >
        {group.label}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      {open && (
        <div className={`absolute top-full pt-1 z-50 ${alignRight ? "right-0" : "left-0"}`}>
          {/* Two columns get a fixed width and wrap long titles; nowrap here made the
              columns run into each other. */}
          <div className={`bg-ivory border border-ink-200 py-3 shadow-[0_8px_32px_rgba(26,24,21,0.08)] ${group.items.length > 8 ? "w-[34rem]" : "w-[17rem]"}`}>
            <div className={group.items.length > 8 ? "grid grid-cols-2 gap-x-2" : ""}>
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="block px-5 py-2 text-sm leading-snug text-ink-700 hover:bg-cream-100 hover:text-blush-700 transition-colors font-light"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <Link
              href={group.href}
              className="block px-5 pt-3 mt-2 border-t border-ink-200 text-[11px] uppercase tracking-[0.18em] text-blush-600 hover:text-blush-700"
              onClick={() => setOpen(false)}
            >
              See all {group.label.toLowerCase()} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header({ navGroups }: { navGroups: NavGroup[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setExpandedGroup(null);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center shrink-0 group">
            <span className="font-serif text-2xl sm:text-3xl text-ink-900 tracking-tight">
              Wedding Guest <span className="font-serif-italic italic text-blush-600">Style</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navGroups.map((group, i) => (
              <DesktopDropdown key={group.label} group={group} alignRight={i >= navGroups.length - 2} />
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -mr-2 text-ink-700 hover:text-ink-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navGroups.map((group) => (
              <div key={group.label}>
                <button
                  className="flex items-center justify-between w-full py-2.5 text-sm font-semibold text-gray-800"
                  onClick={() =>
                    setExpandedGroup(expandedGroup === group.label ? null : group.label)
                  }
                >
                  {group.label}
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedGroup === group.label ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedGroup === group.label && (
                  <div className="pl-4 pb-2 space-y-0.5">
                    <Link
                      href={group.href}
                      className="block py-2 text-sm font-medium text-blush-600"
                      onClick={() => setMobileOpen(false)}
                    >
                      All {group.label.toLowerCase()} →
                    </Link>
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        className="block py-2 text-sm text-gray-600 hover:text-blush-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
