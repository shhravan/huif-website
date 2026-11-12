/**
 * All words on the site, kept apart from the design code so wording can change without touching components.
 * Sources: docs/website-content.md (final) and BRIEF.md. Terms follow GLOSSARY.md.
 */

/** The team's contact address. Until it is set, "Get in touch" leads to the closing section, which says so. */
export const CONTACT_EMAIL: string | null = "harvardundergraduateindiaforum@gmail.com";

export const site = {
  name: "Harvard Undergraduate India Forum",
  theme: "India Uncharted: A Nation of Multitudes",
  where: "Mumbai",
  when: "13–14 March 2027",
  nav: [
    { label: "About", href: "#about" },
    { label: "Programme", href: "#programme" },
  ],
  contact: {
    label: "Get in touch",
    href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "#contact",
  },
} as const;

export const opening = {
  /** First screen, under the name. */
  line: "India Uncharted · Mumbai, 13–14 March 2027",
  action: { label: "See the programme", href: "#programme" },
} as const;

/** The team's photographs, used full screen. Files are in public/photos as <name>-<width>.webp. */
export const photos = {
  dusk: { name: "dusk", w: [1200, 1920], ratio: 1920 / 1080, alt: "The Mumbai skyline at dusk across the sea" },
} as const;

export type Photo = (typeof photos)[keyof typeof photos];

/** The story, in the order of the narrative brief: the context, the response, the invitation. */
export const context = {
  heading: "A country too complex for a single narrative",
  paragraphs: [
    "India’s future is being shaped across boardrooms and classrooms, laboratories and hospitals, public institutions and communities, and through the work of people whose experiences and ambitions often look very different from one another.",
    "No single perspective can capture the whole picture.",
  ],
} as const;

export const about = {
  heading: "A forum to bring those perspectives together",
  paragraphs: [
    "Under this year’s theme, India Uncharted: A Nation of Multitudes, we hope to explore the diverse perspectives and opportunities shaping India’s future.",
    "The Forum was born out of a shared desire among Indian international students at Harvard to remain meaningfully engaged with our nation amid profound change. As members of the Indian diaspora studying abroad, we see this gathering as an opportunity to contribute to India’s future through thoughtful conversations across disciplines, generations, and perspectives.",
  ],
  facts: [
    { label: "Where", value: "Mumbai" },
    { label: "When", value: "13–14 March 2027" },
    { label: "Programme", value: "16 panels, 4 keynotes" },
    { label: "Format", value: "Two days, two rooms" },
  ],
} as const;

/** A slot in the Schedule. Times are 24-hour "HH:MM"; the page formats them. */
export type Slot =
  | { start: string; end: string; kind: "keynote"; title: string; detail?: string }
  | { start: string; end: string; kind: "break"; title: string; rooms?: readonly [string, string] }
  | { start: string; end: string; kind: "panels"; rooms: readonly [Panel, Panel] };

export type Panel = { title: string; question?: string };

export const programme = {
  heading: "Programme",
  intro: "Two days, two rooms, sixteen panels and four keynotes.",
  days: [
    {
      id: "day-1",
      label: "Day 1",
      date: "Saturday 13 March",
      slots: [
        { start: "07:30", end: "09:00", kind: "break", title: "Breakfast" },
        { start: "09:00", end: "10:15", kind: "keynote", title: "Opening keynote", detail: "Government keynote" },
        {
          start: "10:30",
          end: "11:45",
          kind: "panels",
          rooms: [
            {
              title: "Law, Institutions & a Changing India",
              question:
                "How can India’s institutions balance continuity with change as the nation navigates new economic, technological, and social realities?",
            },
            { title: "Startups & Venture Capital" },
          ],
        },
        {
          start: "12:00",
          end: "13:15",
          kind: "panels",
          rooms: [
            { title: "Media, Culture, and India’s Soft Power" },
            {
              title: "Building the India of Tomorrow",
              question:
                "As India grows and its economy changes, which infrastructure investments would do the most to expand access and support our population, and what will it take to deliver these investments?",
            },
          ],
        },
        { start: "13:30", end: "14:45", kind: "break", title: "Lunch", rooms: ["Indigenous Artisans (art display)", "Sponsor Q&A"] },
        {
          start: "15:00",
          end: "16:15",
          kind: "panels",
          rooms: [{ title: "Fashion & Design" }, { title: "Wealth Management" }],
        },
        {
          start: "16:30",
          end: "17:45",
          kind: "panels",
          rooms: [
            { title: "Building in India: Manufacturing" },
            {
              title: "Women Reshaping India’s Workforce",
              question:
                "How can women shape the next chapter of India’s economic growth, and what opportunities are emerging for greater participation, innovation, and leadership?",
            },
          ],
        },
        { start: "18:00", end: "19:15", kind: "keynote", title: "Closing keynote", detail: "Networking social" },
      ],
    },
    {
      id: "day-2",
      label: "Day 2",
      date: "Sunday 14 March",
      slots: [
        { start: "10:30", end: "11:45", kind: "keynote", title: "Opening keynote", detail: "Pop culture keynote" },
        { start: "12:00", end: "13:15", kind: "break", title: "Brunch", rooms: ["Art display and NGO fundraising", "Sponsor Q&A"] },
        {
          start: "13:30",
          end: "14:45",
          kind: "panels",
          rooms: [
            {
              title: "Literature",
              question:
                "How does literature shape the stories a nation tells about itself, and how are Indian writers redefining those narratives today?",
            },
            { title: "Legacy & Reinvention: Indian Family Businesses" },
          ],
        },
        {
          start: "15:00",
          end: "16:15",
          kind: "panels",
          rooms: [{ title: "New Media" }, { title: "Democracy, Citizenship & Representation" }],
        },
        {
          start: "16:30",
          end: "17:45",
          kind: "panels",
          rooms: [
            {
              title: "India’s Energy Transition",
              question:
                "What will it take to deliver clean power reliably and affordably for the India of tomorrow, and how should governments, companies, and consumers share the cost of getting there?",
            },
            { title: "The Changing Face of Indian Sport" },
          ],
        },
        {
          start: "18:00",
          end: "19:15",
          kind: "panels",
          rooms: [{ title: "Real Estate" }, { title: "The Future of Healthcare in India" /* the panel's confirmed title */ }],
        },
        { start: "19:30", end: "20:45", kind: "keynote", title: "Closing keynote", detail: "Business keynote" },
      ],
    },
  ],
} as const satisfies {
  heading: string;
  intro: string;
  days: readonly { id: string; label: string; date: string; slots: readonly Slot[] }[];
};

export const questions = {
  heading: "The questions",
  intro: "Each panel explores one question. Here are five of them.",
  items: [
    { panel: "Building the India of Tomorrow", when: "Day 1 · 12:00 pm" },
    { panel: "Law, Institutions & a Changing India", when: "Day 1 · 10:30 am" },
    { panel: "Women Reshaping India’s Workforce", when: "Day 1 · 4:30 pm" },
    { panel: "Literature", when: "Day 2 · 1:30 pm" },
    { panel: "India’s Energy Transition", when: "Day 2 · 4:30 pm" },
  ],
} as const;

export const closing = {
  heading: "Join the conversation in Mumbai",
  line: "13–14 March 2027",
  action: "Email the team",
  pending: "Our contact address will be here shortly.",
} as const;

export const footer = {
  line: "India Uncharted · Mumbai, 13–14 March 2027",
} as const;
