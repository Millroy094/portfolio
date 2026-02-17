"use client";

import lottie, { AnimationItem } from "lottie-web";
import { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  /** Public path to the Lottie JSON (e.g., `/lotties/work-and-education.json`) */
  src: string;
  /** Loop animation */
  loop?: boolean;
  /** Autoplay when mounted */
  autoplay?: boolean;
  /** Pixel width/height (if omitted, use CSS for responsive sizing) */
  width?: number | string;
  height?: number | string;
  /** Tailwind/CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;

  /** Only play when in viewport (default: true) */
  playInView?: boolean;
  /** IntersectionObserver threshold (default: 0.3) */
  inViewThreshold?: number;

  /** Playback speed (1.0 default) */
  speed?: number;
  /** Optional segment play: [fromFrame, toFrame] */
  segments?: [number, number];
  /** Renderer: "svg" (default) | "canvas" */
  renderer?: "svg" | "canvas";

  /** Pause on hover (default: false) */
  pauseOnHover?: boolean;
  /** Respect `prefers-reduced-motion` (default: true) */
  respectReducedMotion?: boolean;

  /** Lottie events */
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (e: { currentTime: number; totalTime: number; direction: number }) => void;
};

export default function LottiePlayer({
  src,
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

  // Observe visibility (to pause when not visible)
  const { ref: inViewRef, inView } = useInView({
    threshold: inViewThreshold,
    triggerOnce: false,
  });

  // Combine refs so both IntersectionObserver and our containerRef get the div
  const setRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    inViewRef(node);
  };

  const prefersReducedMotion = useMemo(() => {
    if (!respectReducedMotion || typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, [respectReducedMotion]);

  // Init/destroy animation
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Destroy any prior instance first (defensive)
    animRef.current?.destroy();
    animRef.current = null;

    const anim = lottie.loadAnimation({
      container: node,
      renderer,
      loop,
      autoplay: autoplay && !(playInView && !inView) && !prefersReducedMotion,
      path: src,
    });

    animRef.current = anim;

    // Playback controls
    anim.setSpeed(speed);
    if (segments) {
      // Play the specified segment (force to start)
      anim.playSegments(segments, true);
    }

    // Events
    const onCompleteHandler = () => onComplete?.();
    const onLoopCompleteHandler = () => onLoopComplete?.();
    const onEnterFrameHandler = () => {
      if (!onEnterFrame) return;
      const total = anim.getDuration(true);
      onEnterFrame({
        currentTime: anim.currentFrame,
        totalTime: total,
        direction: anim.playDirection,
      });
    };

    anim.addEventListener("complete", onCompleteHandler);
    anim.addEventListener("loopComplete", onLoopCompleteHandler);
    anim.addEventListener("enterFrame", onEnterFrameHandler);

    const handleMouseEnter = () => {
      hoveringRef.current = true;
      if (pauseOnHover) anim.pause();
    };
    const handleMouseLeave = () => {
      hoveringRef.current = false;
      if (pauseOnHover && (!playInView || inView) && !prefersReducedMotion) anim.play();
    };
    if (pauseOnHover) {
      node.addEventListener("mouseenter", handleMouseEnter);
      node.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (pauseOnHover) {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
      }
      anim.removeEventListener("complete", onCompleteHandler);
      anim.removeEventListener("loopComplete", onLoopCompleteHandler);
      anim.removeEventListener("enterFrame", onEnterFrameHandler);
      anim.destroy();
      animRef.current = null;
    };
  }, [
    src,
    renderer,
    loop,
    autoplay,
    inView,
    playInView,
    prefersReducedMotion,
    speed,
    segments,
    pauseOnHover,
    onComplete,
    onLoopComplete,
    onEnterFrame,
  ]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim) return;

    if (prefersReducedMotion) {
      anim.pause();
      return;
    }

    if (!playInView) {
      if (!hoveringRef.current) anim.play();
      return;
    }

    if (inView && !hoveringRef.current) anim.play();
    else anim.pause();
  }, [inView, playInView, prefersReducedMotion]);

  const resolvedStyle: React.CSSProperties = {
    width: width ?? undefined,
    height: height ?? undefined,
    ...style,
  };

  return <div ref={setRefs} className={className} style={resolvedStyle} />;
}
