import { os } from "@orpc/server";

export type ORPCContext = {
  headers: Headers;
  jamieApiKey?: string;
};

export const base = os.$context<ORPCContext>().errors({
  UNAUTHORIZED: {},
});

export const withJamieApiKey = base.middleware(async ({ context, errors, next }) => {
  const jamieApiKey = context.headers.get("x-api-key")?.trim();

  if (!jamieApiKey) {
    throw errors.UNAUTHORIZED({
      message: "Missing x-api-key header",
    });
  }

  return next({
    context: {
      jamieApiKey,
    },
  });
});

export const jamieProtected = base.use(withJamieApiKey);
