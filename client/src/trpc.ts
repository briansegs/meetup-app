import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@meetup-app/server";

export const trpc = createTRPCReact<AppRouter>();
