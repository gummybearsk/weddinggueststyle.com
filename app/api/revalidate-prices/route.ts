import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { AMAZON_DATA_TAG } from "@/lib/amazonData";

export const dynamic = "force-dynamic";

/**
 * Called by .github/workflows/refresh-amazon.yml right after it publishes new prices to the
 * `amazon-data` branch. Clears the cached price data and every page built from it, so the
 * next request renders the new prices. No deploy involved.
 *
 * Fail-closed: without PRICE_REVALIDATE_SECRET configured, or with a wrong bearer token,
 * it does nothing and returns 401.
 */
export async function POST(req: Request) {
  const secret = process.env.PRICE_REVALIDATE_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag(AMAZON_DATA_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
