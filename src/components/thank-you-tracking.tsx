"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function ThankYouTracking({ leadType }: { leadType: "quiz" | "callback" }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const gadsId = process.env.NEXT_PUBLIC_GADS_ID;
  const gadsLabel = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL;

  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: "lead_form_success",
      lead_type: leadType,
      page_type: "thank_you",
    });

    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", { lead_type: leadType });
    }

    if (typeof window.gtag === "function" && gadsId && gadsLabel) {
      window.gtag("event", "conversion", {
        send_to: `${gadsId}/${gadsLabel}`,
      });
    }
  }, [leadType, gadsId, gadsLabel]);

  return (
    <>
      {gtmId ? (
        <>
          <Script id="gtm-base" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}</Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}

      {metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixelId}');
          fbq('track', 'PageView');
        `}</Script>
      ) : null}
    </>
  );
}
