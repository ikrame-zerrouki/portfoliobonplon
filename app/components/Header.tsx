"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";

type Locale = "ar" | "fr" | "en";

const translations = {
  ar: {
    home: "الرئيسية",
    services: "خدماتنا",
    portfolio: "أعمالنا",
    about: "من نحن",
    contact: "تواصل معنا",
    start: "ابدأ مشروعك",
    tagline: "تصميم وتسويق رقمي",
    direction: "rtl" as const,
    menu: "القائمة",
    open: "فتح القائمة",
    close: "إغلاق القائمة",
    language: "اللغة",
    logoLabel: "Viva Créative - الصفحة الرئيسية",
  },
  fr: {
    home: "Accueil",
    services: "Services",
    portfolio: "Réalisations",
    about: "À propos",
    contact: "Contact",
    start: "Démarrer un projet",
    tagline: "Design et marketing digital",
    direction: "ltr" as const,
    menu: "Menu",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
    language: "Langue",
    logoLabel: "Viva Créative - Accueil",
  },
  en: {
    home: "Home",
    services: "Services",
    portfolio: "Our work",
    about: "About us",
    contact: "Contact",
    start: "Start a project",
    tagline: "Design and digital marketing",
    direction: "ltr" as const,
    menu: "Menu",
    open: "Open menu",
    close: "Close menu",
    language: "Language",
    logoLabel: "Viva Créative - Home",
  },
};

const languages: { code: Locale; short: string; name: string }[] = [
  { code: "ar", short: "ع", name: "العربية" },
  { code: "fr", short: "FR", name: "Français" },
  { code: "en", short: "EN", name: "English" },
];

// Même ordre que les sections de la page : Accueil → Services → À propos → Réalisations → Contact
const sections = [
  { id: "accueil", key: "home" },
  { id: "services", key: "services" },
  { id: "apropos", key: "about" },
  { id: "portfolio", key: "portfolio" },
  { id: "contact", key: "contact" },
] as const;

const STORAGE_KEY = "vc-locale";

const focusLight =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58A43] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f5]";
const focusDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b872] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15140f]";

/* ------------------------------------------------------------------ */
/* Sélecteur de langue avec curseur coulissant                         */
/* ------------------------------------------------------------------ */

