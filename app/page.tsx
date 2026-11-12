import GateIntro from "@/components/GateIntro";
import SiteHeader from "@/components/SiteHeader";
import SmoothScroll from "@/components/SmoothScroll";
import Reveal from "@/components/Reveal";
import Arrival from "@/components/Arrival";
import About from "@/components/About";
import Questions from "@/components/Questions";
import Programme from "@/components/Programme";
import GateOutro from "@/components/GateOutro";
import SiteFooter from "@/components/SiteFooter";

// The Launch page (see BRIEF.md): Opening, Arrival, About, Questions, Programme, Exit, Footer.
export default function Home() {
  return (
    <main id="top">
      <SmoothScroll />
      <Reveal />
      <SiteHeader variant="bar" />
      <GateIntro />
      <Arrival />
      <About />
      <Questions />
      <Programme />
      <GateOutro />
      <SiteFooter />
    </main>
  );
}
