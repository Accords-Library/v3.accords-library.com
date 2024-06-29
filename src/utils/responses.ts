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

export type SerializableResponse = {
  headers: [string, string][];
  status: number;
  statusText: string;
  body?: string;
};

new Response();

export const serializeResponse = async (response: Response): Promise<SerializableResponse> => {
  const clonedResponse = response.clone();
  return {
    body: await clonedResponse.text(),
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers: [...clonedResponse.headers],
  };
};

export const deserializeResponse = ({
  body,
  headers,
  status,
  statusText,
}: SerializableResponse): Response => {
  return new Response(body, { headers, status, statusText });
};
