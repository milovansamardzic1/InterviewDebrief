import { z } from "zod";

export const ApplicationSourceIdParamSchema = z.object({
  id: z.string().cuid().optional(),
});
