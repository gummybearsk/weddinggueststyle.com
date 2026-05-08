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
      { title: "Casual Fall", slug: "casual-fall-wedding-guest-dresses" },
      { title: "Classy Winter", slug: "classy-winter-wedding-guest-dresses" },
      { title: "Summer 2026", slug: "wedding-guest-dresses-summer-2026" },
    ],
  },
  {
    label: "By Dress Code",
    href: "/#by-dress-code",
    items: [
      { title: "Black Tie", slug: "black-tie-wedding-guest-dresses" },
      { title: "Black Tie Optional", slug: "black-tie-optional-wedding-guest-dresses" },
      { title: "Formal", slug: "formal-wedding-guest-dresses" },
      { title: "Semi-Formal", slug: "semi-formal-wedding-guest-dresses" },
      { title: "Cocktail", slug: "cocktail-wedding-guest-dresses" },
      { title: "Casual", slug: "casual-wedding-guest-dresses" },
      { title: "Dressy Casual", slug: "dressy-casual-wedding-guest-dresses" },
      { title: "Business Casual", slug: "business-casual-wedding-guest-dresses" },
      { title: "Casual Outfits for Women", slug: "casual-wedding-outfits-for-women" },
      { title: "What to Wear (Casual)", slug: "what-to-wear-to-a-casual-wedding" },
      { title: "Black Cocktail", slug: "black-cocktail-wedding-guest-dresses" },
      { title: "Best Black", slug: "best-black-wedding-guest-dresses" },
      { title: "Elegant Black w/ Sleeves", slug: "elegant-black-wedding-guest-dresses-with-sleeves" },
      { title: "Semi-Formal w/ Sleeves", slug: "semi-formal-wedding-guest-dresses-with-sleeves" },
      { title: "Elegant", slug: "elegant-wedding-guest-dresses" },
      { title: "Designer", slug: "designer-wedding-guest-dresses" },
      { title: "Best Picks", slug: "best-wedding-guest-dresses" },
      { title: "Best Formal", slug: "best-formal-wedding-guest-dresses" },
    ],
  },
  {
    label: "By Color",
    href: "/#by-color",
    items: [
      { title: "Black", slug: "black-wedding-guest-dresses" },
      { title: "Elegant Black", slug: "elegant-black-wedding-guest-dresses" },
      { title: "Blue", slug: "blue-wedding-guest-dresses" },
      { title: "Light Blue", slug: "light-blue-wedding-guest-dresses" },
      { title: "Navy", slug: "navy-wedding-guest-dresses" },
      { title: "Green", slug: "green-wedding-guest-dresses" },
      { title: "Dark Green", slug: "dark-green-wedding-guest-dresses" },
      { title: "Emerald Green", slug: "emerald-green-wedding-guest-dresses" },
      { title: "Olive Green", slug: "olive-green-wedding-guest-dresses" },
      { title: "Sage Green", slug: "sage-green-wedding-guest-dresses" },
      { title: "Pink", slug: "pink-wedding-guest-dresses" },
      { title: "Light Pink", slug: "light-pink-wedding-guest-dresses" },
      { title: "Rose Pink", slug: "rose-pink-wedding-guest-dresses" },
      { title: "Dark Pink", slug: "dark-pink-wedding-guest-dresses" },
      { title: "Hot Pink", slug: "hot-pink-wedding-guest-dresses" },
      { title: "Bright Pink", slug: "bright-pink-wedding-guest-dresses" },
      { title: "Blush", slug: "blush-wedding-guest-dresses" },
      { title: "Fuchsia", slug: "fuchsia-wedding-guest-dresses" },
      { title: "Burgundy", slug: "burgundy-wedding-guest-dresses" },
      { title: "Yellow", slug: "yellow-wedding-guest-dresses" },
      { title: "Butter Yellow", slug: "butter-yellow-wedding-guest-dresses" },
      { title: "Brown", slug: "brown-wedding-guest-dresses" },
      { title: "Chocolate Brown", slug: "chocolate-brown-wedding-guest-dresses" },
    ],
  },
  {
    label: "By Body Type",
    href: "/#by-body-type",
    items: [
      { title: "Plus Size", slug: "plus-size-wedding-guest-dresses" },
      { title: "Plus Size Cocktail", slug: "plus-size-cocktail-wedding-guest-dresses" },
      { title: "Plus Size Summer", slug: "plus-size-summer-wedding-guest-dresses" },
      { title: "Trendy Plus Size", slug: "trendy-plus-size-wedding-guest-dresses" },
      { title: "Big Tummy", slug: "wedding-guest-dresses-for-big-tummy" },
      { title: "Petite", slug: "petite-wedding-guest-dresses" },
      { title: "Maternity", slug: "maternity-wedding-guest-dresses" },
      { title: "Over 50", slug: "wedding-guest-dresses-over-50" },
    ],
  },
  {
    label: "By Style",
    href: "/#by-style",
    items: [
      { title: "Maxi", slug: "maxi-wedding-guest-dresses" },
      { title: "Midi", slug: "midi-wedding-guest-dresses" },
      { title: "Long", slug: "long-wedding-guest-dresses" },
      { title: "Knee Length", slug: "knee-length-wedding-guest-dresses" },
      { title: "Tea Length", slug: "tea-length-wedding-guest-dresses" },
      { title: "A-Line", slug: "a-line-wedding-guest-dresses" },
      { title: "Floral", slug: "floral-wedding-guest-dresses" },
      { title: "Floral Maxi", slug: "floral-maxi-wedding-guest-dresses" },
      { title: "Modest", slug: "modest-wedding-guest-dresses" },
      { title: "Long Sleeve", slug: "long-sleeve-wedding-guest-dresses" },
      { title: "With Sleeves", slug: "wedding-guest-dresses-with-sleeves" },
      { title: "Fall Long Sleeve", slug: "fall-wedding-guest-dresses-long-sleeve" },
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
        <div className="absolute top-full left-0 pt-1 z-50">
          <div className={`bg-ivory border border-ink-200 py-3 shadow-[0_8px_32px_rgba(26,24,21,0.08)] ${group.items.length > 8 ? "min-w-[400px]" : "min-w-[220px]"}`}>
            <div className={group.items.length > 8 ? "grid grid-cols-2 gap-x-1" : ""}>
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="block px-5 py-2 text-sm text-ink-700 hover:bg-cream-100 hover:text-blush-700 transition-colors whitespace-nowrap font-light"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
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
            {navGroups.map((group) => (
              <DesktopDropdown key={group.label} group={group} />
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
