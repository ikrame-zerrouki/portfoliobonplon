"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

// Remplacez `href` par la page de chaque projet quand elle existera
// et ajoutez vos images dans public/images/portfolio/
const projects = [
  {
    title: "Site vitrine",
    category: "Entreprise locale",
    image: "/images/portfolio/site-vitrine.jpg",
    alt: "Site vitrine affiché sur un ordinateur portable",
    href: "/#contact",
    // Disposition bento sur grand écran (grille 4 colonnes × 2 lignes)
    layout: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Application mobile",
    category: "Service à la demande",
    image: "/images/portfolio/application-mobile.jpg",
    alt: "Application mobile présentée sur des smartphones",
    href: "/#contact",
    layout: "",
  },
  {
    title: "Identité visuelle",
    category: "Marque de mode",
    image: "/images/portfolio/identite-visuelle.jpg",
    alt: "Papeterie et carte de visite d’une marque de mode",
    href: "/#contact",
    layout: "",
  },
  {
    title: "Réseaux sociaux",
    category: "Restaurant",
    image: "/images/portfolio/reseaux-sociaux.jpg",
    alt: "Publications de réseaux sociaux pour un restaurant",
    href: "/#contact",
    layout: "lg:col-span-2",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b18a42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f5]";

/** Passe à true une seule fois, quand l'élément entre dans l'écran. */
function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, seen] as const;
}

