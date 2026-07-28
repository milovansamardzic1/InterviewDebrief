"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type {
  InterviewRoundStatus,
  InterviewTypeItem,
} from "@interwjuer/contracts";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  getAvailableStatusOptions,
  roundFormSchema,
  type RoundFormValues,
} from "@/features/job-applications/lib/round-form-schema";

type RoundFormProps = {
  formId: string;
  defaultValues: RoundFormValues;
  interviewTypes: InterviewTypeItem[];
  /** Original persisted status; when set, the status field is shown and
   * restricted to valid transitions from this status. */
  currentStatus?: InterviewRoundStatus;
  disabled?: boolean;
  onSubmit: (values: RoundFormValues) => void | Promise<void>;
};

export function RoundForm({
  formId,
  defaultValues,
  interviewTypes,
  currentStatus,
  disabled = false,
  onSubmit,
}: RoundFormProps) {
  const showStatusFields = currentStatus != null;
  const availableStatusOptions = currentStatus
    ? getAvailableStatusOptions(currentStatus)
    : [];
  const form = useForm<RoundFormValues>({
    resolver: zodResolver(roundFormSchema),
    defaultValues,
  });

  const status = useWatch({ control: form.control, name: "status" });

  return (
    <Form {...form}>
      <form
        id={formId}
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
      >
        <fieldset disabled={disabled} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="interviewTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tip intervjua</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={disabled || interviewTypes.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberi tip intervjua" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {interviewTypes.length === 0 ? (
                  <FormDescription>
                    Nema dostupnih tipova intervjua. Pokušaj kasnije.
                  </FormDescription>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zakazano za</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showStatusFields ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={disabled || availableStatusOptions.length <= 1}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableStatusOptions.length <= 1 ? (
                      <FormDescription>
                        Ovaj status je finalan i ne može se dalje menjati.
                      </FormDescription>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {status === "COMPLETED" ? (
                <FormField
                  control={form.control}
                  name="completedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Završeno</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>
          ) : null}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Napomene</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
      </form>
    </Form>
  );
}
