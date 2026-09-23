// Live site self-reports the commit it was built from (global rule 36). The deploy
// verifier compares this to HEAD — the only check a stale alias or CDN cache can't fool.
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    { sha: process.env.VERCEL_GIT_COMMIT_SHA ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