/** Fait suivre le curseur par un halo doré dans la carte. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export default function PortfolioSection() {
  const [headRef, headSeen] = useInView<HTMLDivElement>();
  const [gridRef, gridSeen] = useInView<HTMLUListElement>(0.08);
  const [ctaRef, ctaSeen] = useInView<HTMLDivElement>(0.3);

  const reveal = (seen: boolean) =>
    `transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`;

  return (
    <section
      id="portfolio"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#faf9f5] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <style>{`
        @keyframes pf-sheen {
          from { transform: translateX(-120%) skewX(-20deg); }
          to { transform: translateX(320%) skewX(-20deg); }
        }
      `}</style>

      {/* Décors */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 -z-10 h-96 w-96 rounded-full bg-[#e9d5a1]/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-20 -z-10 h-80 w-80 rounded-full bg-[#efe3c8]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.3] [background-image:radial-gradient(#d9c9a3_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b18a42]/50 to-transparent"
      />

      <div className="mx-auto max-w-[1200px]">
        {/* En-tête */}
        <div
          ref={headRef}
          className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${reveal(headSeen)}`}
        >
          <div>
            <p className="mb-5 flex w-fit items-center gap-3 rounded-full border border-[#b18a42]/30 bg-[#b18a42]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#8a6a2f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b18a42]" />
              NOS RÉALISATIONS
            </p>

            <h2 className="max-w-2xl font-serif text-4xl leading-[1.1] tracking-tight text-[#211f19] sm:text-5xl">
              Des projets qui font{" "}
              <span className="relative inline-block bg-gradient-to-r from-[#b18a42] via-[#d9b872] to-[#9a783d] bg-clip-text italic text-transparent">
                la différence
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-2.5 w-full"
                >
                  <path
                    d="M2 8 C 50 2, 100 2, 198 7"
                    pathLength={1}
                    fill="none"
                    stroke="#c5a66b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      strokeDasharray: 1,
                      strokeDashoffset: headSeen ? 0 : 1,
                      transition: "stroke-dashoffset 1.1s ease-out 500ms",
                    }}
                  />
                </svg>
              </span>
            </h2>

            <p className="mt-7 max-w-xl border-s-2 border-[#b18a42]/40 ps-4 text-sm leading-7 text-[#6f6a5f]">
              Découvrez une sélection de nos réalisations. Chaque projet est
              une histoire unique, pensée pour répondre aux besoins spécifiques
              de nos clients.
            </p>
          </div>

          <Link
            href="/#portfolio"
            className={`group inline-flex w-fit items-center gap-3 rounded-full border border-[#d9c7a0] bg-white px-5 py-3 text-xs font-semibold text-[#8a6a2f] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b18a42] hover:bg-[#b18a42] hover:text-white hover:shadow-[0_12px_28px_-12px_rgba(177,138,66,0.7)] motion-reduce:hover:translate-y-0 ${focusRing}`}
          >
            Voir tout le portfolio
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          </Link>
        </div>

        {/* Projets : carrousel sur mobile, bento sur grand écran */}
        <ul
          ref={gridRef}
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 pt-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:h-[580px] lg:snap-none lg:grid-cols-4 lg:grid-rows-2 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <li
              key={project.title}
              className={`shrink-0 basis-[78%] snap-start sm:basis-[44%] lg:basis-auto lg:min-h-0 ${project.layout} ${reveal(gridSeen)}`}
              style={{ transitionDelay: gridSeen ? `${index * 110}ms` : "0ms" }}
            >
              <Link
                href={project.href}
                onPointerMove={trackPointer}
                aria-label={`${project.title} – ${project.category}`}
                className={`group relative block h-[320px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#efe6d0] via-[#e6d9b9] to-[#d9c597] shadow-[0_2px_14px_-6px_rgba(33,31,25,0.2)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(177,138,66,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:h-full ${focusRing}`}
              >
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 50vw, (min-width: 640px) 44vw, 78vw"
                      : "(min-width: 1024px) 25vw, (min-width: 640px) 44vw, 78vw"
                  }
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />

                {/* Voiles : lisibilité du texte + teinte dorée au survol */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#100f0b]/90 via-[#100f0b]/20 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#b18a42]/0 mix-blend-multiply transition-colors duration-500 group-hover:bg-[#b18a42]/25"
                />

                {/* Halo doré qui suit le curseur */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(231,194,122,0.28), transparent 65%)",
                  }}
                />

                {/* Reflet qui traverse la carte au survol */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 start-0 w-1/4 -translate-x-[120%] bg-white/20 opacity-0 blur-md group-hover:opacity-100 group-hover:[animation:pf-sheen_1s_ease-out] motion-reduce:hidden"
                />

                {/* Cadre intérieur fin */}
                <div
                  aria-hidden="true"
                  className="absolute inset-3 rounded-2xl border border-white/0 transition-colors duration-500 group-hover:border-white/30"
                />

                {/* Haut : catégorie + numéro */}
                <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-2">
                  <span className="truncate rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white backdrop-blur-md">
                    {project.category}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`font-serif leading-none text-white/35 transition-colors duration-500 group-hover:text-[#e7c27a] ${
                      index === 0 ? "text-5xl" : "text-3xl"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Bas : titre + action */}
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                  <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0 motion-reduce:translate-y-0">
                    <h3
                      className={`font-serif leading-tight text-white ${
                        index === 0 ? "text-2xl sm:text-3xl" : "text-xl"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <span className="mt-2 flex items-center gap-2 text-xs font-medium text-[#e7c27a] opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:opacity-100">
                      <span className="h-px w-6 bg-[#e7c27a]" />
                      Voir le projet
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#8a6a2f] shadow-lg transition-all duration-500 group-hover:rotate-45 group-hover:bg-gradient-to-br group-hover:from-[#d9b872] group-hover:to-[#9a783d] group-hover:text-white motion-reduce:transition-none motion-reduce:group-hover:rotate-0 rtl:group-hover:-rotate-45"
                  >
                    <ArrowUpRight size={18} className="rtl:-scale-x-100" />
                  </span>
                </div>

                {/* Filet doré qui se déploie en bas de carte */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#b18a42] via-[#e7c27a] to-transparent transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Bandeau d'appel à l'action */}
        <div
          ref={ctaRef}
          className={`relative mt-10 overflow-hidden rounded-3xl bg-[#100f0b] px-6 py-8 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 ${reveal(ctaSeen)}`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#b18a42]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-[#d9b872]/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b18a42] to-transparent"
          />
          {/* Grain léger */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative">
            <p className="font-serif text-2xl leading-snug text-white sm:text-3xl">
              Un projet en tête ?{" "}
              <span className="bg-gradient-to-r from-[#f1d596] to-[#d9b872] bg-clip-text italic text-transparent">
                Donnons-lui vie.
              </span>
            </p>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
              Parlons de vos idées et construisons ensemble une présence qui
              vous ressemble.
            </p>
          </div>

          <Link
            href="/#contact"
            className="group relative mt-7 inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#b18a42] to-[#d4b169] px-6 py-3 text-sm font-semibold text-[#100f0b] shadow-[0_14px_30px_-12px_rgba(177,138,66,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(212,177,105,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e7c27a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#100f0b] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:mt-0 lg:shrink-0"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-0 w-1/3 -translate-x-[120%] bg-white/40 opacity-0 blur-md group-hover:opacity-100 group-hover:[animation:pf-sheen_0.9s_ease-out] motion-reduce:hidden"
            />
            <span className="relative">Démarrer un projet</span>
            <ArrowRight
              size={16}
              className="relative transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
