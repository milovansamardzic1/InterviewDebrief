import { notFound } from "next/navigation";

import { ApplicationDetailView } from "@/features/job-applications/components/application-detail-view";
import { applicationsApi } from "@/lib/api/applications";

export const dynamic = "force-dynamic";

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;
  const application = await applicationsApi.byId(id);

  if (!application) {
    notFound();
  }

  return <ApplicationDetailView application={application} />;
}
