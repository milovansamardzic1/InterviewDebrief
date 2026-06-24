import type { InterviewRoundStatus } from "@interwjuer/contracts";

import { Badge } from "@/components/ui/badge";
import {
  getRoundStatusLabel,
  getRoundStatusVariant,
} from "@/features/job-applications/lib/format";

type RoundStatusBadgeProps = {
  status: InterviewRoundStatus;
};

export function RoundStatusBadge({ status }: RoundStatusBadgeProps) {
  return (
    <Badge variant={getRoundStatusVariant(status)}>
      {getRoundStatusLabel(status)}
    </Badge>
  );
}
