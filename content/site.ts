/**
 * All words on the site, kept apart from the design code so wording can change without touching components.
 * Sources: docs/website-content.md (final) and BRIEF.md. Terms follow GLOSSARY.md.
 */

/** The team's contact address. Until it is set, "Get in touch" leads to the closing section, which says so. */
export const CONTACT_EMAIL: string | null = "harvardundergraduateindiaforum@gmail.com";

export const site = {
  name: "Harvard Undergraduate India Forum",
  nav: [
    { label: "About", href: "#about" },
    { label: "Panels", href: "#panels" },
    { label: "Programme", href: "#programme" },
  ],
  instagram: { label: "Instagram", handle: "@harvardu_indiaforum", href: "https://www.instagram.com/harvardu_indiaforum" },
  contact: {
    label: "Get in touch",
    href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "#contact",
  },
} as const;

export const opening = {
  action: { label: "See the programme", href: "#programme" },
  /** The facts strip under the title. */
  facts: [
    { label: "When", value: "13–14 March 2027" },
    { label: "Where", value: "Mumbai" },
    { label: "Theme", value: "India Uncharted" },
  ],
} as const;

/** The team's photographs. Files are in public/photos as <name>-<width>.webp. */
export const photos = {
  taj: { name: "taj", w: [800, 1066], ratio: 1066 / 1333, alt: "The Taj Mahal Palace in Mumbai in late-afternoon light, pigeons in flight" },
  carts: { name: "carts", w: [1200, 1920], ratio: 1920 / 1238, alt: "Black-and-white photograph of people pulling carts in a line along an embankment, reflected in the water" },
} as const;

export type Photo = (typeof photos)[keyof typeof photos];

/** The story, in the order of the narrative brief: the context, the response, the invitation. */
export const context = {
  heading: "A country too complex for a single narrative",
  /** Read as one paragraph: the first part in full ink, the rest quieter. */
  lead: "India’s future is being shaped in boardrooms and classrooms, laboratories and hospitals, public institutions and communities,",
  rest: "by people whose experiences and ambitions often look very different from one another. No single perspective can capture the whole picture.",
  /** Why now: the narrative brief's two reasons. */
  reasons: [
    {
      lead: "India is changing in many directions at once.",
      text: "A conversation about AI is also about jobs, education and governance. A conversation about healthcare is also about cost, public systems and who gets care. These questions rarely belong to one field.",
    },
    {
      lead: "Students and young professionals belong in the room.",
      text: "They usually meet the people shaping India through news and podcasts. Here they can hear the reasoning, ask the questions and challenge the answers in person.",
    },
  ],
} as const;

/** The Theme, from the narrative brief: what each half of it means. */
export const theme = {
  heading: "India Uncharted: A Nation of Multitudes",
  parts: [
    {
      lead: "India Uncharted.",
      text: "Look past the familiar headlines about growth, technology and influence. Ask what those changes mean in practice, how they differ from one community to the next, and which parts of the country’s future deserve more attention.",
    },
    {
      lead: "A Nation of Multitudes.",
      text: "India cannot be understood through one experience, one geography, one generation or one set of priorities. Its languages, identities, economies and ambitions differ, even within a single field.",
    },
  ],
  close: "Not every conversation will end in agreement. The aim is better questions, and a clearer sense of why the answers differ.",
} as const;

export const about = {
  heading: "A forum to bring those perspectives together",
  paragraphs: [
    "Under this year’s theme, India Uncharted: A Nation of Multitudes, we hope to explore the diverse perspectives and opportunities shaping India’s future.",
    "The Forum was born out of a shared desire among Indian international students at Harvard to remain meaningfully engaged with our nation amid profound change. As members of the Indian diaspora studying abroad, we see this gathering as an opportunity to contribute to India’s future through thoughtful conversations across disciplines, generations, and perspectives.",
  ],
  mumbai: "India is the subject of the conversation. Mumbai is where it will unfold.",
} as const;

/** A slot in the Schedule. Times are 24-hour "HH:MM"; the page formats them. */
export type Slot =
  | { start: string; end: string; kind: "keynote"; title: string; detail?: string }
  | { start: string; end: string; kind: "break"; title: string; rooms?: readonly [string, string] }
  | { start: string; end: string; kind: "panels"; rooms: readonly [Panel, Panel] };

export type Panel = { title: string; question?: string };

export const programme = {
  heading: "Programme",
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
  days: readonly { id: string; label: string; date: string; slots: readonly Slot[] }[];
};

/** Every Panel, by day, in the order of the Schedule. Titles come from the Schedule (see BRIEF.md). */
export const panels = {
  heading: "Sixteen panels, two days",
  intro: "From democracy and the law to film, sport and healthcare. Select a title to see when it meets and the question it sets out to explore.",
} as const;

export const closing = {
  heading: "Join the conversation in Mumbai",
  line: "India’s future cannot be understood from one perspective. On 13–14 March 2027, explore it through many.",
  action: "Get in touch",
  pending: "Our contact address will be here shortly.",
} as const;

export const footer = {
  /** The close: an invitation, then the facts band. */
  heading: "Follow along. Then be in the room.",
  line: "Speakers, the programme and how to attend will be announced on Instagram first.",
  reach: "Reach us directly",
  band: [
    { value: "13–14 March", note: "2027 · Mumbai" },
    { value: "16 panels", note: "4 keynotes, two rooms" },
  ],
  about: "The Harvard Undergraduate India Forum is a student-led gathering that brings students, professionals and leaders together to explore India’s present and future.",
} as const;
