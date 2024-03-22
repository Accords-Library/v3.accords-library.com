import type { WordingKey } from "src/i18n/wordings-keys";

const timelineEras: { name: WordingKey; start: number; end: number }[] = [
  { name: "timeline.eras.cataclysm", start: 856, end: 856 },
  {
    name: "timeline.eras.drakengard3",
    start: 997,
    end: 1000,
  },
  {
    name: "timeline.eras.drakengard",
    start: 1001,
    end: 1099,
  },
  {
    name: "timeline.eras.drakengard2",
    start: 1100,
    end: 1117,
  },
  {
    name: "timeline.eras.nier",
    start: 2003,
    end: 5012,
  },
  {
    name: "timeline.eras.nierAutomata",
    start: 5012,
    end: 12543,
  },
];

export const dataConfig = {
  timeline: {
    yearsWithABreakBefore: [856, 997, 1001, 1118, 1957, 2003, 2049, 2050, 3361, 3463],
    eras: timelineEras,
  },
};
