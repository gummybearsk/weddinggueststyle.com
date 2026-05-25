import Link from "next/link";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function AuthorByline({ publishDate }: { publishDate?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-ink-600">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/authors/sukie.jpg"
          alt="Sukie Gao"
          width={36}
          height={36}
          className="w-9 h-9 rounded-full object-cover bg-blush-100 border border-ink-200"
        />
        <div>
          <p className="text-ink-800 font-light">
            By{" "}
            <Link href="/author/sukie-gao" className="text-blush-600 hover:underline italic display-italic">
              Sukie Gao
            </Link>
          </p>
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink-500 mt-0.5">Editor</p>
        </div>
      </div>
      {publishDate && (
        <div className="sm:ml-auto text-[11px] uppercase tracking-[0.15em] text-ink-500">
          Updated · {formatDate(publishDate)}
        </div>
      )}
    </div>
  );
}
