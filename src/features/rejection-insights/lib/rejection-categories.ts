import type { RejectionCategory } from "@interwjuer/contracts";

export const rejectionCategoryOptions: Array<{
  value: RejectionCategory;
  label: string;
}> = [
  { value: "TECHNICAL_SKILLS", label: "Tehničko znanje" },
  { value: "SYSTEM_DESIGN", label: "System design" },
  { value: "PROBLEM_SOLVING", label: "Problem solving" },
  { value: "COMMUNICATION", label: "Komunikacija" },
  { value: "EXPERIENCE_FIT", label: "Iskustvo / fit" },
  { value: "COMPENSATION", label: "Kompenzacija" },
  { value: "POSITION_CLOSED", label: "Pozicija zatvorena" },
  { value: "OTHER", label: "Ostalo" },
];

export const rejectionCategoryValues = rejectionCategoryOptions.map(
  (option) => option.value,
) as [RejectionCategory, ...RejectionCategory[]];

export function getRejectionCategoryLabel(
  category: RejectionCategory | null,
): string {
  if (!category) {
    return "Nekategorizovano";
  }

  return (
    rejectionCategoryOptions.find((option) => option.value === category)
      ?.label ?? category
  );
}
