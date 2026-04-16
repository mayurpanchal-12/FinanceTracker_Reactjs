import { Fragment, useState, useEffect } from "react";

export default function PWA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log("PWA mounted");
    console.log("standalone:", window.matchMedia("(display-mode: standalone)").matches);
    console.log("prompt:", window.__installPromptEvent);

    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Already there — show immediately
    if (window.__installPromptEvent) {
      console.log("setting visible true");
      setVisible(true);
      return;
    }

    // Wait for it
    const handler = (e) => {
      e.preventDefault();
      window.__installPromptEvent = e;
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setVisible(false));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    const prompt = window.__installPromptEvent;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      window.__installPromptEvent = null;
      setVisible(false);
    }
  };

  console.log("PWA render, visible:", visible);

  if (!visible) return null;

  return (
    <Fragment>
      <button
        type="button"
        id="downloadBtn"
        onClick={handleInstall}
        className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16" height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Install App
      </button>
    </Fragment>
  );
}