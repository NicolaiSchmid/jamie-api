import { ZodError } from "zod";

import { env } from "#/env";
import { upstreamErrorResponseSchema } from "#/orpc/jamie-contract";
import type { JamieEndpoint } from "#/orpc/jamie-endpoints";

const DEFAULT_JAMIE_API_BASE_URL = "https://beta-api.meetjamie.ai";
const DEFAULT_JAMIE_API_TIMEOUT_MS = 15_000;

type HeaderMap = Record<string, string>;

export class JamieUpstreamError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly headers: HeaderMap;

  constructor(status: number, body: unknown, headers: HeaderMap) {
    const parsedBody = upstreamErrorResponseSchema.safeParse(body);
    const message =
      parsedBody.success
        ? parsedBody.data.error
        : `Jamie upstream request failed with status ${status}`;

    super(message);
    this.name = "JamieUpstreamError";
    this.status = status;
    this.body = body;
    this.headers = headers;
  }
}

export class JamieResponseParseError extends Error {
  readonly cause: ZodError;
  readonly body: unknown;

  constructor(body: unknown, cause: ZodError) {
    super("Jamie upstream response did not match the documented schema");
    this.name = "JamieResponseParseError";
    this.body = body;
    this.cause = cause;
  }
}

export class JamieRequestTimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Jamie upstream request timed out after ${timeoutMs}ms`);
    this.name = "JamieRequestTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

function getJamieApiBaseUrl() {
  return env.JAMIE_API_BASE_URL ?? DEFAULT_JAMIE_API_BASE_URL;
}

function getJamieApiTimeoutMs() {
  return env.JAMIE_API_TIMEOUT_MS ?? DEFAULT_JAMIE_API_TIMEOUT_MS;
}

function headersToRecord(headers: Headers): HeaderMap {
  return Object.fromEntries(headers.entries());
}

function encodeUpstreamInput(input: unknown) {
  if (input === undefined) {
    return undefined;
  }

  if (typeof input === "object" && input !== null && Object.keys(input).length === 0) {
    return undefined;
  }

  return JSON.stringify({ json: input });
}

function unwrapSuccessPayload(body: unknown) {
  if (
    typeof body === "object" &&
    body !== null &&
    "result" in body &&
    typeof body.result === "object" &&
    body.result !== null &&
    "data" in body.result &&
    typeof body.result.data === "object" &&
    body.result.data !== null &&
    "json" in body.result.data
  ) {
    return body.result.data.json;
  }

  return body;
}

function parseResponseBody(rawText: string): unknown {
  if (rawText.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return rawText;
  }
}

export async function callJamieEndpoint<TEndpoint extends JamieEndpoint<any, any>>(
  endpoint: TEndpoint,
  rawInput: TEndpoint["inputSchema"]["_input"],
  apiKey: string,
): Promise<TEndpoint["outputSchema"]["_output"]> {
  const input = endpoint.inputSchema.parse(rawInput);
  const upstreamInput = endpoint.toUpstreamInput(input);
  const url = new URL(
    `/v1/${endpoint.scope}/${endpoint.procedure}`,
    getJamieApiBaseUrl(),
  );

  const encodedInput = encodeUpstreamInput(upstreamInput);
  const timeoutMs = getJamieApiTimeoutMs();
  const controller = new AbortController();
  const init: RequestInit = {
    method: endpoint.method,
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
    },
    signal: controller.signal,
  };

  if (endpoint.method === "GET") {
    if (encodedInput) {
      url.searchParams.set("input", encodedInput);
    }
  } else if (encodedInput) {
    init.body = encodedInput;
  }

  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, init);
    const headers = headersToRecord(response.headers);
    const rawText = await response.text();
    const body = parseResponseBody(rawText);

    if (!response.ok) {
      throw new JamieUpstreamError(response.status, body, headers);
    }

    const successPayload = unwrapSuccessPayload(body);
    const parsed = endpoint.outputSchema.safeParse(successPayload);

    if (!parsed.success) {
      throw new JamieResponseParseError(successPayload, parsed.error);
    }

    return parsed.data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new JamieRequestTimeoutError(timeoutMs);
    }

    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
