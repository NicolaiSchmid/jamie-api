import "#/polyfill";

import { RPCHandler } from "@orpc/server/fetch";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";
import { createFileRoute } from "@tanstack/react-router";

import type { ORPCContext } from "#/orpc/base";
import router from "#/orpc/router";

const handler = new RPCHandler<ORPCContext>(router, {
	plugins: [new ResponseHeadersPlugin<ORPCContext>()],
});

async function handle({ request }: { request: Request }) {
	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context: {
			headers: request.headers,
		},
	});

	return response ?? new Response("Not Found", { status: 404 });
}

export const Route = createFileRoute("/api/rpc/$")({
	server: {
		handlers: {
			HEAD: handle,
			GET: handle,
			POST: handle,
			PUT: handle,
			PATCH: handle,
			DELETE: handle,
		},
	},
});
