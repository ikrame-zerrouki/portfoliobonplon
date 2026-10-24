import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

// Remplacez par l'adresse réelle de votre site
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const siteName = "Viva Créative";
const siteTitle = "Viva Créative | Design et marketing digital";
const siteDescription =
  "Viva Créative donne vie à votre marque : identité visuelle, sites web, marketing digital et création de contenu.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "agence digitale",
    "design graphique",
    "développement web",
    "marketing digital",
    "création de contenu",
    "e-commerce",
    "Viva Créative",
  ],
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName,
    locale: "fr_FR",
    alternateLocale: ["ar_AR", "en_US"],
    title: siteTitle,
    description:
      "Identités fortes, sites élégants et stratégies digitales qui vous démarquent.",
    // Astuce : ajoutez app/opengraph-image.png (1200×630) et Next.js
    // l'utilisera automatiquement pour les aperçus WhatsApp, Facebook, LinkedIn…
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f5",
  colorScheme: "light",
};

/*
  Applique la langue choisie AVANT l'affichage de la page.
  Sans ce script, un visiteur arabe verrait d'abord la page en français (LTR)
  puis un « saut » vers l'arabe (RTL) une fois React chargé.
  La clé "vc-locale" est la même que dans Header.tsx.
*/
const localeScript = `(function(){try{var l=localStorage.getItem("vc-locale");if(l==="ar"||l==="fr"||l==="en"){var d=document.documentElement;d.lang=l;d.dir=l==="ar"?"rtl":"ltr"}}catch(e){}})();`;

// Données structurées : aide Google à identifier l'entreprise
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Langue par défaut = français (le contenu de la page est en français,
    // et Header.tsx démarre aussi en "fr"). Le script ci-dessus ajuste lang/dir
    // avant l'hydratation, d'où suppressHydrationWarning.
    <html
      lang="fr"
      dir="ltr"
      suppressHydrationWarning
      className={`${tajawal.variable} ${playfair.variable} scroll-smooth motion-reduce:scroll-auto`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>

      <body className="bg-viva-cream font-sans text-[#29271f] antialiased">
        {/* Lien d'évitement pour le clavier et les lecteurs d'écran */}
        <a
          href="#main"
          lang="fr"
          className="sr-only rounded-full bg-[#100f0b] px-5 py-3 text-sm font-semibold text-[#e7c27a] focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[101] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a66b]"
        >
          Aller au contenu principal
        </a>

        {/* Le Header et le <main id="main"> sont dans page.tsx.
            La barre de progression de lecture est gérée par Header.tsx. */}
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
