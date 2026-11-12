import GateIntro from "@/components/GateIntro";
import SiteHeader from "@/components/SiteHeader";
import SmoothScroll from "@/components/SmoothScroll";
import Reveal from "@/components/Reveal";
import Context from "@/components/Context";
import About from "@/components/About";
import Theme from "@/components/Theme";
import Panels from "@/components/Panels";
import Programme from "@/components/Programme";
import GateOutro from "@/components/GateOutro";
import SiteFooter from "@/components/SiteFooter";

// The Launch page tells the narrative brief's story (see BRIEF.md): through the Gate into India,
// the context, the Forum, the Theme, the Panels (select one for its question), the Programme, and back out through the Gate.
export default function Home() {
  return (
    <main id="top">
      <SmoothScroll />
      <Reveal />
      <SiteHeader variant="bar" />
      <GateIntro />
      <Context />
      <About />
      <Theme />
      <Panels />
      <Programme />
      <GateOutro />
      <SiteFooter />
    </main>
  );
}
