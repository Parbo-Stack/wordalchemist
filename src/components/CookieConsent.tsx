import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const updateGtagConsent = (status: "granted" | "denied") => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: status,
      });
    }
  };

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowConsent(false);
    updateGtagConsent("granted");
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowConsent(false);
    updateGtagConsent("denied");
  };

  if (!showConsent) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-700 p-4 z-50"
      data-testid="cookie-consent-banner"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-300">
          <p>
            We use cookies to enhance your gaming experience and analyze site traffic.
            By clicking "Accept", you consent to our use of cookies.
            View our{" "}
            <a
              href="/privacy-policy"
              className="text-purple-400 hover:text-purple-300 underline focus:outline-none focus:ring-2 focus:ring-purple-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            for more information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Decline Cookies"
            data-testid="decline-button"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Accept Cookies"
            data-testid="accept-button"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
