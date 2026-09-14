import { PageEnter } from "@/components/ui";

/**
 * Remounted on every navigation, which is what makes it the right home for the
 * page transition. The header and footer live in the layout and stay put.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageEnter>{children}</PageEnter>;
}
