import { Metadata } from "next";
import PacHubRandomGallery from "@/components/landing/pac-hub-random-gallery";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdB5GRFbJYX6D5_HC09-qOuRDEaHjJv20JTTd5zk7SUXZ4CgQ/viewform?embedded=true";

export const metadata: Metadata = {
  title: "BitGN PAC Hub Gazipasa, Turkey — AI Agent Challenge",
  description:
    "Join the BitGN PAC Challenge in Gazipasa, Turkey — a global competition to build personal and trustworthy autonomous AI agents. Local hub organized by Rustam Salavatov, founder of SuperDuperAI.",
  robots: { index: true, follow: true },
};

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
      Registration Open
    </div>
  );
}

function TimelineItem({ date, label }: { date: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-indigo-500/5 px-4 py-3 text-center">
      <div className="text-sm font-bold text-indigo-400">{date}</div>
      <div className="mt-0.5 text-xs text-zinc-500">{label}</div>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[hsl(220,13%,9%)] p-6">
      <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
        <span className="text-xl">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-[hsl(220,13%,9%)] px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5"
    >
      &rarr; {children}
    </a>
  );
}

export default function PacHubPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-6">
      {/* Hero */}
      <section className="pb-10 pt-16 text-center">
        <Badge />
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
          BitGN{" "}
          <span className="bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            PAC
          </span>{" "}
          Hub
        </h1>
        <p className="mx-auto mt-2 text-sm font-medium text-zinc-400">
          Gazipasa, Antalya, Turkey
        </p>
        <p className="mx-auto mt-3 max-w-lg text-lg text-zinc-500">
          Local hub for the global AI challenge — build personal and trustworthy
          autonomous agents in a deterministic simulated environment
        </p>
      </section>

      {/* Cards */}
      <section className="grid gap-4 pb-10">
        <Card icon="🤖" title="What is PAC?">
          <p className="text-sm leading-relaxed text-zinc-500">
            Personal &amp; Trustworthy Agent Challenge — a global competition by
            BitGN. Participants build AI agents that solve tasks in a
            deterministic sandbox. Evaluation is based on actual tool calls and
            side effects, not written text.
          </p>
        </Card>

        <Card icon="📍" title="Our Hub — Gazipasa, Turkey">
          <p className="text-sm leading-relaxed text-zinc-500">
            We are organizing a local hub in Gazipasa, Antalya, Turkey — a live
            space where you can participate together, exchange ideas, and compete
            in real time. A small, focused venue for deep work.
          </p>
          <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-center">
            <p className="text-sm text-zinc-400">
              <strong className="text-green-500">Venue confirmed</strong> —
              exact location and address in Gazipasa will be announced closer to
              the date. Stay tuned.
            </p>
          </div>
        </Card>

        <Card icon="📅" title="Key Dates">
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <TimelineItem date="Feb 17" label="Registration opens" />
            <TimelineItem date="Mar 15" label="Sandbox & sample agent" />
            <TimelineItem date="Mar 25" label="API frozen" />
            <TimelineItem date="Apr 11" label="Competition day" />
          </div>
        </Card>

        <Card icon="🔗" title="Links">
          <div className="mt-2 flex flex-wrap gap-3">
            <LinkButton href="https://bitgn.com/challenge/PAC">
              Official PAC page
            </LinkButton>
            <LinkButton href="https://github.com/bitgn/challenges/blob/main/pac/06_hubs_program_guide.md">
              Hub Program Guide
            </LinkButton>
          </div>
        </Card>
      </section>

      <PacHubRandomGallery />

      {/* Registration form */}
      <section id="register" className="border-t border-white/5 py-10">
        <h2 className="text-center text-2xl font-bold">Register</h2>
        <p className="mx-auto mt-2 text-center text-sm text-zinc-500">
          Fill out the form below to join our hub
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-white/5">
          <iframe
            src={GOOGLE_FORM_URL}
            width="100%"
            height="959"
            className="border-0 bg-white"
            title="Registration form"
            loading="lazy"
          >
            Loading...
          </iframe>
        </div>
      </section>

      {/* About organizer */}
      <section className="border-t border-white/5 py-10">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/10 bg-[hsl(220,13%,9%)] p-8 md:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:gap-10">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-5xl md:h-32 md:w-32 md:text-6xl">
              R
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">Rustam Salavatov</h2>
              <p className="mt-1 text-sm text-indigo-400">
                Hub Organizer &middot; AI Engineer / Multi-Agent Systems
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Founder of{" "}
                <a
                  href="https://superduperai.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  SuperDuperAI
                </a>{" "}
                and creator of Life2Film (photo-to-video AI). Building
                AI-powered creative tools that make professional content creation
                accessible to everyone.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                Purpose over profit. I believe the best technology is the kind
                that empowers ordinary people to do extraordinary things —
                without gatekeepers, expensive tools, or years of training.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                <a
                  href="https://superduperai.co/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
                >
                  About
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-zinc-600">
        BitGN PAC Hub &middot; Gazipasa, Turkey &middot;{" "}
        <a
          href="https://superduperai.co/about"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          superduperai.co/about
        </a>
      </footer>
    </div>
  );
}
