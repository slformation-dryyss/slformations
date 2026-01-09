'use client';

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Délai en ms avant l'animation (pratique pour échelonner les blocs) */
  delay?: number;
};

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add("sr-visible");
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={clsx("sr-base", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}











