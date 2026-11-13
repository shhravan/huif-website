import { programme, strands, photos, type Panel, type Slot } from "@/content/site";

/** "13:30" → "1:30 pm" */
export function clock(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; // a clock, not index numbering
}

/** "15:00", "16:15" → "3:00–4:15 pm"; the suffix is written once when both ends share it. */
export function span(start: string, end: string) {
  const [a, b] = [clock(start), clock(end)];
  return a.slice(-2) === b.slice(-2) ? `${a.slice(0, -3)}–${b}` : `${a}–${b}`;
}

/** "Law, Institutions & a Changing India" → "law-institutions-a-changing-india" */
export const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/’/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type Strand = (typeof strands)[number];

/** A Panel with where and when it meets, read straight from the Programme, and the strand it belongs to. */
export type PanelEntry = Panel & {
  slug: string;
  day: string;
  date: string;
  time: string;
  room: number;
  strand: Strand;
};

const strandOf = (title: string) => {
  const s = strands.find((x) => (x.panels as readonly string[]).includes(title));
  if (!s) throw new Error(`Panel "${title}" is in no strand (content/site.ts → strands)`);
  return s;
};

/** Every Panel in Programme order. */
export const allPanels: PanelEntry[] = programme.days.flatMap((day) =>
  (day.slots as readonly Slot[]).flatMap((s): PanelEntry[] =>
    s.kind === "panels"
      ? s.rooms.map((p, i) => ({
          ...p,
          slug: slugify(p.title),
          day: day.label,
          date: day.date,
          time: span(s.start, s.end),
          room: i + 1,
          strand: strandOf(p.title),
        }))
      : [],
  ),
);

// every strand title must be a real Panel, so a renamed panel can't silently drop out of the page
for (const s of strands)
  for (const t of s.panels)
    if (!allPanels.some((p) => p.title === t)) throw new Error(`Strand "${s.name}" lists "${t}", which is not in the Programme`);

/** A strand's panels in the order the strand lists them. */
export const panelsOf = (strand: Strand) => strand.panels.map((t) => allPanels.find((p) => p.title === t)!);

export const photoOf = (strand: Strand) => photos[strand.photo];

export const panelHref = (slug: string) => `/panels/${slug}/`;
