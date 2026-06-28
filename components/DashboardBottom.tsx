"use client";

import { useLayoutEffect, useRef } from "react";

const DESKTOP_QUERY = "(min-width: 901px)";

export default function DashboardBottom({
  create,
  log,
}: {
  create: React.ReactNode;
  log: React.ReactNode;
}) {
  const createRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const createEl = createRef.current;
    const logEl = logRef.current;
    if (!createEl || !logEl) return;

    const media = window.matchMedia(DESKTOP_QUERY);

    const syncHeight = () => {
      if (!media.matches) {
        logEl.style.height = "";
        return;
      }
      logEl.style.height = `${createEl.offsetHeight}px`;
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(createEl);
    media.addEventListener("change", syncHeight);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncHeight);
      window.removeEventListener("resize", syncHeight);
    };
  }, []);

  return (
    <div className="dashboard-bottom">
      <div className="dashboard-bottom-create" ref={createRef}>
        {create}
      </div>
      <div className="dashboard-bottom-log" ref={logRef}>
        {log}
      </div>
    </div>
  );
}
