import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type QuestionTopicFilterProps = {
  topic?: string;
};

export function QuestionTopicFilter({ topic }: QuestionTopicFilterProps) {
  return (
    <form action="/questions" className="flex items-center gap-2">
      <Input
        type="text"
        name="topic"
        placeholder="Pretraži po temi..."
        defaultValue={topic ?? ""}
        className="max-w-xs"
      />
      <Button type="submit" variant="secondary">
        Filtriraj
      </Button>
      {topic ? (
        <Button variant="ghost" render={<Link href="/questions" />}>
          Obriši filter
        </Button>
      ) : null}
    </form>
  );
}
