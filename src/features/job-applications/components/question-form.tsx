"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  difficultyOptions,
  questionFormSchema,
  type QuestionFormValues,
} from "@/features/job-applications/lib/question-form-schema";

type QuestionFormProps = {
  formId: string;
  defaultValues: QuestionFormValues;
  disabled?: boolean;
  onSubmit: (values: QuestionFormValues) => void | Promise<void>;
};

export function QuestionForm({
  formId,
  defaultValues,
  disabled = false,
  onSubmit,
}: QuestionFormProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
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
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pitanje</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="myAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moj odgovor</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oblast</FormLabel>
                  <FormControl>
                    <Input placeholder="npr. Algoritmi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Težina</FormLabel>
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bez ocene" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {difficultyOptions.map((option) => (
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
          </div>

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
