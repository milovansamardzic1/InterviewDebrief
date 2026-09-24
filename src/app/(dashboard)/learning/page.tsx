import { LearningWorkspace } from "@/features/learning/components/learning-workspace";
import { learningPlanApi } from "@/lib/api/learning-plan";
import { learningTasksApi } from "@/lib/api/learning-tasks";

export const dynamic = "force-dynamic";

export default async function LearningPage() {
  const [{ items: planItems }, { items: tasks }] = await Promise.all([
    learningPlanApi.get(),
    learningTasksApi.list({ includeCompleted: true }),
  ]);

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <LearningWorkspace planItems={planItems} tasks={tasks} />
    </main>
  );
}
