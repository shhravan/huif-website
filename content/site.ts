/**
 * Site copy, kept apart from the design code so wording can change without touching components.
 * Placeholders are in [square brackets] until the team confirms them.
 */
export const site = {
  name: "Harvard Undergraduate India Forum",
  nav: [
    { label: "About", href: "#about" },
    { label: "Programme", href: "#programme" },
    { label: "Speakers", href: "#speakers" },
    { label: "Get involved", href: "#get-involved" },
    { label: "Attend", href: "#attend" },
  ],
  register: { label: "Register interest", href: "#register" },
} as const;

export const opening = {
  /** First screen: the name and one strong line, nothing else. */
  line: "The first Harvard forum held in India.",
  cue: "Scroll to enter",
  /** After walking through the gate. */
  statementEyebrow: "Two days · [City], India",
  statement: "A conversation on where India is headed, convened by Harvard undergraduates.",
} as const;
