/**
 * After a deploy, a page loaded before it can ask for a script file the deploy replaced.
 * That fails with a ChunkLoadError and would otherwise show the "did not load" screen.
 * Reloading fetches the current page and its current scripts, which fixes it.
 *
 * Reload at most once per 5 minutes per tab (sessionStorage), so a genuinely missing file
 * cannot cause a reload loop; after that the normal error screen shows. Google's renderer
 * starts each page with empty storage, so it gets one reload too.
 */
const KEY = "wgs-chunk-reload-at";
const WINDOW_MS = 5 * 60 * 1000;

export function isChunkLoadError(error: unknown): boolean {
  const e = error as { name?: string; message?: string } | null;
  const text = `${e?.name ?? ""} ${e?.message ?? ""}`;
  return /ChunkLoadError|Loading (CSS )?chunk [\w-]+ failed|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
    text,
  );
}

/** Returns true when a reload was started, so the caller can render nothing meanwhile. */
export function reloadOnceForChunkError(error: unknown): boolean {
  if (typeof window === "undefined" || !isChunkLoadError(error)) return false;
  try {
    const last = Number(window.sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < WINDOW_MS) return false;
    window.sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    return false; // storage blocked: never risk a loop
  }
  window.location.reload();
  return true;
}
