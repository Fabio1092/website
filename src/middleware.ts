import { defineMiddleware } from "astro:middleware";
import { softHyphenateHeadings } from "./lib/softHyphens";

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;
  const html = await response.text();
  return new Response(softHyphenateHeadings(html), { status: response.status, headers: response.headers });
});
