export type WordingKey =
  | "global.siteName"
  | "global.siteSubtitle"
  | "home.title"
  | "home.description"
  | "home.aboutUsButton"
  | "home.librarySection.title"
  | "home.librarySection.description"
  | "home.librarySection.button"
  | "home.chroniclesSection.title"
  | "home.chroniclesSection.description"
  | "home.changesSection.title"
  | "home.changesSection.description"
  | "home.changesSection.button"
  | "home.moreSection.title"
  | "home.moreSection.description"
  | "home.linksSection.title"
  | "home.linksSection.description"
  | "settings.title"
  | "settings.theme.title"
  | "settings.theme.description"
  | "settings.language.title"
  | "settings.language.description"
  | "settings.currency.title"
  | "settings.currency.description"
  | "header.topbar.search.tooltip"
  | "header.topbar.theme.tooltip"
  | "header.topbar.language.tooltip"
  | "header.topbar.currency.tooltip"
  | "global.theme.light"
  | "global.theme.auto"
  | "global.theme.dark"
  | "footer.links.home.title"
  | "footer.links.timeline.title"
  | "footer.links.timeline.subtitle"
  | "footer.links.gallery.title"
  | "footer.links.gallery.subtitle"
  | "footer.links.videos.title"
  | "footer.links.videos.subtitle"
  | "footer.links.webArchives.title"
  | "footer.links.webArchives.subtitle"
  | "footer.socials.discord.title"
  | "footer.socials.discord.subtitle"
  | "footer.socials.twitter.title"
  | "footer.socials.twitter.subtitle"
  | "footer.socials.github.title"
  | "footer.socials.github.subtitle"
  | "footer.socials.contact.title"
  | "footer.socials.contact.subtitle"
  | "footer.license.description"
  | "footer.license.icons.tooltip"
  | "footer.disclaimer"
  | "header.nav.parentPages.label"
  | "collectibles.releaseDate"
  | "collectibles.size"
  | "collectibles.size.width"
  | "collectibles.size.height"
  | "collectibles.size.thickness"
  | "collectibles.availability.available"
  | "collectibles.availability.notAvailable.future"
  | "collectibles.availability.notAvailable.past"
  | "collectibles.availability.notAvailable.noPrice"
  | "collectibles.availability.notAvailable"
  | "collectibles.price"
  | "collectibles.price.free"
  | "collectibles.bookFormat"
  | "collectibles.bookFormat.pageCount"
  | "collectibles.bookFormat.binding.paperback"
  | "collectibles.bookFormat.binding.hardcover"
  | "collectibles.bookFormat.binding.readingDirection.leftToRight"
  | "collectibles.bookFormat.binding.readingDirection.rightToLeft"
  | "collectibles.imageCount"
  | "header.topbar.settings.tooltip"
  | "collectibles.contents"
  | "collectibles.weight"
  | "global.credits.transcribers"
  | "global.credits.translators"
  | "global.credits.proofreaders"
  | "global.credits.authors"
  | "pages.tableOfContent"
  | "header.nav.parentPages.collections.folder"
  | "header.nav.parentPages.collections.collectible"
  | "header.nav.parentPages.tooltip"
  | "global.meta.description"
  | "global.loading"
  | "pages.tableOfContent.sceneBreak"
  | "pages.tableOfContent.break"
  | "pages.credits.availableLanguages"
  | "timeline.title"
  | "timeline.description"
  | "timeline.eras.cataclysm"
  | "timeline.eras.drakengard"
  | "timeline.eras.drakengard2"
  | "timeline.eras.drakengard3"
  | "timeline.eras.nier"
  | "timeline.eras.nierAutomata"
  | "timeline.jumpTo"
  | "timeline.notes.content"
  | "timeline.notes.title"
  | "timeline.priorCataclysmNote.title"
  | "timeline.priorCataclysmNote.content"
  | "timeline.year.during"
  | "timeline.eventFooter.sources"
  | "timeline.eventFooter.languages"
  | "timeline.eventFooter.note"
  | "global.sources.typeLabel.collectible"
  | "global.sources.typeLabel.collectible.range.custom"
  | "global.sources.typeLabel.collectible.range.page"
  | "global.sources.typeLabel.collectible.range.timestamp"
  | "global.sources.typeLabel.folder"
  | "global.sources.typeLabel.page"
  | "global.sources.typeLabel.url"
  | "global.openMediaPage"
  | "global.downloadButton"
  | "global.previewTypes.video"
  | "global.previewTypes.page"
  | "global.previewTypes.image"
  | "global.previewTypes.audio"
  | "global.previewTypes.collectible"
  | "global.previewTypes.unknown"
  | "collectibles.scans.title"
  | "collectibles.gallery.title"
  | "collectibles.gallery.subtitle"
  | "collectibles.scans.subtitle"
  | "collectibles.scans.shortIndex.flapFront"
  | "collectibles.scans.shortIndex.front"
  | "collectibles.scans.shortIndex.spine"
  | "collectibles.scans.shortIndex.back"
  | "collectibles.scans.shortIndex.flapBack"
  | "collectibles.scans.cover"
  | "collectibles.scans.coverInside"
  | "collectibles.scans.dustjacket"
  | "collectibles.scans.dustjacketInside"
  | "collectibles.scans.obi"
  | "collectibles.scans.obiInside"
  | "collectibles.scans.pages"
  | "collectibles.scans.dustjacket.description"
  | "collectibles.scans.obi.description"
  | "global.sources.typeLabel.scans"
  | "global.sources.typeLabel.gallery"
  | "global.media.attributes.filename"
  | "global.media.attributes.duration"
  | "global.media.attributes.filesize"
  | "global.media.attributes.createdAt"
  | "global.media.attributes.updatedAt"
  | "global.media.attributes.updatedBy"
  | "collectibles.nature"
  | "collectibles.languages"
  | "collectibles.nature.physical"
  | "collectibles.nature.digital"
  | "global.previewTypes.zip"
  | "global.previewTypes.pdf"
  | "collectibles.files"
  | "pages.credits.translationLabel"
  | "pages.credits.currentLocale";
