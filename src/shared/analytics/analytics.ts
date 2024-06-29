import { contextCache } from "src/utils/payload";

const getUnlocalizedPathname = (pathname: string): string => {
  for (const locale of contextCache.locales) {
    if (pathname.startsWith(`/${locale.id}`)) {
      return pathname.substring(`/${locale.id}`.length) || "/";
    }
  }
  return pathname;
};

type TrackRequestParams = {
  params: Record<string, string | undefined>;
  locals: App.Locals;
  clientAddress: string;
};

export const trackRequest = (request: Request, { clientAddress, locals }: TrackRequestParams) => {
  const userAgent = request.headers.get("User-Agent");
  const acceptLanguage = request.headers.get("Accept-Language");
  const { method, url: stringUrl, referrer } = request;
  const url = new URL(stringUrl);

  const body: AnalyticsBody = {
    type: "request",
    timestamp: Date.now(),
    payload: {
      user: {
        address: clientAddress,
        attributes: {
          locale: locals.currentLocale,
        },
      },
      request: {
        method,
        pathname: getUnlocalizedPathname(url.pathname),
        referrer,
        ...(acceptLanguage ? { acceptLanguage } : {}),
        ...(userAgent ? { userAgent } : {}),
      },
      response: {
        status: locals.notFound ? 404 : 200,
      },
    },
  };
  track(body);
};

export const trackEvent = (eventName: string) => {
  const body: AnalyticsBody = { type: "event", timestamp: Date.now(), eventName };
  track(body);
};

type AnalyticsBody = Record<string, unknown> & {
  type: "event" | "request";
  timestamp: number;
};

const track = async (body: AnalyticsBody) => {
  if (!import.meta.env.ANALYTICS_URL) return;
  try {
    await fetch(import.meta.env.ANALYTICS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.warn("Couldn't send analytics", e);
  }
};
