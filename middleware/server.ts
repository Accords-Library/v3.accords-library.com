Bun.serve({
  port: 12498,
  fetch: async (req) => {
    const reqUrl = new URL(req.url);
    const rewriteUrl = new URL(reqUrl);
    rewriteUrl.hostname = "localhost";
    rewriteUrl.port = "12499";
    rewriteUrl.protocol = "http";
    const rewrite = new Request(rewriteUrl, req);
    const response = await fetch(rewrite, { redirect: "manual" });
    console.log(`[${response.status}] ${rewriteUrl.pathname}`);

    if (response.status === 404 && response.headers.has("Location")) {

      // Prevent redirection from a non locale-specific page to the en locale-specific page 
      if (response.headers.get("location") === "/en" + rewriteUrl.pathname) {
        rewriteUrl.pathname = "/en/" + rewriteUrl.pathname;
        const rewrite = new Request(rewriteUrl, req);
        return await fetch(rewrite, { redirect: "manual" });
      }

      return new Response(await response.blob(), {
        headers: response.headers,
        status: 302,
        statusText: "Found",
      });
    }

    return response;
  },
});
