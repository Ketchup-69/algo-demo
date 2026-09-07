export type Theme = "light" | "dark";

/** Single source of truth for the storage key, shared by the inline script. */
export const THEME_STORAGE_KEY = "algo-theme";

/**
 * Runs in <head>, before first paint, so the correct theme is on <html>
 * by the time anything renders. Without this you get a flash of light theme
 * on every load for dark-mode users.
 *
 * Kept as a string because it must execute synchronously and cannot wait for
 * the React bundle. Everything is wrapped in try/catch: Safari in private mode
 * throws on `localStorage` access rather than returning null, and CLAUDE.md §2
 * only permits localStorage here if there is a safe fallback.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var s=null;try{s=window.localStorage.getItem(k)}catch(e){}var t=(s==="light"||s==="dark")?s:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var e=document.documentElement;e.setAttribute("data-theme",t);e.style.colorScheme=t}catch(err){var d=document.documentElement;d.setAttribute("data-theme","light");d.style.colorScheme="light"}})();`;

/** Read the theme the inline script already committed to the DOM. */
export function getAppliedTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/** True when the visitor has never made an explicit choice. */
export function hasStoredPreference(): boolean {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark";
  } catch {
    return false;
  }
}

/**
 * Fired whenever the theme changes so every mounted toggle re-reads the DOM.
 * The styleguide renders several at once, and a page could grow a second one
 * in a footer later.
 */
export const THEME_CHANGE_EVENT = "algo:themechange";

export function applyTheme(theme: Theme, persist = true) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable (private mode, blocked cookies). The toggle still
      // works for this page view; it just will not be remembered.
    }
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/**
 * The theme is external state: it lives on the <html> element, written by the
 * inline script before React exists. Subscribing to it rather than mirroring it
 * into component state means there is exactly one source of truth, and no
 * setState-in-effect to cause a cascading render on mount.
 */
export const themeStore = {
  subscribe(onStoreChange: () => void) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    // Follow the OS until the visitor makes an explicit choice.
    const onMediaChange = () => {
      if (!hasStoredPreference()) {
        applyTheme(media.matches ? "dark" : "light", false);
      }
    };

    // Keep other tabs in step when the preference is written.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      if (event.newValue === "light" || event.newValue === "dark") {
        applyTheme(event.newValue, false);
      }
    };

    media.addEventListener("change", onMediaChange);
    window.addEventListener("storage", onStorage);
    window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    };
  },

  getSnapshot: (): Theme | null => getAppliedTheme(),

  /**
   * Null on the server and during hydration: the markup is rendered before any
   * theme is known, so the button starts with a neutral label and settles once
   * React can read the DOM. Returning a concrete theme here would make the
   * server HTML disagree with the client for anyone not on that theme.
   */
  getServerSnapshot: (): Theme | null => null,
};
