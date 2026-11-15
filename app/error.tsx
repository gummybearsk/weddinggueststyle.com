"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { reloadOnceForChunkError } from "@/lib/chunkReload";

/**
 * Keeps a client-side failure inside the site's own layout, so the page keeps its <head>
 * (canonical, title) and never falls back to Next.js's generic "Application error" shell.
 * Google clusters that identical shell across unrelated sites and then lists one of them
 * as canonical: fleet check 2026-11-07 found 24 URLs on 9 sites pointing at strangers.
 * A script file missing after a deploy (ChunkLoadError) reloads the page once instead.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [reloading, setReloading] = useState(false);
  useEffect(() => {
    console.error(error);
    if (reloadOnceForChunkError(error)) setReloading(true);
  }, [error]);

  if (reloading) return null;

  return (
    <section style={{ maxWidth: "40rem", margin: "0 auto", padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>This Wedding Guest Style page did not load</h1>
      <p style={{ marginTop: "1rem" }}>
        Something went wrong while opening this wedding guest outfit guide. The page itself is fine, so trying again usually
        brings it back.
      </p>
      <p style={{ marginTop: "1.5rem" }}>
        <button type="button" onClick={reset} style={{ textDecoration: "underline" }}>
          Try again
        </button>{" "}
        <Link href="/" style={{ textDecoration: "underline" }}>
          Home
        </Link>
      </p>
    </section>
  );
}
