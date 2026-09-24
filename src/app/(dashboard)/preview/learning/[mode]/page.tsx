import { notFound } from "next/navigation";

import { LearningWorkspace } from "@/features/learning/components/learning-workspace";
import { PreviewChrome } from "@/features/preview/components/preview-chrome";
import {
  getLearningDemo,
  type LearningDemoId,
} from "@/features/preview/lib/demo-fixtures";

const MODES: LearningDemoId[] = ["empty", "recommendations", "tasks", "filled"];

type PageProps = {
  params: Promise<{ mode: string }>;
};

export default async function PreviewLearningPage({ params }: PageProps) {
  const { mode } = await params;

  if (!MODES.includes(mode as LearningDemoId)) {
    notFound();
  }

  const demo = getLearningDemo(mode as LearningDemoId);

  return (
    <PreviewChrome title={demo.title} description={demo.description}>
      <div className="flex min-w-0 flex-col gap-6">
        <LearningWorkspace planItems={demo.planItems} tasks={demo.tasks} />
      </div>
    </PreviewChrome>
  );
}
