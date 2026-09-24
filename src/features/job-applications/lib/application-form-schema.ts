import { z } from "zod";
import type {
  ApplicationDetail,
  ApplicationStatus,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "@interwjuer/contracts";
import { rejectionCategoryValues } from "@/features/rejection-insights/lib/rejection-categories";

const APPLICATION_STATUS_VALUES = [
  "APPLIED",
  "SCREENING",
  "INTERVIEWING",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const satisfies readonly ApplicationStatus[];

export const applicationStatusOptions: Array<{
  value: ApplicationStatus;
  label: string;
}> = [
  { value: "APPLIED", label: "Prijavljeno" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEWING", label: "Intervjui" },
  { value: "OFFER", label: "Ponuda" },
  { value: "ACCEPTED", label: "Prihvaćeno" },
  { value: "REJECTED", label: "Odbijeno" },
  { value: "WITHDRAWN", label: "Povučeno" },
];

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || /^https?:\/\/.+/i.test(value),
    "Unesite ispravan link (počinje sa http:// ili https://).",
  );

const optionalWholeNumber = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || /^\d+$/.test(value),
    "Unesite ceo broj veći ili jednak 0.",
  );

export const applicationFormSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(1, "Kompanija je obavezna.")
      .max(200, "Maksimalno 200 karaktera."),
    position: z
      .string()
      .trim()
      .min(1, "Pozicija je obavezna.")
      .max(200, "Maksimalno 200 karaktera."),
    applicationSourceId: z.string().min(1, "Izvor prijave je obavezan."),
    applicationDate: z.string().min(1, "Datum prijave je obavezan."),
    location: z
      .string()
      .trim()
      .max(200, "Maksimalno 200 karaktera.")
      .optional(),
    salaryMin: optionalWholeNumber,
    salaryMax: optionalWholeNumber,
    jobPostingUrl: optionalUrl,
    jobDescription: z
      .string()
      .max(10000, "Maksimalno 10000 karaktera.")
      .optional(),
    applicationStatus: z.enum(APPLICATION_STATUS_VALUES),
    rejectionCategory: z.enum(rejectionCategoryValues).optional(),
    rejectionReason: z
      .string()
      .max(10000, "Maksimalno 10000 karaktera.")
      .optional(),
    notes: z.string().max(10000, "Maksimalno 10000 karaktera.").optional(),
  })
  .refine(
    (values) =>
      !values.salaryMin ||
      !values.salaryMax ||
      Number(values.salaryMin) <= Number(values.salaryMax),
    {
      message: "Minimalna plata mora biti manja ili jednaka maksimalnoj.",
      path: ["salaryMax"],
    },
  )
  .superRefine((values, context) => {
    if (values.applicationStatus === "REJECTED" && !values.rejectionCategory) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Izaberi kategoriju odbijanja.",
        path: ["rejectionCategory"],
      });
    }
  });

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export function buildEmptyApplicationFormValues(): ApplicationFormValues {
  return {
    company: "",
    position: "",
    applicationSourceId: "",
    applicationDate: new Date().toISOString().slice(0, 10),
    location: "",
    salaryMin: "",
    salaryMax: "",
    jobPostingUrl: "",
    jobDescription: "",
    applicationStatus: "APPLIED",
    rejectionCategory: undefined,
    rejectionReason: "",
    notes: "",
  };
}

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function applicationDetailToFormValues(
  application: ApplicationDetail,
  applicationSourceId: string,
): ApplicationFormValues {
  return {
    company: application.company,
    position: application.position,
    applicationSourceId,
    applicationDate: toDateInputValue(application.applicationDate),
    location: application.location ?? "",
    salaryMin:
      application.salaryMin != null ? String(application.salaryMin) : "",
    salaryMax:
      application.salaryMax != null ? String(application.salaryMax) : "",
    jobPostingUrl: application.jobPostingUrl ?? "",
    jobDescription: application.jobDescription ?? "",
    applicationStatus: application.applicationStatus,
    rejectionCategory: application.rejectionCategory ?? undefined,
    rejectionReason: application.rejectionReason ?? "",
    notes: application.notes ?? "",
  };
}

export function toApplicationRequestPayload(
  values: ApplicationFormValues,
): CreateApplicationRequest & UpdateApplicationRequest {
  return {
    company: values.company.trim(),
    position: values.position.trim(),
    applicationSourceId: values.applicationSourceId,
    applicationDate: values.applicationDate,
    location: values.location?.trim() ? values.location.trim() : null,
    salaryMin: values.salaryMin ? Number(values.salaryMin) : null,
    salaryMax: values.salaryMax ? Number(values.salaryMax) : null,
    jobPostingUrl: values.jobPostingUrl?.trim()
      ? values.jobPostingUrl.trim()
      : null,
    jobDescription: values.jobDescription?.trim()
      ? values.jobDescription.trim()
      : null,
    applicationStatus: values.applicationStatus,
    rejectionCategory:
      values.applicationStatus === "REJECTED"
        ? (values.rejectionCategory ?? null)
        : null,
    rejectionReason:
      values.applicationStatus === "REJECTED" && values.rejectionReason?.trim()
        ? values.rejectionReason.trim()
        : null,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}
