/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    currentLocale: string;
    currentCurrency: string;
    notFound: boolean;
  }
}
