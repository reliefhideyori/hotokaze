import LP_HTML from "./lp-html";

export async function GET() {
  return new Response(LP_HTML, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
