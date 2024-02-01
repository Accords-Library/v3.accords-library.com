/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />


declare namespace App {
  interface Locals {
      currentLocale: import("translations/translations").Locale
      currentTheme: "dark" | "auto" | "light"
      currentCurrency: "usd" | "eur"
  }
}