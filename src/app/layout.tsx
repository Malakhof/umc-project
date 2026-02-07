import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "УМЦ Калужского облсовпрофа — Обучение по охране труда",
  description:
    "Аккредитованное обучение по охране труда в Калуге по Постановлению Правительства РФ №2464. Профессиональная подготовка, повышение квалификации, проверка знаний требований охраны труда.",
  keywords: [
    "охрана труда",
    "обучение охране труда",
    "УМЦ Калуга",
    "ПП-2464",
    "аккредитованный учебный центр",
    "проверка знаний охраны труда",
    "повышение квалификации",
    "обучение по охране труда Калуга",
  ],
  openGraph: {
    title: "УМЦ Калужского облсовпрофа — Обучение по охране труда",
    description:
      "Аккредитованное обучение по охране труда в Калуге по Постановлению Правительства РФ №2464. Профессиональная подготовка, повышение квалификации, проверка знаний требований охраны труда.",
    locale: "ru_RU",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "ЧОУ ДПО УМЦ Калужского облсовпрофа",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Калуга",
    addressCountry: "RU",
  },
  telephone: "+7-4842-57-01-04",
  email: "umcentr_kaluga@mail.ru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        {yandexMetrikaId && (
          <Script
            id="yandex-metrika"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(${yandexMetrikaId}, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
                });
              `,
            }}
          />
        )}
        {yandexMetrikaId && (
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        )}
      </body>
    </html>
  );
}
