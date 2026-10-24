"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Heart, Lightbulb, Rocket } from "lucide-react";

const advantages = [
  {
    icon: Lightbulb,
    title: "Créativité",
    description: "Des idées qui font la différence.",
  },
  {
    icon: Rocket,
    title: "Expertise",
    description: "Des compétences complémentaires.",
  },
  {
    icon: Heart,
    title: "Proximité",
    description: "Un accompagnement humain.",
  },
  {
    icon: BarChart3,
    title: "Résultats",
    description: "Votre réussite est notre priorité.",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b872] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15140f]";

/** Passe à true une seule fois, quand la section entre dans l'écran. */
function useInView<T extends HTMLElement>(threshold = 0.2) {
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

/** Carte de valeur avec halo doré qui suit la souris. */
function ValueCard({
  icon: Icon,
  title,
  description,
  index,
  seen,
}: {
  icon: (typeof advantages)[number]["icon"];
  title: string;
  description: string;
  index: number;
  seen: boolean;
}) {
  const onMove = (e: MouseEvent<HTMLLIElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <li
      onMouseMove={onMove}
      style={{ transitionDelay: seen ? `${300 + index * 110}ms` : "0ms" }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-sm transition-[opacity,transform,border-color,background-color] duration-700 ease-out hover:border-[#b18a42]/50 hover:bg-white/[0.06] motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        seen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
      }`}
    >
      {/* Spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(217,184,114,0.18), transparent 70%)",
        }}
      />

      {/* Numéro discret */}
      <span
        aria-hidden="true"
        className="absolute end-4 top-3 font-serif text-xs tracking-widest text-[#b18a42]/40 transition-colors duration-300 group-hover:text-[#d9b872]"
      >
        0{index + 1}
      </span>

      <div className="relative flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#b18a42]/60 bg-[#b18a42]/5 text-[#d9b872] transition-all duration-300 group-hover:rotate-[8deg] group-hover:border-[#d9b872] group-hover:bg-gradient-to-br group-hover:from-[#d9b872] group-hover:to-[#9a783d] group-hover:text-[#15140f] group-hover:shadow-[0_0_24px_-4px_rgba(217,184,114,0.7)]">
          <Icon size={21} strokeWidth={1.5} aria-hidden="true" />
        </span>

        <span>
          <h3 className="text-[15px] font-semibold text-white transition-colors duration-300 group-hover:text-[#e7c27a]">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-white/60">{description}</p>
        </span>
      </div>
    </li>
  );
}

export default function AboutSection() {
  const [sectionRef, seen] = useInView<HTMLElement>();
  const imageRef = useRef<HTMLDivElement>(null);

  // Apparition en fondu + glissement, avec un délai propre à chaque élément
  const rise = (delay: number) => ({
    className: `transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
    style: { transitionDelay: seen ? `${delay}ms` : "0ms" },
  });

  // Parallaxe douce de l'image selon la souris
  const onImageMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = imageRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--px", `${(x * -14).toFixed(1)}px`);
    el.style.setProperty("--py", `${(y * -14).toFixed(1)}px`);
  };

  const onImageLeave = () => {
    const el = imageRef.current;
    if (!el) return;
    el.style.setProperty("--px", "0px");
    el.style.setProperty("--py", "0px");
  };

  return (
    <section
      ref={sectionRef}
      id="apropos"
      className="relative scroll-mt-20 overflow-hidden bg-[#15140f] text-white"
    >
      <style>{`
        @keyframes about-spin { to { transform: rotate(360deg); } }
        @keyframes about-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes about-sheen {
          from { transform: translateX(-120%) skewX(-20deg); }
          to { transform: translateX(260%) skewX(-20deg); }
        }
        @keyframes about-twinkle {
          0%, 100% { opacity: .25; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .about-anim { animation: none !important; }
        }
      `}</style>

      {/* Texture : grain très léger */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Halos dorés */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#b18a42]/20 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[300px] w-[300px] rounded-full bg-[#d9b872]/10 blur-[100px]"
      />

      {/* Filet doré en haut de section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b18a42]/70 to-transparent"
      />

      {/* Étoiles décoratives */}
      {[
        "left-[8%] top-[12%]",
        "left-[30%] bottom-[10%]",
        "left-[46%] top-[8%]",
      ].map((pos, i) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`about-anim pointer-events-none absolute hidden h-1.5 w-1.5 rounded-full bg-[#d9b872] shadow-[0_0_12px_2px_rgba(217,184,114,0.7)] lg:block ${pos}`}
          style={{ animation: `about-twinkle ${3 + i}s ease-in-out ${i * 0.8}s infinite` }}
        />
      ))}

      <div className="relative mx-auto flex max-w-[1440px] flex-col lg:min-h-[480px] lg:flex-row">
        {/* Texte */}
        <div className="relative z-10 flex flex-col justify-center px-5 py-14 sm:px-8 lg:w-[36%] lg:px-12 lg:py-20">
          <p
            style={rise(0).style}
            className={`mb-5 flex w-fit items-center gap-3 rounded-full border border-[#b18a42]/30 bg-[#b18a42]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#d9b872] backdrop-blur-sm ${rise(0).className}`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d9b872] opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d9b872]" />
            </span>
            À PROPOS DE NOUS
          </p>

          <h2
            style={rise(120).style}
            className={`font-serif text-4xl leading-[1.12] tracking-tight sm:text-[50px] ${rise(120).className}`}
          >
            Une équipe,
            <br />
            une même{" "}
            <span className="relative inline-block bg-gradient-to-r from-[#f1d596] via-[#d9b872] to-[#b18a42] bg-clip-text italic text-transparent">
              vision.
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
                  className="motion-reduce:transition-none"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: seen ? 0 : 1,
                    transition: "stroke-dashoffset 1.1s ease-out 700ms",
                  }}
                />
              </svg>
            </span>
          </h2>

          <p
            style={rise(260).style}
            className={`mt-6 max-w-md border-s-2 border-[#b18a42]/40 ps-4 text-sm leading-7 text-white/70 ${rise(260).className}`}
          >
            Viva Créative est née de la rencontre de deux passions : la
            technologie et la créativité. Nous unissons nos compétences pour
            offrir des solutions digitales complètes, modernes et
            personnalisées.
          </p>

          <div style={rise(380).style} className={rise(380).className}>
            <Link
              href="/about"
              className={`group relative mt-8 inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#c49a50] via-[#b18a42] to-[#9a783d] py-2 pe-2 ps-6 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(181,138,67,0.9)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(217,184,114,0.9)] ${focusRing}`}
            >
              {/* Reflet qui traverse le bouton au survol */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 start-0 w-1/3 -translate-x-[120%] bg-white/30 opacity-0 blur-md group-hover:opacity-100 group-hover:[animation:about-sheen_0.9s_ease-out] motion-reduce:hidden"
              />
              <span className="relative">En savoir plus</span>
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-[#9a783d]">
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                />
              </span>
            </Link>
          </div>
        </div>

        {/* Image à bord courbe */}
        <div
          className="relative h-[340px] sm:h-[440px] lg:h-auto lg:w-[40%]"
          onMouseMove={onImageMove}
          onMouseLeave={onImageLeave}
        >
          <div className="absolute inset-0 lg:[clip-path:ellipse(100%_75%_at_100%_50%)]">
            <div
              ref={imageRef}
              className={`absolute -inset-4 transition-transform duration-[1600ms] ease-out motion-reduce:transform-none ${
                seen ? "scale-100" : "scale-110"
              }`}
            >
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out motion-reduce:transform-none"
                style={{
                  transform: "translate3d(var(--px, 0px), var(--py, 0px), 0)",
                }}
              >
                <Image
                  src="/image/b38b8be4-d2dd-4f89-8afd-f6a7671fde14.jpg"
                  alt="Un espace de travail créatif aux couleurs de Viva Créative"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            {/* Dégradés de profondeur + teinte dorée */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#15140f]/70 via-transparent to-[#15140f]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#15140f]/60 via-transparent to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-[#b18a42]/10 mix-blend-soft-light" />
          </div>

          {/* Arcs dorés (desktop) : l'arc principal et son écho */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          >
            <path
              d="M 33 0 A 100 75 0 0 0 33 100"
              fill="none"
              stroke="#b18a42"
              strokeOpacity="0.3"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 25.5 0 A 100 75 0 0 0 25.5 100"
              fill="none"
              stroke="#d9b872"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              style={{
                filter: "drop-shadow(0 0 6px rgba(217,184,114,0.6))",
              }}
            />
          </svg>

          {/* Médaillon rotatif */}
          <div
            style={rise(500).style}
            className={`absolute right-5 top-5 hidden sm:block lg:right-8 lg:top-8 ${rise(500).className}`}
          >
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-black/30 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <svg
                aria-hidden="true"
                viewBox="0 0 120 120"
                className="about-anim absolute inset-0 h-full w-full"
                style={{ animation: "about-spin 28s linear infinite" }}
              >
                <defs>
                  <path
                    id="about-circle"
                    d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                  />
                </defs>
                <text
                  fill="#d9b872"
                  fontSize="9.5"
                  letterSpacing="3.2"
                  fontWeight="600"
                >
                  <textPath href="#about-circle">
                    VIVA CRÉATIVE • DIGITAL • DESIGN •
                  </textPath>
                </text>
              </svg>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#d9b872] to-[#9a783d] font-serif text-lg font-semibold text-[#15140f] shadow-[0_0_24px_-2px_rgba(217,184,114,0.8)]">
                V
              </span>
            </div>
          </div>

          {/* Carte : deux passions, une vision */}
          <div
            style={rise(600).style}
            className={`absolute bottom-5 left-4 lg:left-[30%] ${rise(600).className}`}
          >
            <div
              className="about-anim flex items-center gap-3 rounded-2xl border border-white/20 bg-black/35 py-3 pe-5 ps-3 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
              style={{ animation: "about-float 6s ease-in-out 1.5s infinite" }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 84 48"
                className="h-10 w-[70px] shrink-0"
              >
                {/* Les deux cercles se rapprochent et fusionnent */}
                <circle
                  cx="28"
                  cy="24"
                  r="19"
                  fill="#b18a42"
                  fillOpacity="0.28"
                  stroke="#d9b872"
                  strokeWidth="1.5"
                  className="motion-reduce:transition-none"
                  style={{
                    transform: seen ? "translateX(7px)" : "translateX(-6px)",
                    transition: "transform 1.4s ease-out 900ms",
                  }}
                />
                <circle
                  cx="56"
                  cy="24"
                  r="19"
                  fill="#ffffff"
                  fillOpacity="0.1"
                  stroke="#ffffff"
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                  className="motion-reduce:transition-none"
                  style={{
                    transform: seen ? "translateX(-7px)" : "translateX(6px)",
                    transition: "transform 1.4s ease-out 900ms",
                  }}
                />
              </svg>

              <span>
                <span className="block text-sm font-semibold text-white">
                  Technologie × Créativité
                </span>
                <span className="block text-xs text-[#d9b872]/90">
                  Deux passions, une vision
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <ul className="flex flex-col justify-center gap-3 bg-gradient-to-b from-[#100f0b] to-[#0c0b08] px-5 py-12 sm:grid sm:grid-cols-2 sm:px-8 lg:flex lg:w-[24%] lg:px-8 lg:py-14">
          {advantages.map((item, index) => (
            <ValueCard key={item.title} {...item} index={index} seen={seen} />
          ))}
        </ul>
      </div>

      {/* Filet doré en bas de section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b18a42]/50 to-transparent"
      />
    </section>
  );
}
