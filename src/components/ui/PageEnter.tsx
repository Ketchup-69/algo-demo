"use client";

import { useEffect, useState } from "react";

/**
 * The route transition. Mounted by app/template.tsx, which React remounts on
 * every navigation, so an enter animation on this wrapper IS the page
 * transition: the new page settles in from 8px while the header, which lives
 * in the layout, does not move.
 *
 * It does nothing on the first load. The hero has its own sequence and two
 * entrances at once is one too many; and running a keyframe over server HTML
 * during hydration would also flash. The first mount records that it happened
 * in module scope; every later mount is a client navigation and animates.
 * Under reduced motion `motion-safe:` leaves the class inert.
 */
let hasMountedOnce = false;

export function PageEnter({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasMountedOnce);

  useEffect(() => {
    hasMountedOnce = true;
  }, []);

  return (
    <div className={animate ? "motion-safe:animate-page-in" : undefined}>
      {children}
    </div>
  );
}
