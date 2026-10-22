import DressCodeDecoder from "./DressCodeDecoder";
import { DRESS_CODES, DRESS_CODE_SOURCE } from "@/lib/dressCodes";
import { getPublishedPageData } from "@/lib/getPages";

/** Server wrapper: resolves which guide links are live before handing data to the client island. */
export default function DressCodeDecoderSection() {
  const rungs = DRESS_CODES.map((r) => ({ ...r, links: r.slugs.filter((s) => getPublishedPageData(s.slug) !== null) }));
  return (
    <DressCodeDecoder
      rungs={rungs}
      sourceLabel={`Garment lists: ${DRESS_CODE_SOURCE.publisher}, "${DRESS_CODE_SOURCE.title}", read ${DRESS_CODE_SOURCE.readOn}.`}
    />
  );
}
