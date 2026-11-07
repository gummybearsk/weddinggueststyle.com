"use client";

import Link from "next/link";

/**
 * Last-resort boundary for a failure in the root layout. It replaces the whole document,
 * so the text is written for this site and never matches Next.js's generic shell.
 * See error.tsx beside this file for why that matters.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <head>
        <title>Wedding Guest Style: page did not load</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ fontFamily: "system-ui, sans-serif", maxWidth: "40rem", margin: "4rem auto", padding: "0 1rem" }}>
        <h1>This Wedding Guest Style page did not load</h1>
        <p>Something went wrong while opening this wedding guest outfit guide. Trying again usually brings it back.</p>
        <p>
          <button type="button" onClick={reset}>
            Try again
          </button>{" "}
          <Link href="/">Home</Link>
        </p>
      </body>
    </html>
  );
}
