/**
 * All words on the site, kept apart from the design code so wording can change without touching components.
 * Sources: docs/website-content.md (final) and BRIEF.md. Terms follow GLOSSARY.md.
 */

/** The team's contact address. Until it is set, "Get in touch" leads to the closing section, which says so. */
export const CONTACT_EMAIL: string | null = "harvardundergraduateindiaforum@gmail.com";

export const site = {
  name: "Harvard Undergraduate India Forum",
  /** "#…" links are sections of the home page; "/…/" links are pages of their own. */
  nav: [
    { label: "About", href: "#about" },
    { label: "Panels", href: "#panels" },
    { label: "Programme", href: "#programme" },
    { label: "Partners", href: "/partners/" },
  ],
  instagram: { label: "Instagram", handle: "@harvardu_indiaforum", href: "https://www.instagram.com/harvardu_indiaforum" },
  contact: {
    label: "Get in touch",
    href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "#contact",
  },
} as const;

export const opening = {
  /** The one bold line under the name. */
  line: "The first Harvard forum in India.",
  action: { label: "See the programme", href: "#programme" },
  /** The facts strip under the title, as on indiaconferenceharvard.com. */
  facts: [
    { label: "When", value: "13–14 March 2027" },
    { label: "Where", value: "Mumbai" },
    { label: "Theme", value: "India Uncharted" },
  ],
} as const;

/** The team's photographs. Files are in public/photos as <name>-<width>.webp. */
export const photos = {
  tajmahal: {
    name: "tajmahal",
    w: [1000, 1600],
    ratio: 2000 / 1333,
    alt: "The Taj Mahal in soft morning light, framed by the dark arch of its gateway",
  },
  northblock: {
    name: "northblock",
    w: [1000, 1600],
    ratio: 2000 / 1333,
    alt: "The domed North Block of the Secretariat on Raisina Hill, New Delhi, in evening light",
  },
  sealinkday: {
    name: "sealinkday",
    w: [1000, 1600],
    ratio: 1920 / 1280,
    alt: "The Bandra–Worli Sea Link in Mumbai by day, a wave breaking in front of it",
  },
  carts: { name: "carts", w: [1200, 1920], ratio: 1920 / 1238, alt: "Black-and-white photograph of people pulling carts in a line along an embankment, reflected in the water" },
  taj: { name: "taj", w: [800, 1066], ratio: 1066 / 1333, alt: "The Taj Mahal Palace in Mumbai in late-afternoon light, pigeons in flight" },
} as const;

export type Photo = { name: string; w: readonly [number, number]; ratio: number; alt: string };

/** The story, in the order of the narrative brief: the context, the response, the invitation. */
/** Element ids shared between components: the Context section's title lives in the opening (GateIntro). */
export const ids = { contextTitle: "context-title" } as const;

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

/** A speaker or moderator on a Panel. */
export type Speaker = { name: string; role: string; moderator?: boolean };

/**
 * A Panel. Only the title is certain today; the question, the introduction and the speakers are added as the team
 * confirms them. Speakers stay hidden until `lineup.announced` is true, so every panel is announced at once.
 */
export type Panel = { title: string; question?: string; intro?: string; speakers?: readonly Speaker[] };

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
          rooms: [{ title: "Real Estate" }, { title: "The Future of Healthcare in India" /* taste-skill-ignore: the panel's confirmed title */ }],
        },
        { start: "19:30", end: "20:45", kind: "keynote", title: "Closing keynote", detail: "Business keynote" },
      ],
    },
  ],
} as const satisfies {
  heading: string;
  days: readonly { id: string; label: string; date: string; slots: readonly Slot[] }[];
};

/** The line-up is announced in one go: flip `announced` and every panel page shows its speakers. */
export const lineup = {
  announced: false,
  date: "TBA",
} as const;

/** The sixteen Panels in four strands. Every Panel title in the Programme belongs to exactly one strand (checked in lib/panels.ts). */
export const strands = [
  {
    id: "power",
    name: "Power",
    line: "Who decides, and how India governs and builds for itself.",
    photo: "northblock",
    panels: [
      "Law, Institutions & a Changing India",
      "Democracy, Citizenship & Representation",
      "Women Reshaping India’s Workforce",
      "Building the India of Tomorrow",
    ],
  },
  {
    id: "capital",
    name: "Capital",
    line: "Where India’s money comes from, who holds it and where it goes next.",
    photo: "sealinkday",
    panels: ["Startups & Venture Capital", "Wealth Management", "Legacy & Reinvention: Indian Family Businesses", "Real Estate"],
  },
  {
    id: "making",
    name: "Making",
    line: "What India makes, powers and heals, and the work that goes into it.",
    photo: "carts",
    panels: ["Building in India: Manufacturing", "India’s Energy Transition", "The Future of Healthcare in India", "Fashion & Design"], // taste-skill-ignore: the panel's confirmed title
  },
  {
    id: "culture",
    name: "Culture",
    line: "The stories India tells about itself, and who gets to tell them.",
    photo: "tajmahal",
    panels: ["Media, Culture, and India’s Soft Power", "Literature", "New Media", "The Changing Face of Indian Sport"],
  },
] as const satisfies readonly { id: string; name: string; line: string; photo: keyof typeof photos; panels: readonly string[] }[];

