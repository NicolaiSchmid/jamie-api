const EXCLUDED_UPSTREAM_RESPONSE_HEADERS = new Set([
	"connection",
	"content-encoding",
	"content-length",
	"content-type",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade",
]);

export function proxyUpstreamResponseHeaders(source: Headers, target: Headers) {
	for (const [key, value] of source.entries()) {
		if (EXCLUDED_UPSTREAM_RESPONSE_HEADERS.has(key.toLowerCase())) {
			continue;
		}

		target.append(key, value);
	}
}
