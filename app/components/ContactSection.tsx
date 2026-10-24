"use client";

import Image from "next/image";
import Link from "next/link";
import { Dancing_Script, Fraunces } from "next/font/google";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Heart,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Une seule surface, une seule palette : contact + formulaire + footer      */
/*                                                                            */
/*  Fond #15140f · or #b18a42 · or clair #e7c27a · or doux #c5a66b            */
/*  Verre : bg-white/[0.04] + bordure white/10 (cartes, lignes, champs)       */
/*  Rayons : carte 3xl · ligne xl · champ lg · bouton/puce full               */
/* -------------------------------------------------------------------------- */

const display = Fraunces({ subsets: ["latin"], display: "swap" });

const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e7c27a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15140f]";

const container = "mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12";

/* -------------------------------------------------------------------------- */
/*                                   Données                                  */
/* -------------------------------------------------------------------------- */

const SITE_NAME = "Viva Créative";

type ContactItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  /** Valeur copiée dans le presse-papiers (bouton « Copier ») */
  copyValue?: string;
};

// ⚠️ Remplacez par vos vraies coordonnées et vos vrais liens
const contactInfo: ContactItem[] = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+213 556 12 34 56",
    href: "https://wa.me/213556123456",
    copyValue: "+213556123456",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@vivacreative.dz",
    href: "mailto:contact@vivacreative.dz",
    copyValue: "contact@vivacreative.dz",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Alger, Algérie",
  },
];
// Icônes de marques en SVG intégré (lucide-react ne les fournit plus)
const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/",
    path: "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

/* -------------------------------------------------------------------------- */
/*                         Apparition (une seule fois)                        */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-700 ease-out motion-reduce:opacity-100 motion-reduce:transition-none ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       Ligne de contact + bouton copier                     */
/* -------------------------------------------------------------------------- */

