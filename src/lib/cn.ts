import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with later ones actually winning.
 *
 * This is load-bearing, not sugar. Tailwind utilities all land at the same
 * specificity, so a component's default `py-24` and a caller's `py-12` are
 * resolved by their order in the generated stylesheet — not by the order they
 * appear in the class string. The caller's override loses at random.
 * `twMerge` drops the conflicting class entirely, so the last one written is
 * the one that applies.
 *
 * Every primitive routes its incoming `className` through here.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
