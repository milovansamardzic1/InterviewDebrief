import { notFound } from "next/navigation";

import { StatsOverview } from "@/features/dashboard/components/stats-overview";
import { PreviewChrome } from "@/features/preview/components/preview-chrome";
import {
  getDashboardDemo,
  type DashboardDemoId,
} from "@/features/preview/lib/demo-fixtures";
import { referenceDataApi } from "@/lib/api/reference-data";

const MODES: DashboardDemoId[] = ["onboarding", "getting-started", "analytics"];

type PageProps = {
  params: Promise<{ mode: string }>;
};

export default async function PreviewDashboardPage({ params }: PageProps) {
  const { mode } = await params;

  if (!MODES.includes(mode as DashboardDemoId)) {
    notFound();
  }

  const demo = getDashboardDemo(mode as DashboardDemoId);
  const applicationSources =
    mode === "onboarding" ? await referenceDataApi.applicationSources() : [];

  return (
    <PreviewChrome title={demo.title} description={demo.description} lockHeight>
      <StatsOverview
        stats={demo.stats}
        learningPlanItems={demo.learningPlanItems}
        learningTasks={demo.learningTasks}
        actionContext={
          mode === "onboarding"
            ? {
                applicationSources,
                interviewTypes: [],
                skills: [],
                primaryApplication: null,
              }
            : null
        }
      />
    </PreviewChrome>
  );
}
