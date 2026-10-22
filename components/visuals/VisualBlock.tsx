import type { Visual } from "@/lib/types";
import DressCodeLadder from "./DressCodeLadder";
import WearAvoid from "./WearAvoid";
import CompareTable from "./CompareTable";
import BarChart from "./BarChart";
import VerdictTable from "./VerdictTable";

/** Renders any produced visual declared in a page's JSON. Server-rendered, no JS. */
export default function VisualBlock({ visual }: { visual?: Visual }) {
  if (!visual) return null;
  switch (visual.kind) {
    case "ladder":
      return <DressCodeLadder highlight={visual.highlight} title={visual.title} caption={visual.caption} />;
    case "wearAvoid":
      return <WearAvoid {...visual} />;
    case "compare":
      return <CompareTable {...visual} />;
    case "bars":
      return <BarChart {...visual} />;
    case "verdict":
      return <VerdictTable {...visual} />;
    default:
      return null;
  }
}