function LanguageSwitch({
  locale,
  onChange,
  label,
  variant,
}: {
  locale: Locale;
  onChange: (lang: Locale) => void;
  label: string;
  variant: "compact" | "wide";
}) {
  const index = languages.findIndex((l) => l.code === locale);
  const wide = variant === "wide";

  return (
    <div
      role="group"
      aria-label={label}
      className={`relative flex rounded-full border p-1 ${
        wide
          ? "w-full border-white/15 bg-white/5"
          : "w-[140px] border-[#e5ddce] bg-white/70 backdrop-blur"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute bottom-1 top-1 rounded-full shadow-sm transition-[inset-inline-start] duration-300 ease-out motion-reduce:transition-none ${
          wide
            ? "bg-gradient-to-r from-[#c49a50] to-[#9A783D]"
            : "bg-gradient-to-br from-[#2c2a22] to-[#15140f]"
        }`}
        style={{
          width: "calc((100% - 0.5rem) / 3)",
          insetInlineStart: `calc(0.25rem + ${index} * (100% - 0.5rem) / 3)`,
        }}
      />

      {languages.map((lang) => {
        const active = locale === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            aria-label={lang.name}
            aria-pressed={active}
            lang={lang.code}
            className={`relative z-10 flex-1 rounded-full text-center font-semibold transition-colors ${
              wide ? "py-2 text-sm" : "py-1.5 text-xs"
            } ${wide ? focusDark : focusLight} ${
              active
                ? "text-white"
                : wide
                  ? "text-white/70 hover:text-white"
                  : "text-[#6b665b] hover:text-[#171717]"
            }`}
          >
            {wide ? lang.name : lang.short}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Monogramme                                                          */
/* ------------------------------------------------------------------ */

function Monogram() {
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
      {/* Anneau doré qui apparaît au survol du logo */}
      <span
        aria-hidden="true"
        className="absolute -inset-1 rounded-full border border-[#d9b872]/0 transition-all duration-500 group-hover:-inset-1.5 group-hover:border-[#d9b872]/70"
      />
      <span
        aria-hidden="true"
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e0c07c] via-[#B58A43] to-[#8a6428] font-serif text-[20px] leading-none text-white shadow-[0_8px_18px_-8px_rgba(138,100,40,0.8)] ring-1 ring-inset ring-white/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
      >
        VC
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("accueil");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  const progressRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const t = translations[locale];

  const links = sections.map((s) => ({
    id: s.id,
    label: t[s.key],
    href: `/#${s.id}`,
  }));

  const targetId = hoverId ?? activeId;

  /* ---------- Langue ---------- */

  const applyLanguage = useCallback((lang: Locale) => {
    setLocale(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = translations[lang].direction;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && saved in translations) applyLanguage(saved);
    } catch {
      /* storage unavailable */
    }
  }, [applyLanguage]);

  /* ---------- Défilement : capsule flottante + barre de progression ---------- */

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        const ratio = max > 0 ? Math.min(y / max, 1) : 0;
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* ---------- Section visible = lien actif ---------- */

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ---------- Pastille coulissante derrière les liens ---------- */

  const measure = useCallback(() => {
    const el = linkRefs.current[targetId];
    if (!el) return;
    setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [targetId]);

  useEffect(() => {
    measure();
  }, [measure, locale]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* ---------- Menu mobile ---------- */

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  /* ---------------------------------------------------------------- */

  return (
    <>
      {/* Barre de progression de lecture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]"
      >
        <div
          ref={progressRef}
          className="h-full origin-left bg-gradient-to-r from-[#8a6428] via-[#d9b872] to-[#B58A43] shadow-[0_0_10px_rgba(217,184,114,0.7)] will-change-transform rtl:origin-right"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/*
        -mb-[84px] : le header chevauche le haut de la page. Les lueurs du Hero
        continuent donc derrière la barre de navigation, sans coupure.
      */}
      <header
        dir={t.direction}
        className="pointer-events-none sticky top-0 z-50 -mb-[84px] flex h-[84px] items-center px-3 sm:px-5"
      >
        {/* Voile léger côté image : garde les liens lisibles sans casser la teinte du Hero */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-[#faf9f5]/70 via-[#faf9f5]/30 to-transparent transition-opacity duration-500 [mask-image:linear-gradient(to_right,transparent_30%,black_65%)] rtl:[mask-image:linear-gradient(to_left,transparent_30%,black_65%)] ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        />

        <nav
          aria-label="Main navigation"
          className={`pointer-events-auto relative mx-auto flex w-full items-center justify-between gap-4 rounded-full border transition-all duration-500 ease-out motion-reduce:transition-none ${
            scrolled
              ? "h-16 max-w-[1120px] border-[#e2cfa2]/70 bg-[#faf9f5]/80 px-3 shadow-[0_18px_40px_-20px_rgba(70,50,15,0.35),0_0_0_1px_rgba(181,138,67,0.08)] backdrop-blur-xl sm:px-4"
              : "h-20 max-w-[1440px] border-transparent bg-transparent px-2 sm:px-4 lg:px-8"
          }`}
        >
          {/* Filet doré en haut de la capsule */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b872] to-transparent transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Logo */}
          <Link
            href="/"
            aria-label={t.logoLabel}
            className={`group flex shrink-0 items-center gap-3 rounded-full ${focusLight}`}
          >
            <Monogram />

            <span className="flex flex-col">
              <span className="font-serif text-xl leading-tight tracking-tight text-[#211f19] sm:text-[22px]">
                Viva Créative
              </span>
              <span
                className={`hidden overflow-hidden text-[11px] leading-tight text-[#8A744E] transition-all duration-300 sm:block ${
                  scrolled ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
                }`}
              >
                {t.tagline}
              </span>
            </span>
          </Link>

          {/* Navigation desktop avec pastille coulissante */}
          <ul
            className="relative hidden items-center lg:flex"
            onMouseLeave={() => setHoverId(null)}
          >
            <span
              aria-hidden="true"
              className={`absolute top-1/2 h-10 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#B58A43]/15 to-[#B58A43]/5 ring-1 ring-inset ring-[#B58A43]/30 transition-[left,width,opacity] duration-300 ease-out motion-reduce:transition-none ${
                pill.ready ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: pill.left, width: pill.width }}
            />

            {links.map((link) => {
              const active = activeId === link.id;
              return (
                <li key={link.id}>
                  <Link
                    ref={(el) => {
                      linkRefs.current[link.id] = el;
                    }}
                    href={link.href}
                    aria-current={active ? "location" : undefined}
                    onMouseEnter={() => setHoverId(link.id)}
                    onFocus={() => setHoverId(link.id)}
                    onBlur={() => setHoverId(null)}
                    className={`relative block rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${focusLight} ${
                      active ? "text-[#8a6428]" : "text-[#48443b]"
                    }`}
                  >
                    {link.label}
                    {/* Petit point doré sous le lien actif */}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#B58A43] transition-transform duration-300 motion-reduce:transition-none ${
                        active ? "scale-100" : "scale-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Langue + CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitch
              locale={locale}
              onChange={applyLanguage}
              label={t.language}
              variant="compact"
            />

            <Link
              href="/#contact"
              className={`group relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#c49a50] via-[#B58A43] to-[#9A783D] py-2.5 pe-2.5 ps-5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(138,100,40,0.9)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(138,100,40,1)] motion-reduce:hover:translate-y-0 ${focusLight}`}
            >
              {/* Reflet lumineux au survol */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden rtl:translate-x-full rtl:group-hover:-translate-x-full"
              />
              <span className="relative">{t.start}</span>
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-[#9A783D]">
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                />
              </span>
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e5ddce] bg-white/70 text-[#171717] backdrop-blur transition-colors hover:border-[#B58A43] hover:text-[#9A783D] lg:hidden ${focusLight}`}
            aria-label={t.open}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu size={21} />
          </button>
        </nav>
      </header>

      {/* Menu mobile plein écran (hors du header pour éviter le piège du backdrop-filter) */}
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
        dir={t.direction}
        className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#15140f] text-white transition-[opacity,visibility] duration-300 motion-reduce:transition-none lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Halos dorés décoratifs */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -top-32 end-[-6rem] h-72 w-72 rounded-full bg-[#B58A43]/25 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -bottom-32 -start-24 h-64 w-64 rounded-full bg-[#d9b872]/10 blur-[90px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none fixed -bottom-16 -end-6 select-none font-serif text-[260px] leading-none text-[#B58A43]/[0.07]"
        >
          VC
        </span>

        {/* Barre du haut */}
        <div className="relative flex h-[84px] shrink-0 items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            onClick={() => closeMenu()}
            aria-label={t.logoLabel}
            className={`group flex items-center gap-3 rounded-full ${focusDark}`}
          >
            <Monogram />
            <span className="font-serif text-xl tracking-tight">
              Viva Créative
            </span>
          </Link>

          <button
            ref={closeRef}
            type="button"
            onClick={() => closeMenu(true)}
            aria-label={t.close}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:rotate-90 hover:border-[#d9b872] hover:text-[#d9b872] motion-reduce:hover:rotate-0 ${focusDark}`}
          >
            <X size={21} />
          </button>
        </div>

        {/* Liens */}
        <nav
          aria-label="Mobile navigation"
          className="relative flex-1 px-5 pt-4 sm:px-8"
        >
          <ul className="mx-auto max-w-2xl">
            {links.map((link, i) => {
              const active = activeId === link.id;
              return (
                <li
                  key={link.id}
                  className={`border-b border-white/10 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                    menuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms",
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => closeMenu()}
                    aria-current={active ? "location" : undefined}
                    className={`group flex items-center justify-between gap-4 py-5 font-serif text-[32px] leading-none transition-colors ${focusDark} ${
                      active
                        ? "text-[#d9b872]"
                        : "text-white hover:text-[#d9b872]"
                    }`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className="font-serif text-xs tracking-widest text-[#B58A43]/70"
                      >
                        0{i + 1}
                      </span>
                      {link.label}
                    </span>
                    <ArrowUpRight
                      size={22}
                      className={`shrink-0 transition-all duration-300 rtl:-scale-x-100 ${
                        active
                          ? "text-[#d9b872]"
                          : "text-white/30 group-hover:translate-x-1 group-hover:text-[#d9b872]"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Langue + CTA */}
        <div
          className={`relative mx-auto flex w-full max-w-2xl shrink-0 flex-col gap-4 px-5 pb-8 pt-8 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none sm:px-8 ${
            menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: menuOpen ? "460ms" : "0ms" }}
        >
          <LanguageSwitch
            locale={locale}
            onChange={applyLanguage}
            label={t.language}
            variant="wide"
          />

          <Link
            href="/#contact"
            onClick={() => closeMenu()}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c49a50] via-[#B58A43] to-[#9A783D] px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(181,138,67,0.9)] ${focusDark}`}
          >
            {t.start}
            <ArrowUpRight size={17} className="rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </>
  );
}
