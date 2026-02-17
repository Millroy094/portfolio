"use client";

import lottie, { AnimationItem } from "lottie-web";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  src: string;

  /** Next.js Image placeholder */
  placeholderSrc?: string;
  blurDataURL?: string;
  placeholderClassName?: string;

  loop?: boolean;
  autoplay?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;

  playInView?: boolean;
  inViewThreshold?: number;

  speed?: number;
  segments?: [number, number];
  renderer?: "svg" | "canvas";

  pauseOnHover?: boolean;
  respectReducedMotion?: boolean;

  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (e: { currentTime: number; totalTime: number; direction: number }) => void;
};

export default function LottiePlayer({
  src,
  placeholderSrc,
  blurDataURL,
  placeholderClassName,

  loop = true,
  autoplay = true,
  width,
  height,
  className,
  style,

  playInView = true,
  inViewThreshold = 0.3,

  speed = 1,
  segments,
  renderer = "svg",

  pauseOnHover = false,
  respectReducedMotion = true,

  onComplete,
  onLoopComplete,
  onEnterFrame,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const hoveringRef = useRef(false);

  const { ref: inViewRef, inView } = useInView({
    threshold: inViewThreshold,
    triggerOnce: false,
  });

  const [ready, setReady] = useState(false);

  const setRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    inViewRef(node);
  };

  const prefersReducedMotion = useMemo(() => {
    if (!respectReducedMotion || typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, [respectReducedMotion]);

  /** Load the animation */
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    animRef.current?.destroy();
    animRef.current = null;

    const anim = lottie.loadAnimation({
      container: node,
      renderer,
      loop,
      autoplay: false,
      path: src,
    });

    animRef.current = anim;

    anim.setSpeed(speed);
    if (segments) anim.playSegments(segments, false);

    anim.addEventListener("DOMLoaded", () => {
      setReady(true); // Fade-in Lottie, fade-out placeholder
    });

    anim.addEventListener("complete", () => onComplete?.());
    anim.addEventListener("loopComplete", () => onLoopComplete?.());
    anim.addEventListener("enterFrame", () => {
      onEnterFrame?.({
        currentTime: anim.currentFrame,
        totalTime: anim.getDuration(true),
        direction: anim.playDirection,
      });
    });

    const handleEnter = () => {
      hoveringRef.current = true;
      if (pauseOnHover) anim.pause();
    };
    const handleLeave = () => {
      hoveringRef.current = false;
      if (pauseOnHover && (!playInView || inView) && !prefersReducedMotion) anim.play();
    };

    if (pauseOnHover) {
      node.addEventListener("mouseenter", handleEnter);
      node.addEventListener("mouseleave", handleLeave);
    }

    return () => {
      if (pauseOnHover) {
        node.removeEventListener("mouseenter", handleEnter);
        node.removeEventListener("mouseleave", handleLeave);
      }
      anim.destroy();
      animRef.current = null;
    };
  }, [
    src,
    renderer,
    loop,
    speed,
    segments,
    pauseOnHover,
    playInView,
    prefersReducedMotion,
    onComplete,
    onLoopComplete,
    onEnterFrame,
  ]);

  /** Smooth playback when entering/exiting viewport */
  useEffect(() => {
    const anim = animRef.current;
    if (!anim) return;

    if (prefersReducedMotion) return anim.pause();

    if (playInView) {
      if (inView && !hoveringRef.current) anim.play();
      else anim.pause();
    } else {
      if (!hoveringRef.current) anim.play();
    }
  }, [inView, playInView, prefersReducedMotion]);

  /** Wrapper always controls the size */
  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: width ?? "100%",
    height: height ?? "100%",
  };

  /** Fade-in Lottie layer */
  const lottieStyle: React.CSSProperties = {
    opacity: ready ? 1 : 0,
    transition: "opacity 0.4s ease",
    width: "100%",
    height: "100%",
    ...style,
  };

  /** Fade-out placeholder layer */
  const placeholderStyle: React.CSSProperties = {
    opacity: ready ? 0 : 1,
    transition: "opacity 0.4s ease",
  };

  return (
    <div style={wrapperStyle} className={className}>
      {placeholderSrc && (
        <Image
          src={placeholderSrc}
          alt=""
          fill
          className={placeholderClassName}
          style={placeholderStyle}
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL}
          sizes="100%"
          aria-hidden="true"
        />
      )}

      <div ref={setRefs} style={lottieStyle} />
    </div>
  );
}
