export const fetchOr404 = async <T>(promise: () => Promise<T>): Promise<T | Response> => {
  try {
    return await promise();
  } catch {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
};
