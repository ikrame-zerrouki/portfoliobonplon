"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";

type Locale = "ar" | "fr" | "en";

// La page 404 est hors de page.tsx (pas de Header) : on lit la langue
// déjà appliquée sur <html> par le script de layout.tsx.
const translations: Record<
  Locale,
  {
    code: string;
    title: string;
    text: string;
    home: string;
    services: string;
    contact: string;
    lost: string;
  }
> = {
  fr: {
    code: "Erreur 404",
    title: "Cette page s'est égarée",
    text: "Le lien est peut-être incorrect ou la page a été déplacée. Pas d'inquiétude : retrouvons ensemble le bon chemin.",
    home: "Retour à l'accueil",
    services: "Nos services",
    contact: "Nous contacter",
    lost: "Page introuvable",
  },
  ar: {
    code: "خطأ 404",
    title: "هذه الصفحة ضلّت طريقها",
    text: "ربما كان الرابط غير صحيح أو تم نقل الصفحة. لا تقلق، سنعيدك إلى الطريق الصحيح.",
    home: "العودة للرئيسية",
    services: "خدماتنا",
    contact: "تواصل معنا",
    lost: "الصفحة غير موجودة",
  },
  en: {
    code: "Error 404",
    title: "This page has wandered off",
    text: "The link may be wrong or the page may have moved. No worries — let's find the right way together.",
    home: "Back to home",
    services: "Our services",
    contact: "Contact us",
    lost: "Page not found",
  },
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b18a42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f5]";

const css = `
@keyframes nf-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes nf-spin { to { transform: rotate(360deg); } }
@keyframes nf-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes nf-sheen { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(320%) skewX(-20deg); } }
@keyframes nf-twinkle { 0%, 100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }
.nf-rise { animation: nf-rise .9s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
.nf-spin { animation: nf-spin 24s linear infinite; }
.nf-float { animation: nf-float 6s ease-in-out infinite; }
.nf-twinkle { animation: nf-twinkle 4s ease-in-out infinite; animation-delay: var(--d, 0ms); }
.group:hover .nf-sheen { animation: nf-sheen .9s ease-out; opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .nf-rise, .nf-spin, .nf-float, .nf-twinkle { animation: none; }
  .nf-sheen { display: none; }
}
`;

