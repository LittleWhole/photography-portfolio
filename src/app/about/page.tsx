import Snapshot from "@/components/Snapshot";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight bg-gradient-to-b from-black to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
          About Davy Ling
        </h1>
        <p className="text-lg text-neutral-700 dark:text-neutral-300">
          DC metro area photographer focused on portraits, events, landscapes, and travel.
        </p>
      </div>
      <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-[1.15fr_1.5fr] items-start">
        <div className="flex flex-col items-center lg:items-end gap-6">
          <Snapshot src="/portrait.jpg" alt="Davy Ling" caption="Davy Ling" size="lg" />
          <div className="max-w-md text-center lg:text-left space-y-4 text-neutral-700 dark:text-neutral-300">

          </div>
        </div>
        <div className="space-y-6">
          <AboutCard />
        </div>
      </div>
    </section>
  );
}

function AboutCard() {
  return (
    <Card className="p-8 sm:p-10">
      <CardContent className="space-y-6 p-0">
        <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-lg">
          Hey, I&apos;m Davy. I make relaxed, modern photos with clean light and real expression. Whether it&apos;s a quick
          portrait, a busy event, a candid street scene, or a landscape from the road, the goal is the same: simple,
          honest images that feel like you.
        </p>
        <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
          I&apos;m based in the DC metro area and work with individuals, couples, teams, and brands. The experience is
          easygoing and collaborative - clear direction when you want it, quiet when it&apos;s better to stay in the
          moment.
        </p>
        <div className="space-y-2">
          <h3 className="font-semibold">What to expect</h3>
          <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>Quick, thoughtful planning around your vision, time, and location</li>
            <li>Helpful direction if you want it; natural candids when you don&apos;t</li>
            <li>Clean, color‑true edits delivered in high‑res and web‑ready formats</li>
            <li>Prints and framing available on request</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Specialties</h3>
          <p className="text-neutral-700 dark:text-neutral-300">
            Portraits · Events · Graduation · Landscapes & Travel
          </p>
        </div>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link href="/work"><Button variant="outline">View work</Button></Link>
          <Link href="/contact"><Button>Contact me</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Stat component not used currently


