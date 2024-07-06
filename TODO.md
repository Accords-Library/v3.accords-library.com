# Accord's Library v3.0

## Ongoing

- [Bugs] No post processing on the 404 page

- [Bugs] Keziah reported some lag spikes when scrolling on the home page (Firefox on Windows)
- [Feat] [Analytics] Add analytics
- [Bugs] [Tooltips] Tooltip in under next element (example in timeline)
- [Bugs] [Language override] Maso actor is not focusable with keyboard nav

## Short term

- [Bugs] Make sure uploads name are slug-like and with an extension.
- [Bugs] Nyupun can't upload subtitles files
- [Bugs] https://v3.accords-library.com/en/collectibles/dod-original-soundtrack/scans obi is way too big
- [Feat] 404, 500 pages
- [Feat] [RichTextContent] Handle relationship
- [Feat] [Timeline] Improve layout/spacing on mobile
- [Bugs] Number of audio players seems limited (on Chrome and Firefox)
- [Feat] [RichTextContent] Add autolink block support

## Mid term

- [Feat] Improve page load speed by using
  - streaming https://docs.astro.build/en/recipes/streaming-improve-page-performance/
  - https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API
- [Feat] History replace instead of push when browsing scans and gallery
- [Feat] Use subgrid to align the generic previews
- [Bugs] [Timeline] Error if collectible not published?
- [Feat] [Timeline] display source language
- [Feat] [Timeline] Add details button in footer with credits + last updated / created
- [Bugs] [Videos] see why no video on Firefox and no poster on Chrome https://v3.accords-library.com/en/videos/661b672825d380e548dbb8c8
- [Feat] [Videos] Display platform info + channel page
- [Feat] [JSLess] Provide JS-less alternative for timeline card footers
- [Feat] [JSLess] Provide JS-less alternative for parent pages
- [Feat] Add a sitemap https://straffesites.com/en/blog/localized-sitemap-astro-storyblok

## Long term

- [Feat] Invalidate Back/Forward Cache when changing language/theme/currency
- [Feat] Hovering on a preview card could give a more detailed summary/preview (with all attributes)
- [Feat] Explore posibilities for View Transitions
- [Feat] Revemp theme system using light-dark https://caniuse.com/mdn-css_types_color_light-dark
- [Feat] Add reduce motion to element that zoom when hovering
- [Bugs] [iOS] Video doesn't seem to start
- [Feat] [Folders] Provide a list view, and a list/grid toggle
- [Feat] [Payload] Endpoints should provide a simple text-based version of the content (for OG purposes)
- [Feat] [WebManifest] Add shortcuts https://web.dev/patterns/web-apps/shortcuts
- [Feat] [PWA] Rich install UI https://web.dev/patterns/web-apps/richer-install-ui/
- [Feat] [Folders] Support for nameless section
- [Feat] [Scripts] Can't run the scripts using node (ts-node?)
- [Feat] [Scans] Order of cover/dustjacket/obi should be based on the book's page order.
- [Feat] [Medias] Add Parent pages
- [Feat] Add proper localization for formatFilesize, formatInches, formatMillimeters, formatPounds, and formatGrams
- [Feat] [Timeline] Some filtering options (by source/languages)
- [Feat] The Chronicles
- [Feat] The Changelog
- [Feat] Grid view (all files)
- [Feat] Web archives
- [Feat] Contact page
- [Feat] About us page
- [Feat] Global search function
  - Consider official search plugin for payload https://payloadcms.com/docs/plugins/search
- [Feat] Anonymous comments
- [Feat] [Images] add images group (which could be named or not)
- [Feat] [Recorders] add list of contributions on recorders' pages
- [Feat] Detect unused wording keys
- [Feat] Replace tippy with native tooltip
  - https://caniuse.com/css-anchor-positioning
  - https://caniuse.com/mdn-api_htmlelement_popover

## Bonus

- [Feat] Static HTML site export for archival
- [Feat] Secret Terminal mode
- [Feat] Add RSS
