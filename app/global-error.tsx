"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { reloadOnceForChunkError } from "@/lib/chunkReload";

/**
 * Last-resort boundary for a failure in the root layout. It replaces the whole document,
 * so the text is written for this site and never matches Next.js's generic shell.
 * See error.tsx beside this file for why that matters.
 *
 * No robots noindex here (removed 2026-11-15): this screen can be rendered inside Google's
 * renderer after a transient failure, and a noindex then drops a healthy page from the index
 * (/casual-wedding-guest-dresses, crawl of 2026-11-12). A script file missing after a deploy
 * reloads the page once instead of showing this screen.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [reloading, setReloading] = useState(false);
  useEffect(() => {
    if (reloadOnceForChunkError(error)) setReloading(true);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Wedding Guest Style: page did not load</title>
      </head>
      <body style={{ fontFamily: "system-ui, sans-serif", maxWidth: "40rem", margin: "4rem auto", padding: "0 1rem" }}>
        {reloading ? null : (
        <>
        <h1>This Wedding Guest Style page did not load</h1>
        <p>Something went wrong while opening this wedding guest outfit guide. Trying again usually brings it back.</p>
        <p>
          <button type="button" onClick={reset}>
            Try again
          </button>{" "}
          <Link href="/">Home</Link>
        </p>
        </>
        )}
      </body>
    </html>
  );
}
