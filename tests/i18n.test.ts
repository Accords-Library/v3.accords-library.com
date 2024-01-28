import { expect, test } from "bun:test";

const cases: [string, string, string[], string][] = [
  ["", "", [], "/en/"],
  ["", "", ["fr"], "/fr/"],
  ["", "", ["en"], "/en/"],
  ["", "", ["en", "fr"], "/en/"],
  ["", "en", [], "/en/"],
  ["", "fr", [], "/fr/"],
  ["", "fr", ["en"], "/en/"],
  ["", "fr", ["en", "fr"], "/en/"],
  ["", "fr,en", ["en", "fr"], "/en/"],
];

test.each(cases)(
  "Fetching url with prefix %p, with Accept-Language header %p, with cookie al_pref_languages %p, should redirect the user to %p",
  async (urlPrefix, acceptLanguage, cookie, expectedRedirection) => {
    const response = await fetch(`http://localhost:12498${urlPrefix}`, {
      redirect: "manual",
      headers: {
        ...(acceptLanguage ? { "Accept-Language": acceptLanguage } : {}),
        ...(cookie.length > 0
          ? { Cookie: `al_pref_languages=${JSON.stringify(cookie)}` }
          : {}),
      },
    });
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(expectedRedirection);
  }
);
