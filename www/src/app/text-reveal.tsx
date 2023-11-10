"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export function TextReveal({ block }: { block: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerHeight =
        containerRef.current.getBoundingClientRect().height;
      const containerTop = containerRef.current.offsetTop;

      // this adjusted scroll position should be negative until scrolling in the container starts
      const adjustedScrollPosition =
        window.scrollY - containerTop + containerHeight;

      // before scrolling into the container starts
      if (adjustedScrollPosition < 0) {
        setScrollProgress(0);
        setSticky(false);
        // after scrolling out of the container ends
      } else if (adjustedScrollPosition > containerHeight) {
        setSticky(false);
        setScrollProgress(1);
        // while scrolling in the container
      } else {
        setSticky(true);
        const scrollProgressPercentage = Math.max(
          adjustedScrollPosition / containerHeight,
          0
        );
        setScrollProgress(scrollProgressPercentage);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setSticky, setScrollProgress]);

  const revealText = (text: string) => {
    const words = text.split(" ");

    return words.map((word, index) => {
      const wordRevealPercentage = ((index + 1) / words.length) * 100;
      let opacity = 0.1;

      if (scrollProgress * 100 >= wordRevealPercentage) {
        opacity = 1;
      }

      return (
        <span
          key={index}
          style={{ opacity, transition: "opacity 0.2s ease-in-out" }}
        >
          {word}{" "}
        </span>
      );
    });
  };

  return (
    <>
      <div
        className={clsx(
          sticky && "sticky inset-0",
          "text-white bg-background min-h-screen h-screen flex justify-center items-center py-28 px-6"
        )}
      >
        <div
          className="text-4xl sm:text-5xl leading-tight font-medium max-w-3xl w-full"
          style={{ scrollSnapAlign: sticky ? "start" : "none" }}
        >
          <p className="text-left">{revealText(block)}</p>
        </div>
      </div>
      <div
        ref={containerRef}
        className="text-white bg-background min-h-screen h-screen flex justify-center items-center py-28 px-6"
      >
        <div className="text-4xl sm:text-5xl leading-tight font-medium max-w-3xl w-full">
          <p className="text-left">{block}</p>
        </div>
      </div>
    </>
  );
}
