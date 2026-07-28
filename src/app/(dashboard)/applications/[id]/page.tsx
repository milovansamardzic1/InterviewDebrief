import { notFound } from "next/navigation";

import { ApplicationDetailView } from "@/features/job-applications/components/application-detail-view";
import { applicationsApi } from "@/lib/api/applications";
import { referenceDataApi } from "@/lib/api/reference-data";

export const dynamic = "force-dynamic";

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;
  const [application, applicationSources, interviewTypes, skills] =
    await Promise.all([
      applicationsApi.byId(id),
      referenceDataApi.applicationSources(),
      referenceDataApi.interviewTypes(),
      referenceDataApi.skills(),
    ]);

  if (!application) {
    notFound();
  }

  return (
    <ApplicationDetailView
      application={application}
      applicationSources={applicationSources}
      interviewTypes={interviewTypes}
      skills={skills}
    />
  );
}
