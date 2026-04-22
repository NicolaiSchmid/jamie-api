import { os } from "@orpc/server";

export type ORPCContext = {
  headers: Headers;
  jamieApiKey?: string;
};

export const base = os.$context<ORPCContext>();

export const withJamieApiKey = base.middleware(async ({ context, next }) => {
  const jamieApiKey = context.headers.get("x-api-key")?.trim();

  return next({
    context: {
      jamieApiKey,
    },
  });
});

export const jamieProtected = base.use(withJamieApiKey);
