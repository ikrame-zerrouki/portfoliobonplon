"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";

// Remplacez ces exemples par de vrais témoignages de clients
const testimonials = [
  {
    name: "Sarah M.",
    role: "Fondatrice de Bloom",
    text: "Une équipe professionnelle, à l’écoute et très créative. Notre site web est exactement ce que nous voulions !",
  },
  {
    name: "Karim B.",
    role: "Gérant de TechStore",
    text: "Très bonne expérience, un travail rapide et soigné. Je recommande Viva Créative sans hésiter !",
  },
  {
    name: "Nadia L.",
    role: "Fondatrice de L’Atelier",
    text: "Une vraie valeur ajoutée pour notre marque. Créativité, professionnalisme et disponibilité. Merci !",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b18a42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f5]";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .replace(".", "")
    .slice(0, 2)
    .toUpperCase();
}

// Révèle un élément en douceur quand il entre dans l'écran
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export default function TestimonialsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const { ref: sectionRef, visible } = useReveal<HTMLDivElement>();

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // scrollLeft est négatif en RTL : on travaille en valeur absolue
    const offset = Math.abs(el.scrollLeft);
    const total = el.scrollWidth;
    const visibleWidth = el.clientWidth;

    const totalPages = Math.max(1, Math.round(total / visibleWidth));

    setCanPrev(offset > 4);
    setCanNext(offset + visibleWidth < total - 4);
    setPages(totalPages);
    setPage(Math.min(Math.round(offset / visibleWidth), totalPages - 1));
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  function behavior(): ScrollBehavior {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
  }

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;

    const isRtl = getComputedStyle(el).direction === "rtl";

    el.scrollBy({
      left: direction * (isRtl ? -1 : 1) * el.clientWidth,
      behavior: behavior(),
    });
  }

  function scrollToPage(index: number) {
    const el = scrollerRef.current;
    if (!el) return;

    const isRtl = getComputedStyle(el).direction === "rtl";

    el.scrollTo({
      left: (isRtl ? -1 : 1) * index * el.clientWidth,
      behavior: behavior(),
    });
  }

  const arrowClass = `flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e1d6bd] bg-white text-[#6f6a5f] shadow-sm transition-all duration-300 hover:border-[#b18a42] hover:bg-[#b18a42] hover:text-white hover:shadow-[0_10px_24px_-10px_rgba(177,138,66,0.7)] disabled:cursor-default disabled:opacity-40 disabled:shadow-none disabled:hover:border-[#e1d6bd] disabled:hover:bg-white disabled:hover:text-[#6f6a5f] ${focusRing}`;

  const reveal = (delay: string) =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${delay} ${
      visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    } motion-reduce:translate-y-0 motion-reduce:opacity-100`;

  return (
    <section
      id="temoignages"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#faf9f5] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      {/* Décors : halos dorés + motif de points */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-[#e9d5a1]/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#f3ead6]/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(#d9c9a3_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div
        ref={sectionRef}
        className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[320px_1fr] lg:gap-14"
      >
        {/* Texte */}
        <div className={reveal("delay-0")}>
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-[#a18145]">
            <span className="h-px w-8 bg-gradient-to-r from-[#b18a42] to-transparent" />
            TÉMOIGNAGES
          </p>

          <h2 className="font-serif text-4xl leading-[1.1] text-[#211f19] sm:text-5xl">
            Ils nous font{" "}
            <span className="relative inline-block italic text-[#b18a42]">
              confiance
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full"
              >
                <path
                  d="M2 8 C 50 2, 100 2, 198 7"
                  fill="none"
                  stroke="#c5a66b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="mt-7 text-sm leading-7 text-[#6f6a5f]">
            La satisfaction de nos clients est notre plus grande réussite.
            Voici quelques témoignages de ceux qui ont vécu l’expérience Viva
            Créative.
          </p>

          {/* Note globale */}
          <div className="mt-7 inline-flex items-center gap-4 rounded-2xl border border-[#ebe4d6] bg-white/80 px-5 py-3.5 shadow-sm backdrop-blur">
            <span className="font-serif text-3xl leading-none text-[#211f19]">
              5,0
            </span>
            <span className="flex flex-col gap-1">
              <span
                className="flex gap-0.5"
                role="img"
                aria-label="Note moyenne : 5 sur 5"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#b18a42] text-[#b18a42]"
                  />
                ))}
              </span>
              <span className="text-[11px] tracking-wide text-[#7a7468]">
                Clients satisfaits
              </span>
            </span>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canPrev}
              aria-label="Témoignages précédents"
              className={arrowClass}
            >
              <ChevronLeft size={18} className="rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canNext}
              aria-label="Témoignages suivants"
              className={arrowClass}
            >
              <ChevronRight size={18} className="rtl:-scale-x-100" />
            </button>

            {/* Indicateurs cliquables */}
            {pages > 1 && (
              <div className="ml-3 flex items-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToPage(i)}
                    aria-label={`Aller à la page ${i + 1}`}
                    aria-current={i === page ? "true" : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ${focusRing} ${
                      i === page
                        ? "w-7 bg-[#b18a42]"
                        : "w-2 bg-[#ddd2ba] hover:bg-[#c5a66b]"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Carrousel */}
        <div className={`min-w-0 ${reveal("delay-150")}`}>
          <div
            ref={scrollerRef}
            onScroll={update}
            role="region"
            aria-label="Témoignages de clients"
            tabIndex={0}
            className={`-my-6 flex min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth rounded-2xl px-1 py-6 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden ${focusRing}`}
          >
            {testimonials.map((item) => (
              <figure
                key={item.name}
                className="group relative flex shrink-0 basis-[88%] snap-start flex-col overflow-hidden rounded-2xl border border-[#ebe4d6] bg-white p-7 shadow-[0_2px_12px_-6px_rgba(33,31,25,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d9c593] hover:shadow-[0_24px_48px_-24px_rgba(177,138,66,0.55)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:basis-[calc((100%-20px)/2)] lg:basis-[calc((100%-40px)/3)]"
              >
                {/* Liseré doré */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-30 bg-gradient-to-r from-[#b18a42] via-[#e0c68a] to-[#b18a42] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:scale-x-100"
                />

                {/* Guillemet décoratif géant */}
                <Quote
                  aria-hidden="true"
                  size={110}
                  strokeWidth={1}
                  className="pointer-events-none absolute -right-3 -top-3 rotate-6 text-[#f3ead6] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105"
                />

                <span
                  className="relative flex gap-0.5"
                  role="img"
                  aria-label="Note : 5 sur 5"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-[#b18a42] text-[#b18a42]"
                    />
                  ))}
                </span>

                <blockquote className="relative mt-5 flex-1 font-serif text-[15px] italic leading-8 text-[#3d392f]">
                  “{item.text}”
                </blockquote>

                <span
                  aria-hidden="true"
                  className="relative mt-6 h-px w-full bg-gradient-to-r from-[#e6dcc4] via-[#efe7d3] to-transparent"
                />

                <figcaption className="relative mt-5 flex items-center gap-3.5">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f7eed8] to-[#e6d09b] font-serif text-sm text-[#7d5f26] ring-2 ring-white ring-offset-2 ring-offset-[#e6d9bb]"
                  >
                    {initials(item.name)}
                  </span>

                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[#29271f]">
                      {item.name}
                      <BadgeCheck
                        size={15}
                        className="shrink-0 text-[#b18a42]"
                        aria-label="Client vérifié"
                      />
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[#7a7468]">
                      {item.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

