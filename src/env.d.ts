/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    currentLocale: string;
    currentTheme: "dark" | "auto" | "light";
    currentCurrency: string;
    notFound: boolean;
  }
}
