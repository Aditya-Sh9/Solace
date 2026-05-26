import type { Metadata } from "next";
import { DM_Sans, Fraunces, Caveat, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Solace — a quiet companion",
  description: "A small, kind place to figure out how you actually feel.",
};

// Reads stored theme/mode from localStorage before first paint to prevent a flash.
// Runs synchronously, outside React, before hydration.
const themeScript = `(function(){try{
  var t=localStorage.getItem('solace-theme')||'sage';
  var m=localStorage.getItem('solace-mode')||'light';
  var h=document.documentElement;
  h.setAttribute('data-theme',t);
  h.setAttribute('data-mode',m);
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="sage"
      data-mode="light"
      className={`${dmSans.variable} ${fraunces.variable} ${caveat.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
