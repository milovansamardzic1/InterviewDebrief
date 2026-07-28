"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SkillItem } from "@interwjuer/contracts";

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
  skillEvaluationFormSchema,
  skillScoreOptions,
  type SkillEvaluationFormValues,
} from "@/features/job-applications/lib/skill-evaluation-form-schema";

type SkillEvaluationFormProps = {
  formId: string;
  defaultValues: SkillEvaluationFormValues;
  skills: SkillItem[];
  allowSkillChange: boolean;
  disabled?: boolean;
  onSubmit: (values: SkillEvaluationFormValues) => void | Promise<void>;
};

export function SkillEvaluationForm({
  formId,
  defaultValues,
  skills,
  allowSkillChange,
  disabled = false,
  onSubmit,
}: SkillEvaluationFormProps) {
  const form = useForm<SkillEvaluationFormValues>({
    resolver: zodResolver(skillEvaluationFormSchema),
    defaultValues,
  });

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
            name="skillId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veština</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={
                    disabled || !allowSkillChange || skills.length === 0
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberi veštinu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                        {skill.category ? ` · ${skill.category}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {skills.length === 0 ? (
                  <FormDescription>
                    Nema dostupnih veština. Pokušaj kasnije.
                  </FormDescription>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ocena</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {skillScoreOptions.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}/5
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
