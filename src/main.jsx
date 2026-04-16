import { Fragment, useState, useEffect } from "react";

export default function PWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    if (window.__installPromptEvent) {
      setDeferredPrompt(window.__installPromptEvent);
      setVisible(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      window.__installPromptEvent = e;
      setDeferredPrompt(e);
      setVisible(true);
    };

    const installedHandler = () => {
      setInstalled(true);
      setVisible(false);
      window.__installPromptEvent = null;
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setVisible(false);
      setInstalled(true);
      window.__installPromptEvent = null;
    }
  };

  if (!visible || installed) return null;

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
          width="16"
          height="16"
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