export const panels = {
  heading: "Sixteen panels, four strands",
  /** Shown wherever the team has not published a panel’s question yet. */
  noQuestion: "Question to be announced.",
  open: "Open the panel",
} as const;

/** One page per Panel. */
export const panelPage = {
  back: "All panels",
  when: "When",
  where: "Where",
  venue: "Mumbai",
  speakers: "Speakers",
  moderator: "Moderator",
  /** Before the line-up is announced. */
  pending: "Speakers will be announced together, all sixteen panels at once.",
  pendingDate: "Announcement date: TBA.",
  follow: "Follow us on Instagram to hear first",
  more: (strand: string) => `More from ${strand}`,
} as const;

/** The Partners page. Tiers and amounts are still to be set by the team (TBA). */
export const partners = {
  title: "Partner with the Forum",
  lead: "For two days in March, Harvard students and the people shaping India will share one room in Mumbai. Partners make that room possible, and have a place in it.",
  audience: {
    heading: "Who will be in the room",
    items: [
      {
        lead: "Harvard undergraduates",
        text: "Students from across Harvard College, from economics and government to medicine and the arts, who want to stay close to India’s future.",
      },
      {
        lead: "Students and young professionals in Mumbai",
        text: "The audience the Forum exists for: people early in their careers who want to hear the reasoning behind India’s choices, and question it.",
      },
      {
        lead: "Speakers across sixteen panels",
        text: "Leaders from government, business, culture and the professions, on panels from law and energy to film and sport.",
      },
    ],
    note: "Expected attendance: TBA.",
  },
  offer: {
    heading: "What partners receive",
    items: [
      { lead: "A place on the programme", text: "Your name alongside the Forum’s on stage, on this site and in the programme." },
      {
        lead: "Time with the room",
        text: "The programme sets aside a Sponsor Q&A on both days, over lunch on Saturday and brunch on Sunday.",
      },
      {
        lead: "The evening social",
        text: "Saturday closes with a keynote and a networking social, where partners meet speakers and students.",
      },
      {
        lead: "A strand or a panel of your own",
        text: "Partner with one of the four strands, Power, Capital, Making or Culture, or with a single panel close to your work.",
      },
      { lead: "Students to meet", text: "Talk to students about internships, graduate roles and research." },
    ],
  },
  ways: {
    heading: "Ways to partner",
    items: [
      { lead: "Forum partner", text: "The lead partner of HUIF 2027, across both days." },
      { lead: "Strand partner", text: "One of the four strands and its four panels." },
      { lead: "Panel partner", text: "One panel and its question." },
      { lead: "In-kind partner", text: "Venue, hospitality, travel or media." },
    ],
    note: "Tiers and amounts: TBA. Write to us and we’ll send the details.",
  },
  close: {
    heading: "Talk to us about partnering",
    line: "Tell us a little about your organisation and what you’d like from the Forum.",
    action: "Email the team",
    subject: "Partnering with HUIF 2027",
  },
} as const;

export const closing = {
  heading: "Join the conversation in Mumbai",
  line: "India’s future cannot be understood from one perspective. On 13–14 March 2027, explore it through many.",
  action: "Get in touch",
  pending: "Our contact address will be here shortly.",
} as const;

export const footer = {
  /** The close: one Marine band with the name, the date, updates, the pages and where to follow, then the name across the width. */
  title: "Harvard Undergraduate India Forum",
  line: "13–14 March 2027, Mumbai",
  updates: {
    label: "Stay updated",
    placeholder: "you@email.com",
    action: "Sign up",
    /** No mailing list yet: the form opens the visitor's email app with this message to the Forum's address. */
    subject: "Keep me updated on HUIF 2027",
    sent: "Your email app has opened with the request. Send it and we’ll keep you posted.",
    invalid: "Enter an email address, like name@email.com.",
  },
  follow: "Follow",
  reach: "Reach us",
} as const;
