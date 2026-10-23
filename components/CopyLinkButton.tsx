"use client";

import { useEffect, useState } from "react";

/**
 * Copy-link button, plus a "More…" button that opens the device's own share sheet
 * (Instagram, Messages, Messenger, etc.) on browsers that support it.
 */
export default function CopyLinkButton({ url, title, className }: { url: string; title: string; className: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(typeof navigator.share === "function"), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }
  return (
    <>
      <button type="button" onClick={copy} className={className} aria-live="polite">
        {copied ? "Copied" : "Copy link"}
      </button>
      {canShare && (
        <button type="button" onClick={() => navigator.share({ title, url }).catch(() => {})} className={className}>
          Other apps…
        </button>
      )}
    </>
  );
}
