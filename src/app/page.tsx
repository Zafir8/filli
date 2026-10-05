import Image from "next/image";
import SceneCanvas from "@/components/SceneCanvas";
import ScrollTracker from "@/components/ScrollTracker";
import PourMeter from "@/components/PourMeter";
import Reveal from "@/components/Reveal";
import NotifyForm from "@/components/NotifyForm";

const STEPS = [
  {
    n: "01",
    title: "The",
    accent: "brew.",
    body: "Black tea simmered strong with milk until it turns a deep, comforting caramel — karak, the way the streets of the Gulf have loved it for generations.",
  },
  {
    n: "02",
    title: "The",
    accent: "zafran.",
    body: "Then the saffron. Golden threads that turn a good karak into FiLLi's signature Zafran Chai — fragrant, rich, unmistakable.",
  },
  {
    n: "03",
    title: "The",
    accent: "pour.",
    body: "Poured hot and shared slowly. Because at FiLLi, every cup starts a conversation.",
  },
];

const STATS = [
  { k: "1991", v: "Established in Dubai" },
  { k: "100+", v: "Cafés worldwide" },
  { k: "14", v: "Countries and counting" },
  { k: "HBS", v: "Harvard Business School case study" },
];

// Official items, names and photos from fillicafe.com/menu
const MENU = [
  { name: "FiLLi Tea Zafran", note: "FiLLi chai with premium zafran — the signature zafran.", img: "/menu/filli-signature--filli-tea-zafran.webp", tag: "Signature" },
  { name: "Masala Chai", note: "Traditional spiced masala chai.", img: "/menu/filli-signature--masala-tea.webp", tag: "Chai" },
  { name: "Iced Zafran Chai", note: "Chilled zafran chai over ice.", img: "/menu/iced-chai--iced-zafran-chai.webp", tag: "Iced" },
  { name: "Chicken Tikka Kathi", note: "Paratha, chicken tikka, kathi veg, egg, onion and mint mayo.", img: "/menu/paratha-and-kathi-roll--chicken-tikka-kathi-roll.webp", tag: "Kathi Roll" },
  { name: "Grilled Chicken Paratha Roll", note: "Paratha, grilled chicken, 1000 island sauce, onion and capsicum.", img: "/menu/paratha-and-kathi-roll--grilled-chicken-paratha-roll.webp", tag: "Paratha Roll" },
  { name: "Punjabi Veg Samosa", note: "Classic Punjabi vegetable samosa.", img: "/menu/snacks--samosa.webp", tag: "Snacks" },
];

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <SceneCanvas />
      <ScrollTracker />
      <PourMeter />

      {/* nav — mirrors fillicafe.com */}
      <header className="fixed inset-x-0 top-0 z-30 bg-cream/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3 md:px-10">
          <div className="flex items-center gap-8">
            <a href="#top" aria-label="FiLLi Cafe — home">
              <Image src="/img/filli-logo.svg" alt="FiLLi" width={80} height={45} priority />
            </a>
            <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
              <a href="#story" className="transition hover:text-filli">Our Story</a>
              <a href="#menu" className="transition hover:text-filli">Menu</a>
              <a href="https://fillicafe.com/chai-culture" className="transition hover:text-filli">Chai Culture</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-bean/20 px-3 py-1.5 text-xs font-bold sm:inline-flex">
              <span aria-hidden>🇱🇰</span> Coming soon
            </span>
            <a href="#visit" className="btn btn-brown !px-5 !py-2 text-sm">Get Notified</a>
          </div>
        </div>
      </header>

      <main id="top" className="relative z-10">
        {/* 0 — hero: FiLLi's own photography, opaque over the 3D scene */}
        <section
          data-scene="0"
          className="relative flex min-h-svh flex-col overflow-hidden rounded-b-[2.5rem] bg-cream md:flex-row md:items-center md:px-10"
        >
          {/* photo: stacked on top for phones, full-bleed behind the copy on desktop */}
          <div className="relative mt-16 h-[38svh] w-full shrink-0 md:absolute md:inset-0 md:mt-0 md:h-auto">
            <Image
              src="/hero/hero-zafran-cups.webp"
              alt="FiLLi Zafran Chai in the saffron cup and the signature orange cup"
              fill
              priority
              sizes="100vw"
              className="hidden object-cover object-[70%_center] md:block"
            />
            <Image
              src="/hero/hero-zafran-cups-mobile.webp"
              alt="FiLLi Zafran Chai in the saffron cup and the signature orange cup"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_12%] md:hidden"
            />
            {/* cream wash so the copy stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-cream to-transparent to-35% md:bg-gradient-to-r md:from-cream md:from-10% md:via-cream/55 md:via-35% md:to-transparent md:to-55%" />
          </div>

          <div className="relative max-w-xl px-5 pt-2 pb-16 md:px-0 md:pt-28 md:pb-0">
            <div className="rise">
              <p className="eyebrow mb-6">Dubai&apos;s Original · Now in Sri Lanka</p>
            </div>
            <div className="rise" style={{ animationDelay: "120ms" }}>
              <h1 className="headline text-5xl md:text-7xl">
                Sri Lanka, meet <br />
                <em>Zafran Chai.</em>
              </h1>
            </div>
            <div className="rise" style={{ animationDelay: "240ms" }}>
              <p className="mt-6 max-w-md text-lg text-bean/80">
                Signature chai. Global street bites. A place where every cup starts a conversation — coming soon to Sri Lanka.
              </p>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 text-sm text-bean/70">
                <span className="font-sinhala">ආයුබෝවන්</span>
                <span className="text-filli">•</span>
                <span className="font-tamil">வணக்கம்</span>
                <span className="text-filli">•</span>
                <span>Hello</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#visit" className="btn btn-orange">
                  Get Notified <Arrow />
                </a>
                <a href="#menu" className="btn btn-line bg-cream/60 backdrop-blur-sm">Explore Menu</a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-bean/60 md:flex">
            Scroll to pour
            <span className="scroll-cue relative block h-12 w-px overflow-hidden bg-bean/15" />
          </div>
        </section>

        {/* 1 — the pour (300vh so the scroll drives the animation) */}
        <section data-scene="1" className="relative min-h-[300svh]">
          {STEPS.map((step) => (
            <div key={step.n} className="flex min-h-svh items-end px-5 pb-24 md:items-center md:px-10 md:pb-0">
              <Reveal className="panel max-w-md">
                <p className="eyebrow mb-4">Step {step.n}</p>
                <h2 className="headline text-5xl md:text-7xl">
                  {step.title} <em>{step.accent}</em>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-bean/75">{step.body}</p>
              </Reveal>
            </div>
          ))}
        </section>

        {/* 2 — reveal close-up */}
        <section data-scene="2" className="flex min-h-svh flex-col items-center justify-end px-5 pb-14 text-center">
          <Reveal>
            <p className="eyebrow mb-3">The home of</p>
            <h2 className="headline text-6xl md:text-8xl">
              Zafran <em>Karak.</em>
            </h2>
            <p className="mt-3 text-bean/65">Our signature since 1991.</p>
          </Reveal>
        </section>

        {/* 3 — story */}
        <section id="story" data-scene="3" className="flex min-h-svh items-end px-5 pb-16 md:items-center md:justify-end md:px-10 md:pb-0">
          <div className="panel max-w-xl">
            <Reveal>
              <p className="eyebrow mb-4">Tea N Talk · Estd 1991</p>
              <h2 className="headline text-4xl md:text-6xl">
                A chai culture <em>phenomenon.</em>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-bean/75">
                From Dubai to more than a dozen countries, FiLLi has turned a humble cup of chai into a global home for chai
                lovers — and a reminder that a good conversation is always closer than you think.
              </p>
            </Reveal>
            {/* brown stats band, as on fillicafe.com */}
            <Reveal delay={150}>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 rounded-3xl bg-bean p-6 text-cream md:p-8">
                {STATS.map((s) => (
                  <div key={s.k}>
                    <p className="headline text-4xl text-cream md:text-5xl">{s.k}</p>
                    <p className="mt-1 text-sm text-cream/70">{s.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4 — menu: solid sheet that slides over the 3D scene */}
        <section
          id="menu"
          data-scene="4"
          className="relative min-h-svh rounded-t-[2.5rem] bg-cream px-5 pt-20 pb-24 shadow-[0_-30px_60px_-20px_rgba(63,32,22,0.18)] md:px-10 md:pt-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <p className="eyebrow mb-4">What we&apos;ll be pouring</p>
                <h2 className="headline text-4xl md:text-6xl">
                  Chai &amp; <em>street bites.</em>
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <a href="https://fillicafe.com/menu" className="btn btn-line">
                  Full Menu <Arrow />
                </a>
              </Reveal>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MENU.map((m, i) => (
                <Reveal key={m.name} delay={(i % 3) * 90}>
                  <article className="group h-full overflow-hidden rounded-3xl bg-[#fbe3b0] shadow-[0_10px_30px_-12px_rgba(63,32,22,0.25)]">
                    <div className="relative aspect-[4/4] overflow-hidden">
                      <Image
                        src={m.img}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-center transition duration-700 group-hover:scale-105"
                      />
                      <span
                        className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          m.tag === "Signature" ? "bg-filli text-white" : "bg-white/85 text-bean"
                        }`}
                      >
                        {m.tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-black tracking-tight">{m.name}</h3>
                      <p className="mt-1 text-sm text-bean/65">{m.note}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs text-bean/50">
              Photos and items from the FiLLi menu at fillicafe.com. Sri Lanka menu to be announced at launch.
            </p>
          </div>
        </section>

        {/* 5 — visit / notify */}
        <section id="visit" data-scene="5" className="relative flex min-h-svh flex-col justify-end px-5 pb-10 md:justify-center md:px-10 md:pb-0">
          <div className="panel max-w-lg md:ml-auto">
            <Reveal>
              <p className="eyebrow mb-4">Coming soon</p>
              <h2 className="headline text-4xl md:text-6xl">
                Sri Lanka, your cup is <em>almost ready.</em>
              </h2>
              <p className="mt-5 mb-8 text-lg text-bean/75">
                Be the first to know when our doors open — and when the first Zafran Karak is poured on the island.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <NotifyForm />
            </Reveal>
          </div>

          <footer className="mt-16 flex flex-col items-start gap-4 border-t border-bean/15 pt-6 text-xs text-bean/60 md:absolute md:inset-x-10 md:bottom-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Image src="/img/filli-emblem-brown.png" alt="FiLLi Cafe — Tea N Talk, Estd 1991" width={48} height={48} />
              <span>© {new Date().getFullYear()} FiLLi Cafe · Tea N Talk since 1991</span>
            </div>
            <span>
              <a href="https://fillicafe.com" className="font-semibold text-filli underline-offset-4 hover:underline">fillicafe.com</a>

            </span>
          </footer>
        </section>
      </main>
    </>
  );
}
