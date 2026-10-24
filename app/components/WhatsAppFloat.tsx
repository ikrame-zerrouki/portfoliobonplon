"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";

type Locale = "ar" | "fr" | "en";

// Textes selon la langue choisie dans le Header (lue sur <html lang>)
const translations: Record<
  Locale,
  {
    label: string;
    aria: string;
    message: string;
    bubbleTitle: string;
    bubbleText: string;
    bubbleCta: string;
    close: string;
  }
> = {
  fr: {
    label: "Discutons sur WhatsApp",
    aria: "Écrire à Viva Créative sur WhatsApp",
    message: "Bonjour Viva Créative, j'aimerais discuter d'un projet.",
    bubbleTitle: "Une question ou un projet ?",
    bubbleText: "Écrivez-nous sur WhatsApp, nous vous répondons avec plaisir.",
    bubbleCta: "Écrire maintenant",
    close: "Fermer le message",
  },
  ar: {
    label: "تحدّث معنا على واتساب",
    aria: "تواصل مع Viva Créative عبر واتساب",
    message: "مرحبًا Viva Créative، أودّ مناقشة مشروع.",
    bubbleTitle: "عندك سؤال أو مشروع؟",
    bubbleText: "راسلنا على واتساب وسنسعد بالرد عليك.",
    bubbleCta: "ابدأ المحادثة",
    close: "إغلاق الرسالة",
  },
  en: {
    label: "Let's chat on WhatsApp",
    aria: "Message Viva Créative on WhatsApp",
    message: "Hello Viva Créative, I'd like to discuss a project.",
    bubbleTitle: "A question or a project?",
    bubbleText: "Message us on WhatsApp — we'll be happy to help.",
    bubbleCta: "Start chatting",
    close: "Close message",
  },
};

/** Distance de défilement (px) à partir de laquelle le bouton apparaît */
const SHOW_AFTER = 400;
/** Délai avant l'apparition de la bulle d'accueil (ms) */
const BUBBLE_DELAY = 4000;
/** Durée d'affichage de la bulle si elle n'est pas fermée (ms) */
const BUBBLE_DURATION = 14000;
const BUBBLE_KEY = "vc-wa-bubble";

const RING_RADIUS = 30;

