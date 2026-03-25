"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const navGroups = [
  {
    label: "By Season",
    href: "/#by-season",
    items: [
      { title: "Summer Dresses", slug: "summer-wedding-guest-dresses" },
      { title: "Fall Dresses", slug: "fall-wedding-guest-dresses" },
      { title: "Spring Dresses", slug: "spring-wedding-guest-dresses" },
      { title: "Winter Dresses", slug: "winter-wedding-guest-dresses" },
    ],
  },
  {
    label: "By Dress Code",
    href: "/#by-dress-code",
    items: [
      { title: "Black Tie", slug: "black-tie-wedding-guest-dresses" },
      { title: "Formal", slug: "formal-wedding-guest-dresses" },
      { title: "Semi-Formal", slug: "semi-formal-wedding-guest-dresses" },
      { title: "Cocktail", slug: "cocktail-wedding-guest-dresses" },
      { title: "Casual", slug: "casual-wedding-guest-dresses" },
      { title: "Best Picks", slug: "best-wedding-guest-dresses" },
      { title: "Best Formal", slug: "best-formal-wedding-guest-dresses" },
      { title: "Elegant", slug: "elegant-wedding-guest-dresses" },
    ],
  },
  {
    label: "By Color",
    href: "/#by-color",
    items: [
      { title: "Black", slug: "black-wedding-guest-dresses" },
      { title: "Blue", slug: "blue-wedding-guest-dresses" },
      { title: "Navy", slug: "navy-wedding-guest-dresses" },
      { title: "Green", slug: "green-wedding-guest-dresses" },
      { title: "Pink", slug: "pink-wedding-guest-dresses" },
      { title: "Burgundy", slug: "burgundy-wedding-guest-dresses" },
      { title: "Yellow", slug: "yellow-wedding-guest-dresses" },
      { title: "Brown", slug: "brown-wedding-guest-dresses" },
    ],
  },
  {
    label: "By Body Type",
    href: "/#by-body-type",
    items: [
      { title: "Plus Size", slug: "plus-size-wedding-guest-dresses" },
      { title: "Petite", slug: "petite-wedding-guest-dresses" },
      { title: "Maternity", slug: "maternity-wedding-guest-dresses" },
    ],
  },
  {
    label: "By Style",
    href: "/#by-style",
    items: [
      { title: "Maxi", slug: "maxi-wedding-guest-dresses" },
      { title: "Midi", slug: "midi-wedding-guest-dresses" },
      { title: "Long", slug: "long-wedding-guest-dresses" },
      { title: "Floral", slug: "floral-wedding-guest-dresses" },
      { title: "Modest", slug: "modest-wedding-guest-dresses" },
      { title: "Long Sleeve", slug: "long-sleeve-wedding-guest-dresses" },
    ],
  },
  {
    label: "By Venue",
    href: "/#by-venue",
    items: [
      { title: "Beach", slug: "beach-wedding-guest-dresses" },
      { title: "Garden Party", slug: "garden-party-wedding-guest-dresses" },
      { title: "Indian Wedding", slug: "indian-wedding-guest-dresses" },
    ],
  },
];

function DesktopDropdown({
  group,
}: {
  group: (typeof navGroups)[0];
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
        className="flex items-center gap-1 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
      >
        {group.label}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      {open && (
        <div className="absolute top-full left-0 pt-1 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[200px]">
            {group.items.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setExpandedGroup(null);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              <span className="text-gray-900">Wedding Guest</span>{" "}
              <span className="text-rose-600">Style</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {navGroups.map((group) => (
              <DesktopDropdown key={group.label} group={group} />
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        className="block py-2 text-sm text-gray-600 hover:text-rose-600"
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
