import GateIntro from "@/components/GateIntro";
import SiteHeader from "@/components/SiteHeader";
import SmoothScroll from "@/components/SmoothScroll";
import Reveal from "@/components/Reveal";
import Arrival from "@/components/Arrival";
import Context from "@/components/Context";
import About from "@/components/About";
import Questions from "@/components/Questions";
import Programme from "@/components/Programme";
import Invitation from "@/components/Invitation";
import SiteFooter from "@/components/SiteFooter";

// The Launch page tells the narrative brief's story (see BRIEF.md):
// the Gate and the Gateway, the context, the Forum's response, the questions, the Programme, the invitation.
export default function Home() {
  return (
    <main id="top">
      <SmoothScroll />
      <Reveal />
      <SiteHeader variant="bar" />
      <GateIntro />
      <Arrival />
      <Context />
      <About />
      <Questions />
      <Programme />
      <Invitation />
      <SiteFooter />
    </main>
  );
}
