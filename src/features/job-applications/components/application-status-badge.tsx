import type { ApplicationStatus } from "@interwjuer/contracts";

import { Badge } from "@/components/ui/badge";
import {
  getApplicationStatusLabel,
  getApplicationStatusVariant,
} from "@/features/job-applications/lib/format";

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus;
};

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <Badge variant={getApplicationStatusVariant(status)}>
      {getApplicationStatusLabel(status)}
    </Badge>
  );
}
