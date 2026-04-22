import { afterEach, describe, expect, it, vi } from "vitest";
import { callJamieEndpoint, JamieUpstreamError } from "#/orpc/jamie-client";
import { meListTagsEndpoint } from "#/orpc/jamie-endpoints";

describe("callJamieEndpoint", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("forwards generic upstream headers on successful responses", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(
				JSON.stringify({
					result: {
						data: {
							json: {
								tags: [],
							},
						},
					},
				}),
				{
					status: 200,
					headers: {
						"cache-control": "private, max-age=60",
						"content-length": "999",
						"content-type": "application/json",
						"x-ratelimit-limit": "60",
					},
				},
			),
		);

		const resHeaders = new Headers();

		const result = await callJamieEndpoint(
			meListTagsEndpoint,
			{},
			"test-api-key",
			resHeaders,
		);

		expect(result).toEqual({ tags: [] });
		expect(resHeaders.get("cache-control")).toBe("private, max-age=60");
		expect(resHeaders.get("x-ratelimit-limit")).toBe("60");
		expect(resHeaders.has("content-length")).toBe(false);
		expect(resHeaders.has("content-type")).toBe(false);
	});

	it("forwards upstream headers before raising upstream errors", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
				status: 429,
				headers: {
					"retry-after": "60",
					"x-ratelimit-reset": "1713888000",
				},
			}),
		);

		const resHeaders = new Headers();

		await expect(
			callJamieEndpoint(meListTagsEndpoint, {}, "test-api-key", resHeaders),
		).rejects.toBeInstanceOf(JamieUpstreamError);

		expect(resHeaders.get("retry-after")).toBe("60");
		expect(resHeaders.get("x-ratelimit-reset")).toBe("1713888000");
	});
});