export default function WhatsAppFloat({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");

  const ringRef = useRef<SVGCircleElement>(null);
  const bubbleShown = useRef(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Apparition après un peu de défilement + anneau de progression de lecture
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setVisible(y > SHOW_AFTER);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      ringRef.current?.setAttribute("stroke-dashoffset", String(1 - ratio));
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

  // Suit la langue du site, même si elle change sans rechargement
  useEffect(() => {
    const read = () => {
      const lang = document.documentElement.lang as Locale;
      if (lang in translations) setLocale(lang);
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    return () => observer.disconnect();
  }, []);

  // Bulle d'accueil : une seule fois par session, sans insister
  useEffect(() => {
    if (!visible || bubbleShown.current) return;

    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(BUBBLE_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    if (dismissed) return;

    bubbleShown.current = true;
    showTimer.current = setTimeout(() => {
      setBubble(true);
      hideTimer.current = setTimeout(() => closeBubble(), BUBBLE_DURATION);
    }, BUBBLE_DELAY);
    // Pas de nettoyage ici : remonter en haut de la page ne doit pas annuler la bulle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Les minuteurs ne sont nettoyés qu'au démontage du composant
  useEffect(
    () => () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    },
    [],
  );

  function closeBubble() {
    clearTimeout(hideTimer.current);
    setBubble(false);
    try {
      sessionStorage.setItem(BUBBLE_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  }

  const t = translations[locale];
  const url = `${href}?text=${encodeURIComponent(t.message)}`;

  return (
    <div
      className={`fixed end-4 z-40 transition-[opacity,transform] duration-500 ease-out bottom-[max(1rem,env(safe-area-inset-bottom))] motion-reduce:transition-none sm:bottom-6 sm:end-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* Bulle d'accueil */}
      <div
        role="status"
        aria-hidden={!bubble}
        className={`absolute bottom-full end-0 mb-4 w-[260px] origin-bottom-right transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none rtl:origin-bottom-left sm:w-[290px] ${
          bubble
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#b18a42]/25 bg-white/95 p-4 shadow-[0_24px_50px_-20px_rgba(75,57,23,0.5)] backdrop-blur-md">
          {/* Filet doré en haut */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#b18a42] via-[#e7c27a] to-transparent"
          />

          <button
            type="button"
            onClick={closeBubble}
            tabIndex={bubble ? 0 : -1}
            aria-label={t.close}
            className="absolute end-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-[#8a6a2f]/70 transition-colors hover:bg-[#b18a42]/10 hover:text-[#8a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b18a42]"
          >
            <X size={15} />
          </button>

          <p className="pe-6 font-serif text-[17px] leading-snug text-[#211f19]">
            {t.bubbleTitle}
          </p>
          <p className="mt-1.5 text-[13px] leading-5 text-[#6f6a5f]">
            {t.bubbleText}
          </p>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeBubble}
            tabIndex={bubble ? 0 : -1}
            className="group/cta mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c49a50] via-[#b18a42] to-[#9a783d] py-1.5 pe-1.5 ps-4 text-xs font-semibold text-white shadow-[0_10px_22px_-10px_rgba(138,100,40,0.9)] transition-shadow hover:shadow-[0_14px_28px_-10px_rgba(138,100,40,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b18a42] focus-visible:ring-offset-2"
          >
            {t.bubbleCta}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/30">
              <ArrowUpRight size={13} className="rtl:-scale-x-100" />
            </span>
          </a>
        </div>

        {/* Petite pointe vers le bouton */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 end-8 h-3 w-3 rotate-45 border-b border-e border-[#b18a42]/25 bg-white/95"
        />
      </div>

      {/* Bouton principal */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.aria}
        tabIndex={visible ? 0 : -1}
        onClick={closeBubble}
        className="group flex items-center rounded-full bg-white/90 p-1.5 shadow-[0_18px_40px_-14px_rgba(18,140,74,0.55)] ring-1 ring-[#b18a42]/25 backdrop-blur-md transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-14px_rgba(18,140,74,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25a244] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f5] motion-reduce:hover:translate-y-0"
      >
        {/* Étiquette qui se déploie au survol / au focus (desktop) */}
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold text-[#29271f] opacity-0 transition-all duration-500 ease-out group-hover:max-w-[240px] group-hover:px-4 group-hover:opacity-100 group-focus-visible:max-w-[240px] group-focus-visible:px-4 group-focus-visible:opacity-100 motion-reduce:transition-none sm:block">
          {t.label}
        </span>

        {/* Pastille verte entourée de l'anneau de progression */}
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          {/* Halo qui pulse */}
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.4s] motion-reduce:animate-none"
          />

          {/* Anneau doré : progression de lecture de la page */}
          <svg
            aria-hidden="true"
            viewBox="0 0 64 64"
            className="pointer-events-none absolute -inset-1 h-16 w-16 -rotate-90 rtl:rotate-90"
          >
            <circle
              cx="32"
              cy="32"
              r={RING_RADIUS}
              fill="none"
              stroke="#b18a42"
              strokeOpacity="0.18"
              strokeWidth="2.5"
            />
            <circle
              ref={ringRef}
              cx="32"
              cy="32"
              r={RING_RADIUS}
              fill="none"
              stroke="#c49a50"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </svg>

          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2fd566] to-[#128c4a] text-white shadow-inner ring-1 ring-inset ring-white/30 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 motion-reduce:transform-none">
            <MessageCircle size={26} strokeWidth={1.8} aria-hidden="true" />
          </span>
        </span>
      </a>
    </div>
  );
}
