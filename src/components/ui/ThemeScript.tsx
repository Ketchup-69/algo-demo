import { themeInitScript } from "@/lib/theme";

/**
 * Injected into <head> so it runs before first paint. Must stay a plain
 * <script> — a React component cannot beat the first paint.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}