function ContactRow({ icon: Icon, label, value, href, copyValue }: ContactItem) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleCopy() {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible : on ignore silencieusement
    }
  }

  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b18a42]/15 text-[#e7c27a] ring-1 ring-[#b18a42]/40 transition-colors duration-300 group-hover:bg-[#b18a42] group-hover:text-[#15140f]">
        <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#c5a66b]">{label}</span>
        <span className="mt-0.5 block truncate text-sm text-white/90">
          {value}
        </span>
      </span>
    </>
  );

  const mainClass = "flex min-w-0 flex-1 items-center gap-4 rounded-lg";
  const isExternal = href?.startsWith("http");

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition-colors duration-300 hover:border-[#b18a42]/60 hover:bg-white/[0.07] motion-reduce:transition-none">
      {href ? (
        <a
          href={href}
          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
          className={`${mainClass} ${ring}`}
        >
          {inner}
          <ArrowUpRight
            size={18}
            aria-hidden="true"
            className="shrink-0 text-white/30 transition-colors duration-300 group-hover:text-[#e7c27a] rtl:-scale-x-100"
          />
        </a>
      ) : (
        <div className={mainClass}>{inner}</div>
      )}

      {copyValue && (
        <>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copier : ${label}`}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-200 hover:border-[#b18a42] hover:text-[#e7c27a] ${ring}`}
          >
            {copied ? (
              <Check size={15} aria-hidden="true" className="text-emerald-400" />
            ) : (
              <Copy size={15} aria-hidden="true" />
            )}
          </button>
          <span role="status" className="sr-only">
            {copied ? "Copié dans le presse-papiers" : ""}
          </span>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Formulaire (même verre sombre)                     */
/* -------------------------------------------------------------------------- */

// Pointez cette variable vers votre propre API si besoin
// (ex. NEXT_PUBLIC_CONTACT_ENDPOINT=https://api.exemple.dz/contact)
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";
const MESSAGE_MAX = 1000;

type Status = "idle" | "sending" | "success" | "error";

const cardClass =
  "rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-9";

const labelClass = "mb-1.5 block text-sm font-medium text-white/85";

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.05] py-3 pe-3.5 text-sm text-white [color-scheme:dark] placeholder:text-white/35 transition-colors duration-200 hover:border-white/25 focus:border-[#b18a42] focus:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-[#b18a42]/20";

const iconClass =
  "pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-white/35";

function Required() {
  return (
    <span aria-hidden="true" className="text-[#e7c27a]">
      {" "}
      *
    </span>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  // Place le focus sur le message de confirmation (lecteurs d'écran + clavier)
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Champ piège anti-spam : un humain ne le remplit jamais
    if (formData.get("website")) {
      setStatus("success");
      return;
    }

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    setStatus("sending");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      setMessage("");
      setStatus("success");
    } catch {
      // Les valeurs saisies sont conservées pour permettre un nouvel essai
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={`${cardClass} py-12 text-center outline-none`}
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#b18a42]/15 text-[#e7c27a] ring-8 ring-[#b18a42]/10">
          <CheckCircle2 size={30} strokeWidth={1.6} aria-hidden="true" />
        </span>

        <h3 className={`${display.className} mt-6 text-2xl text-white`}>
          Merci, message bien reçu !
        </h3>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-white/70">
          Votre demande a bien été envoyée. Nous vous répondons très vite.
        </p>

        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={`mt-7 inline-flex items-center rounded-full border border-[#b18a42]/50 px-5 py-2.5 text-xs font-semibold text-[#e7c27a] transition-colors hover:bg-[#b18a42] hover:text-[#15140f] ${ring}`}
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cardClass}>
      <div className="mb-7">
        <h3 className={`${display.className} text-2xl text-white`}>
          Parlons de votre projet
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Remplissez le formulaire, nous revenons vers vous rapidement.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Nom complet
            <Required />
          </label>
          <div className="relative">
            <User size={16} aria-hidden="true" className={iconClass} />
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Votre nom"
              className={`${fieldClass} ps-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Numéro de téléphone
            <Required />
          </label>
          <div className="relative">
            <Phone size={16} aria-hidden="true" className={iconClass} />
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              pattern="[0-9+ ]{8,20}"
              title="Entrez un numéro valide, par exemple +213 556 12 34 56"
              placeholder="+213 5XX XX XX XX"
              className={`${fieldClass} ps-10`}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="mb-1.5 flex items-baseline justify-between">
            <label
              htmlFor="contact-message"
              className="text-sm font-medium text-white/85"
            >
              Votre message
              <Required />
            </label>
            <span
              aria-hidden="true"
              className={`text-xs tabular-nums transition-colors ${
                message.length > MESSAGE_MAX * 0.9
                  ? "text-[#f0a3a3]"
                  : "text-white/40"
              }`}
            >
              {message.length}/{MESSAGE_MAX}
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            maxLength={MESSAGE_MAX}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Décrivez votre projet en quelques mots…"
            className={`${fieldClass} ps-3.5 resize-none`}
          />
        </div>

        {/* Champ piège anti-spam, invisible */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-website">Site web</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={`group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#b18a42] px-6 py-3.5 text-sm font-semibold text-[#15140f] shadow-[0_14px_30px_-14px_rgba(177,138,66,0.9)] transition-colors duration-300 hover:bg-[#c29a50] disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-[#b18a42] ${ring}`}
      >
        {status === "sending" ? (
          <>
            <Loader2
              size={16}
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
            Envoi en cours…
          </>
        ) : (
          <>
            Envoyer ma demande
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          </>
        )}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/45">
        <Lock size={12} aria-hidden="true" />
        Vos informations restent confidentielles.
      </p>

      <div aria-live="polite" className="min-h-0">
        {status === "error" && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-200"
          >
            Votre message n’a pas pu être envoyé. Réessayez dans un instant ou
            contactez-nous directement par WhatsApp ou par email.
          </p>
        )}
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Section Contact                               */
/* -------------------------------------------------------------------------- */

function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#15140f] pb-6 pt-20 text-white sm:pb-10 sm:pt-28"
    >
      {/* Image qui s'estompe vers le fond : aucune coupure avec le footer */}
      <Image
        src="/images/contact.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-[0.14] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 -z-10 h-96 w-96 rounded-full bg-[#b18a42]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b18a42] to-transparent"
      />

      <Reveal className={container}>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_480px] lg:gap-20">
          {/* Texte et coordonnées */}
          <div>
            <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#b18a42]/40 bg-[#b18a42]/10 px-3.5 py-1.5 text-xs text-[#e7c27a]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Disponible pour de nouveaux projets
            </p>

            <h2
              id="contact-title"
              className={`${display.className} max-w-md text-4xl font-medium leading-[1.12] sm:text-5xl`}
            >
              Prêt(e) à donner vie à votre projet ?
            </h2>

            <p className="mt-6 max-w-md text-[15px] leading-7 text-white/70">
              Parlons de vos idées ! Que ce soit pour un site web, un design,
              une stratégie marketing ou une formation, nous sommes là pour
              vous accompagner.
            </p>

            <ul className="mt-9 grid max-w-md gap-3">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  <ContactRow {...item} />
                </li>
              ))}
            </ul>

            {/* Réseaux sociaux + signature */}
            <div className="mt-9 flex flex-col gap-7 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/80">Suivez-nous</p>

                <ul className="mt-3.5 flex flex-wrap gap-2.5">
                  {socials.map(({ label, href, path }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${label} (nouvel onglet)`}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-[#b18a42] hover:bg-[#b18a42] hover:text-[#15140f] motion-reduce:transition-none ${ring}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d={path} />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* L'unique touche expressive de la page */}
              <p
                className={`${script.className} -rotate-2 text-3xl leading-snug text-[#e7c27a]`}
              >
                Ensemble,
                <br />
                créons le digital
                <br />
                <span className="inline-flex items-center gap-2">
                  de demain
                  <Heart
                    size={18}
                    className="fill-[#e7c27a] text-[#e7c27a]"
                    aria-hidden="true"
                  />
                </span>
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <ContactForm />
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*              Footer : même fond, même largeur, dans la continuité          */
/* -------------------------------------------------------------------------- */

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#15140f] text-white">
      <div className={container}>
        {/* Signature typographique */}
        <p
          aria-hidden="true"
          className={`${display.className} pointer-events-none select-none overflow-hidden whitespace-nowrap text-center text-[clamp(2.5rem,11vw,9rem)] leading-[0.9] tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(177,138,66,0.3)] [mask-image:linear-gradient(to_bottom,black_25%,transparent)]`}
        >
          {SITE_NAME}
        </p>

        {/* Copyright et retour en haut */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 sm:flex-row">
          <p className="text-center text-xs text-white/50">
            © {year} {SITE_NAME}. Tous droits réservés.
          </p>

          <Link
            href="/#accueil"
            aria-label="Retour en haut de la page"
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#b18a42]/50 text-[#c5a66b] transition-colors duration-300 hover:bg-[#b18a42] hover:text-[#15140f] motion-reduce:transition-none ${ring}`}
          >
            <ArrowUp size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

export { ContactSection, Footer };

export default function ContactFooter() {
  return (
    <>
      <ContactSection />
      <Footer />
    </>
  );
}
