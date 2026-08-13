import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import { GoogleTag } from "@/components/GoogleTag";
import { OrganizationSchema, WebSiteSchema, LocalBusinessSchema } from "@/components/StructuredData";
import { CotacaoModalProvider } from "@/components/CotacaoModal";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const SITE_URL = "https://www.ameliasaude.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Amélia Saúde — Planos empresariais e por adesão",
    template: "%s | Amélia Saúde",
  },
  description:
    "Operadora de planos de saúde empresariais e por adesão no Rio de Janeiro. Planos para MEI, pequenas e médias empresas, sindicatos, conselhos e associações profissionais.",
  keywords: [
    "planos de saúde",
    "planos empresariais",
    "Rio de Janeiro",
    "telemedicina",
    "rede credenciada",
    "coletivo por adesão",
    "operadora de planos",
    "sindicato",
    "conselho de classe",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico?v=2", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Amélia Saúde — Planos empresariais e por adesão",
    description:
      "Planos empresariais e por adesão no Rio de Janeiro: rede credenciada e atendimento sem burocracia, com contratação via entidades de classe.",
    url: SITE_URL,
    siteName: "Amélia Saúde",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amélia Saúde — Planos empresariais e por adesão",
    description:
      "Planos empresariais e por adesão no Rio de Janeiro: rede credenciada e atendimento sem burocracia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <LocalBusinessSchema />
      <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <GoogleTag />
        <CotacaoModalProvider>{children}</CotacaoModalProvider>
      </body>
    </html>
    </>
  );
}
