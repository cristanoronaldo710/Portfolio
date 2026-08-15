import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TechWall } from "@/components/TechWall";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Background } from "@/components/Background";
import { Contact } from "@/components/Contact";
import { Assistant } from "@/components/Assistant";
import { CommandPalette } from "@/components/CommandPalette";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TechWall />
        <Work />
        <About />
        <Background />
        <Contact />
      </main>
      <Assistant />
      <CommandPalette />
    </>
  );
}
