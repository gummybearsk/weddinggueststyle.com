import Link from "next/link";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function AuthorByline({ publishDate }: { publishDate?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-100 text-rose-700 font-semibold text-sm">
          SM
        </span>
        <div>
          <p className="text-gray-700">
            By{" "}
            <Link href="/author/sarah-mitchell" className="text-rose-600 hover:underline font-medium">
              Sarah Mitchell
            </Link>
          </p>
          <p className="text-xs text-gray-400">Wedding Style Editor · 10+ years covering wedding fashion</p>
        </div>
      </div>
      {publishDate && (
        <div className="sm:ml-auto text-xs text-gray-400">
          Last updated: {formatDate(publishDate)}
        </div>
      )}
    </div>
  );
}
