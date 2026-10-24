import type { CSSProperties } from "react";
import Image from "next/image";
import { Dancing_Script } from "next/font/google";
import {
  ArrowRight,
  Gem,
  Heart,
  Lightbulb,
  MessageCircle,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import Header from "./components/Header";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import WhatsAppFloat from "./components/WhatsAppFloat";

// Police manuscrite pour le texte sur l'image et le mot « succès »
const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

// ⚠️ Remplacez par votre numéro (format international, sans + ni espaces)
const WHATSAPP_URL = "https://wa.me/213000000000";

const features = [
  { icon: Rocket, label: ["Solutions", "sur mesure"] },
  { icon: Gem, label: ["Une équipe", "passionnée"] },
  { icon: ShieldCheck, label: ["Un accompagnement", "complet"] },
  { icon: Lightbulb, label: ["Résultats", "concrets"] },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b18a42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f5]";

/** Délai d'apparition propre à chaque élément */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Animations jouées au chargement (CSS pur : la page reste un composant serveur)
const heroCss = `
@keyframes vc-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes vc-zoom { from { transform: scale(1.1); } to { transform: scale(1); } }
@keyframes vc-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes vc-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes vc-sheen { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(320%) skewX(-20deg); } }
@keyframes vc-twinkle { 0%, 100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }
.vc-rise { animation: vc-rise .9s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
.vc-zoom { animation: vc-zoom 1.8s cubic-bezier(.2,.7,.2,1) both; }
.vc-draw { stroke-dasharray: 1; animation: vc-draw 1.1s ease-out 1s both; }
.vc-float { animation: vc-float 6s ease-in-out 1.6s infinite; }
.vc-twinkle { animation: vc-twinkle 4s ease-in-out infinite; animation-delay: var(--d, 0ms); }
.group:hover .vc-sheen { animation: vc-sheen .9s ease-out; opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .vc-rise, .vc-zoom, .vc-draw, .vc-float, .vc-twinkle { animation: none; }
  .vc-draw { stroke-dashoffset: 0; }
  .vc-sheen { display: none; }
}
`;

export default function HomePage() {
  return (
    <>
      <style>{heroCss}</style>

      <Header />

      <main id="main">
        {/* 1. الواجهة الرئيسية */}
        <section
          id="accueil"
          className="relative overflow-hidden bg-[#faf9f5]"
        >
          {/* Motif de points très discret */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(177,138,66,0.18)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_20%_40%,black_20%,transparent_70%)]"
          />

          {/* Lueurs dorées en arrière-plan */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#efe3c8]/80 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-52 start-1/3 h-[420px] w-[420px] rounded-full bg-[#f1e6cc]/70 blur-3xl"
          />

          {/* Étoiles décoratives (desktop) */}
          {[
            { pos: "start-[6%] top-[18%]", d: 0 },
            { pos: "start-[40%] top-[10%]", d: 1200 },
            { pos: "start-[44%] bottom-[14%]", d: 2400 },
          ].map(({ pos, d }) => (
            <span
              key={pos}
              aria-hidden="true"
              style={delay(d)}
              className={`vc-twinkle pointer-events-none absolute hidden h-1.5 w-1.5 rounded-full bg-[#b18a42] shadow-[0_0_12px_2px_rgba(177,138,66,0.5)] lg:block ${pos}`}
            />
          ))}

          <div className="relative mx-auto flex max-w-[1440px] flex-col lg:min-h-[584px] lg:flex-row lg:items-center">
            {/* النص — الجزء العلوي يترك مكانًا للـ Header الذي يتداخل مع الصفحة */}
            <div className="relative z-10 px-5 pb-10 pt-[116px] sm:px-8 lg:w-[48%] lg:px-12 lg:pb-14 lg:pt-[140px]">
              <p
                className="vc-rise mb-5 flex w-fit items-center gap-3 rounded-full border border-[#b18a42]/30 bg-[#b18a42]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#8a6a2f] backdrop-blur-sm"
                style={delay(0)}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b18a42] opacity-70 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#b18a42]" />
                </span>
                AGENCE DIGITALE CRÉATIVE
              </p>

              <h1
                className="vc-rise font-serif text-[36px] leading-[1.15] tracking-tight text-[#201e19] sm:text-[46px] lg:text-[54px]"
                style={delay(120)}
              >
                Vos idées, notre
                <br className="hidden sm:block" /> créativité, votre{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span
                    className={`${script.className} bg-gradient-to-r from-[#b18a42] via-[#d9b872] to-[#9a783d] bg-clip-text text-[1.15em] font-medium text-transparent`}
                  >
                    succès.
                  </span>
                  {/* Trait doré qui se dessine sous le mot */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-3 w-full"
                  >
                    <path
                      d="M3 9 C 45 2, 125 2, 197 8"
                      pathLength={1}
                      fill="none"
                      stroke="#b18a42"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="vc-draw"
                    />
                  </svg>
                </span>
              </h1>

              <p
                className="vc-rise mt-6 max-w-lg border-s-2 border-[#b18a42]/40 ps-4 text-[15px] leading-7 text-[#5f5a50]"
                style={delay(300)}
              >
                Nous sommes une équipe passionnée qui combine la technologie,
                le design et le marketing pour créer des solutions digitales
                sur mesure.
              </p>

              <div
                className="vc-rise mt-8 flex flex-wrap items-center gap-3"
                style={delay(450)}
              >
                <a
                  href="#services"
                  className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#c49a50] via-[#b18a42] to-[#9a783d] py-2 pe-2 ps-6 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(138,100,40,0.9)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-12px_rgba(138,100,40,1)] motion-reduce:hover:translate-y-0 ${focusRing}`}
                >
                  {/* Reflet qui traverse le bouton au survol */}
                  <span
                    aria-hidden="true"
                    className="vc-sheen pointer-events-none absolute inset-y-0 start-0 w-1/3 -translate-x-[120%] bg-white/30 opacity-0 blur-md"
                  />
                  <span className="relative">Découvrir nos services</span>
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-[#9a783d]">
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                    />
                  </span>
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2.5 rounded-full border border-[#29271f]/20 bg-white/70 py-2 pe-2 ps-6 text-sm font-semibold text-[#29271f] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b18a42] hover:text-[#927037] hover:shadow-[0_14px_28px_-14px_rgba(177,138,66,0.6)] motion-reduce:hover:translate-y-0 ${focusRing}`}
                >
                  Parlons de votre projet
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25a244]/10 text-[#25a244] transition-colors duration-300 group-hover:bg-[#25a244] group-hover:text-white">
                    <MessageCircle size={17} aria-hidden="true" />
                  </span>
                </a>
              </div>

              <ul
                className="vc-rise mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4"
                style={delay(600)}
              >
                {features.map(({ icon: Icon, label }) => (
                  <li
                    key={label.join(" ")}
                    className="group flex items-center gap-3 rounded-2xl border border-[#e9dfc9] bg-white/60 px-3 py-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d6bf8d] hover:bg-white hover:shadow-[0_16px_30px_-20px_rgba(75,57,23,0.5)] motion-reduce:hover:translate-y-0"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8ddc6] bg-[#fbf8f0] text-[#b18a42] transition-colors duration-300 group-hover:border-[#b18a42] group-hover:bg-[#b18a42] group-hover:text-white">
                      <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                    </span>
                    <span className="text-[11px] leading-4 text-[#615b50]">
                      {label[0]}
                      <br />
                      {label[1]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* الصورة الرئيسية */}
            <div className="relative h-[320px] w-full sm:h-[420px] lg:absolute lg:inset-y-0 lg:end-0 lg:h-auto lg:w-[52%]">
              <div className="absolute inset-0 overflow-hidden lg:[clip-path:ellipse(105%_95%_at_var(--vc-x,100%)_50%)] rtl:[--vc-x:0%]">
                <div className="vc-zoom absolute inset-0">
                  <Image
                    src="/image/Espace%20de%20travail%20luxueux%20Viva%20Créative.png"
                    alt="Espace de travail créatif de Viva Créative"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {/* Profondeur + légère teinte dorée */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
                <div className="absolute inset-0 bg-[#b18a42]/10 mix-blend-soft-light" />
              </div>

              {/* Arc doré le long du bord incurvé (desktop) */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block rtl:-scale-x-100"
              >
                <path
                  d="M 10.7 0 A 105 95 0 0 0 10.7 100"
                  fill="none"
                  stroke="#b18a42"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(177,138,66,0.55))",
                  }}
                />
              </svg>

              {/* Texte manuscrit sur l'image */}
              <p
                className={`${script.className} vc-rise absolute end-6 top-6 -rotate-6 text-2xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:end-10 sm:top-10 sm:text-3xl`}
                style={delay(800)}
              >
                Créer.
                <br />
                Concevoir.
                <br />
                Développer.
                <br />
                <span className="inline-flex items-center gap-2">
                  Ensemble.
                  <Heart
                    size={18}
                    className="fill-[#e7c27a] text-[#e7c27a]"
                    aria-hidden="true"
                  />
                </span>
              </p>

              {/* Carte en verre : les trois piliers */}
              <div
                className="vc-rise absolute bottom-5 start-4 sm:bottom-7 sm:start-8 lg:start-[16%]"
                style={delay(950)}
              >
                <div className="vc-float flex items-center gap-3 rounded-2xl border border-white/25 bg-black/35 px-4 py-3 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d9b872] to-[#9a783d] font-serif text-base font-semibold text-[#15140f]">
                    V
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      Technologie · Design · Marketing
                    </span>
                    <span className="block text-xs text-[#d9b872]/90">
                      Des solutions digitales sur mesure
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filet doré en bas du Hero */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b18a42]/40 to-transparent"
          />
        </section>

        {/* 2. الخدمات */}
        <ServicesSection />

        {/* 3. من نحن */}
        <AboutSection />

        {/* 4. الأعمال والمشاريع */}
        <PortfolioSection />

        {/* 5. آراء العملاء */}
        <TestimonialsSection />

        {/* 6. التواصل */}
        <ContactSection />
      </main>

      {/* Bouton WhatsApp flottant */}
      <WhatsAppFloat href={WHATSAPP_URL} />
    </>
  );
}
