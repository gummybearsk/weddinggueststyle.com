import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              Wedding Guest Style
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/#by-season" className="hover:text-rose-600 transition-colors">
              By Season
            </Link>
            <Link href="/#by-dress-code" className="hover:text-rose-600 transition-colors">
              By Dress Code
            </Link>
            <Link href="/#by-color" className="hover:text-rose-600 transition-colors">
              By Color
            </Link>
            <Link href="/#by-style" className="hover:text-rose-600 transition-colors">
              By Style
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
