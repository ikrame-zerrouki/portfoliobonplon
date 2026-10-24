"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  FileText,
  Megaphone,
  PenLine,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  featured?: boolean;
};

const services: Service[] = [
  {
    icon: Code2,
    title: "Développement Web",
    description:
      "Sites vitrines, plateformes, boutiques en ligne, bases de données et applications web.",
    featured: true,
  },
  {
    icon: PenLine,
    title: "Design Graphique",
    description:
      "Identité visuelle, cartes de visite, infographies, visuels impactants.",
  },
  {
    icon: Megaphone,
    title: "Marketing Digital",
    description:
      "Gestion des réseaux sociaux, stratégies de contenu, acquisition client.",
  },
  {
    icon: FileText,
    title: "Création de Contenu",
    description: "Contenu web, réseaux sociaux, contenu marketing.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description:
      "Mise en place de boutiques en ligne, gestion de produits, accompagnement.",
  },
  {
    icon: Users,
    title: "Gestion de Projets & Formation",
    description:
      "Organisation de projets, formation dans nos domaines d’expertise.",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b18a42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f5]";

/** Passe à true une seule fois, quand l'élément entre dans l'écran. */
function useInView<T extends HTMLElement>(threshold = 0.15) {
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

export default function ServicesSection() {
  const [headRef, headSeen] = useInView<HTMLDivElement>();
  const [gridRef, gridSeen] = useInView<HTMLUListElement>(0.08);

  const reveal = (seen: boolean) =>
    `transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`;

  return (
    <section
      id="services"
      className="relative scroll-mt-20 overflow-hidden bg-[#faf9f5] px-5 py-14 sm:px-8 sm:py-16 lg:px-12"
    >
      {/* Lueurs d'ambiance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-[#efe3c8]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-[#f1e6cc]/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* En-tête centré */}
        <div ref={headRef} className={`relative text-center ${reveal(headSeen)}`}>
          <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-[#a18145]">
            <span className="h-px w-8 bg-[#b18a42]" />
            NOS SERVICES
            <span className="h-px w-8 bg-[#b18a42]" />
          </p>

          <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-[1.15] text-[#211f19] sm:text-[40px]">
            Des services complets pour votre réussite
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#6f6a5f]">
            De la création de votre présence en ligne à la gestion de votre
            image de marque, nous vous accompagnons à chaque étape de votre
            projet.
          </p>

          <Link
            href="/#contact"
            className={`mt-6 inline-flex items-center gap-2 rounded-md text-xs font-semibold text-[#a18145] transition-colors hover:text-[#80602d] lg:absolute lg:bottom-1 lg:end-0 lg:mt-0 ${focusRing}`}
          >
            Voir tous les services
            <ArrowRight size={14} className="rtl:-scale-x-100" />
          </Link>
        </div>

        {/* Grille bento */}
        <ul
          ref={gridRef}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const { icon: Icon, title, description, featured } = service;

            return (
              <li
                key={title}
                className={reveal(gridSeen)}
                style={{ transitionDelay: gridSeen ? `${index * 90}ms` : "0ms" }}
              >
                <article
                  onPointerMove={trackPointer}
                  className={`group relative flex h-full min-h-[180px] flex-col overflow-hidden rounded-2xl border p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${
                    featured
                      ? "border-[#b18a42]/40 bg-[#15140f] text-white hover:border-[#d9b872] hover:shadow-[0_28px_60px_-30px_rgba(21,20,15,0.9)]"
                      : "border-[#ebe4d6] bg-white/85 hover:border-[#d6bf8d] hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(75,57,23,0.45)]"
                  }`}
                >
                  {/* Halo qui suit le curseur */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: featured
                        ? "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(217,184,114,0.22), transparent 65%)"
                        : "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(181,138,67,0.14), transparent 65%)",
                    }}
                  />

                  {/* Grande icône en filigrane */}
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1}
                    className={`pointer-events-none absolute -bottom-6 end-4 h-36 w-36 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transform-none ${
                      featured ? "text-[#b18a42]/15" : "text-[#b18a42]/[0.09]"
                    }`}
                  />

                  <div className="relative flex items-start gap-5">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        featured
                          ? "border-[#b18a42]/50 bg-[#b18a42]/10 text-[#e7c27a] group-hover:border-[#b18a42] group-hover:bg-[#b18a42] group-hover:text-white"
                          : "border-[#e8ddc6] bg-[#fbf8f0] text-[#b18a42] group-hover:border-[#b18a42] group-hover:bg-[#b18a42] group-hover:text-white"
                      }`}
                    >
                      <Icon size={24} strokeWidth={1.3} aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-serif text-[22px] leading-snug ${
                          featured ? "text-white" : "text-[#29271f]"
                        }`}
                      >
                        {title}
                      </h3>

                      <p
                        className={`mt-2 max-w-md text-[13.5px] leading-6 ${
                          featured ? "text-white/70" : "text-[#7a7468]"
                        }`}
                      >
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Lien étendu : toute la carte est cliquable */}
                  <Link
                    href="/#contact"
                    aria-label={`En savoir plus sur ${title}`}
                    className={`relative mt-auto inline-flex w-fit items-center gap-2 pt-5 text-xs font-semibold after:absolute after:-inset-[200px] after:content-[''] ${focusRing} ${
                      featured ? "text-[#e7c27a]" : "text-[#a18145]"
                    }`}
                  >
                    En savoir plus
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-300 ${
                        featured
                          ? "border-[#b18a42]/60 group-hover:bg-[#b18a42] group-hover:text-white"
                          : "border-[#d9c7a0] group-hover:border-[#b18a42] group-hover:bg-[#b18a42] group-hover:text-white"
                      }`}
                    >
                      <ArrowRight
                        size={14}
                        className="rtl:-scale-x-100"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
