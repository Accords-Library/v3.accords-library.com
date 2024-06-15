import type { PayloadResponse } from "src/shared/payload/payload-sdk";

export const fetchOr404 = async <T>(
  {
    request,
    response,
  }: {
    request: Request;
    response: {
      headers: Headers;
    };
  },
  promise: () => Promise<PayloadResponse<T>>
): Promise<T | Response> => {
  try {
    const { data, timestamp } = await promise();
    const lastModified = timestamp.toUTCString();

    if (request.headers.get("If-Modified-Since") === lastModified) {
      return new Response(null, {
        status: 304,
        statusText: "Not Modified",
      });
    }

    // const userEtag = Astro.request.headers.get("If-None-Match");
    // if (userEtag === collectible.etag) {
    //   return new Response(null, {
    //     status: 304,
    //     statusText: "Not Modified",
    //   });
    // }

    response.headers.set("Last-Modified", lastModified);

    return data;
  } catch {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
};
