import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cinzel, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-cinzel",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-deva",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "ज्योतिषाचार्य विजय प्रकाश तिवारी | Astrologer Vijay Prakash Tiwari",
  description:
    "अनुभवी ज्योतिषाचार्य विजय प्रकाश तिवारी से कुंडली विश्लेषण, विवाह, करियर, ग्रह दोष एवं वास्तु परामर्श। ऑनलाइन बुकिंग एवं कॉल परामर्श मात्र ₹299 से।",
  keywords: [
    "ज्योतिष",
    "astrologer",
    "kundli",
    "vivah",
    "vastu",
    "Vijay Prakash Tiwari",
    "online jyotish consultation",
  ],
    openGraph: {
    title: "ज्योतिषाचार्य विजय प्रकाश तिवारी",
    description:
      "ज्योतिष मार्गदर्शन — जीवन में सही दिशा। ऑनलाइन परामर्श एवं बुकिंग।",
    type: "website",
    images: [{ url: "/images/maharaj-ji.jpg" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hi">
      <body
        className={`${cinzel.variable} ${devanagari.variable} bg-[#0d0906] text-amber-50 antialiased`}
      >
        <div id="google_translate_element" className="hidden" />
        {children}
      </body>
    </html>
  );
}