export default function NotFound() {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const lang = document.documentElement.lang as Locale;
    if (lang in translations) setLocale(lang);
  }, []);

  const t = translations[locale];
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

  return (
    <main
      id="main"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-viva-cream px-5 py-16 text-center"
    >
      <style>{css}</style>

      {/* Décors : points, lueurs dorées et rosées, filets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 [background-image:radial-gradient(rgba(177,138,66,0.2)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-[#efe3c8]/80 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -end-32 -z-10 h-[460px] w-[460px] rounded-full bg-viva-blush/80 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b18a42]/50 to-transparent"
      />

      {/* Étoiles */}
      {[
        "start-[12%] top-[22%]",
        "end-[14%] top-[30%]",
        "start-[22%] bottom-[18%]",
        "end-[24%] bottom-[24%]",
      ].map((pos, i) => (
        <span
          key={pos}
          aria-hidden="true"
          style={d(i * 900)}
          className={`nf-twinkle pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#b18a42] shadow-[0_0_12px_2px_rgba(177,138,66,0.5)] ${pos}`}
        />
      ))}

      {/* Logo */}
      <Link
        href="/"
        aria-label="Viva Créative"
        className={`nf-rise group absolute start-5 top-5 flex items-center gap-3 rounded-full sm:start-8 sm:top-7 ${focusRing}`}
        style={d(0)}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e0c07c] via-[#B58A43] to-[#8a6428] font-serif text-[20px] leading-none text-white shadow-[0_8px_18px_-8px_rgba(138,100,40,0.8)] ring-1 ring-inset ring-white/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
          VC
        </span>
        <span className="hidden font-serif text-xl tracking-tight text-[#211f19] sm:block">
          Viva Créative
        </span>
      </Link>

      {/* Badge */}
      <p
        className="nf-rise mb-6 flex w-fit items-center gap-3 rounded-full border border-[#b18a42]/30 bg-[#b18a42]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#8a6a2f] backdrop-blur-sm"
        style={d(100)}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b18a42] opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#b18a42]" />
        </span>
        {t.code.toUpperCase()}
      </p>

      {/* 4 · boussole · 4 */}
      <div
        className="nf-rise flex items-center justify-center gap-2 sm:gap-4"
        style={d(200)}
        dir="ltr"
        role="img"
        aria-label="404"
      >
        <span
          aria-hidden="true"
          className="bg-gradient-to-b from-[#d9b872] via-[#b18a42] to-[#8a6428] bg-clip-text font-serif text-[120px] font-bold leading-none text-transparent sm:text-[190px] lg:text-[230px]"
        >
          4
        </span>

        <span
          aria-hidden="true"
          className="nf-float relative flex h-[104px] w-[104px] items-center justify-center sm:h-[164px] sm:w-[164px] lg:h-[198px] lg:w-[198px]"
        >
          {/* Anneaux : le « 0 » */}
          <span className="absolute inset-0 rounded-full border-[6px] border-[#b18a42]/80 shadow-[0_0_40px_-6px_rgba(177,138,66,0.6),inset_0_0_30px_-10px_rgba(177,138,66,0.5)] sm:border-[10px]" />
          <span className="nf-spin absolute inset-3 rounded-full border border-dashed border-[#b18a42]/50 sm:inset-5" />
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/70 to-[#f3ead6]/40" />
          <Compass
            strokeWidth={1.2}
            className="nf-spin relative h-12 w-12 text-[#b18a42] [animation-duration:18s] [animation-direction:reverse] sm:h-20 sm:w-20 lg:h-24 lg:w-24"
          />
        </span>

        <span
          aria-hidden="true"
          className="bg-gradient-to-b from-[#d9b872] via-[#b18a42] to-[#8a6428] bg-clip-text font-serif text-[120px] font-bold leading-none text-transparent sm:text-[190px] lg:text-[230px]"
        >
          4
        </span>
      </div>

      <h1
        className="nf-rise mt-6 max-w-2xl font-serif text-3xl leading-[1.15] tracking-tight text-[#211f19] sm:text-5xl"
        style={d(350)}
      >
        {t.title}
      </h1>

      <p
        className="nf-rise mt-5 max-w-md text-[15px] leading-7 text-[#6f6a5f]"
        style={d(450)}
      >
        {t.text}
      </p>

      {/* Actions */}
      <div
        className="nf-rise mt-9 flex flex-wrap items-center justify-center gap-3"
        style={d(550)}
      >
        <Link
          href="/"
          className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#c49a50] via-[#b18a42] to-[#9a783d] py-2 pe-2 ps-6 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(138,100,40,0.9)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-12px_rgba(138,100,40,1)] motion-reduce:hover:translate-y-0 ${focusRing}`}
        >
          <span
            aria-hidden="true"
            className="nf-sheen pointer-events-none absolute inset-y-0 start-0 w-1/3 -translate-x-[120%] bg-white/30 opacity-0 blur-md"
          />
          <span className="relative">{t.home}</span>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-[#9a783d]">
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            />
          </span>
        </Link>

        <Link
          href="/#services"
          className={`group inline-flex items-center gap-2 rounded-full border border-[#d9c7a0] bg-white/70 px-5 py-3 text-sm font-semibold text-[#8a6a2f] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b18a42] hover:bg-[#b18a42] hover:text-white motion-reduce:hover:translate-y-0 ${focusRing}`}
        >
          {t.services}
          <ArrowUpRight size={15} className="rtl:-scale-x-100" />
        </Link>

        <Link
          href="/#contact"
          className={`group inline-flex items-center gap-2 rounded-full border border-[#d9c7a0] bg-white/70 px-5 py-3 text-sm font-semibold text-[#8a6a2f] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b18a42] hover:bg-[#b18a42] hover:text-white motion-reduce:hover:translate-y-0 ${focusRing}`}
        >
          {t.contact}
          <ArrowUpRight size={15} className="rtl:-scale-x-100" />
        </Link>
      </div>

      <p
        className="nf-rise mt-12 text-xs tracking-wide text-[#a18145]/80"
        style={d(700)}
      >
        {t.lost}
      </p>
    </main>
  );
}
