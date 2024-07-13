/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    currentLocale: string;
    sdkCalls: Set<string>;
    pageCaching: boolean;
  }
}
