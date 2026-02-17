"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Atom } from "react-loading-indicators";
import { Element, Events, scrollSpy } from "react-scroll";

import AboutMe from "@/app/home/AboutMe";
import EducationAndExperience from "@/app/home/EducationAndExpierence";
import Introduction from "@/app/home/Introduction";
import Projects from "@/app/home/Projects";
import Skills from "@/app/home/Skills";
import BackgroundParticles from "@/components/BackgroundParticles";
import useWindowDimensions from "@/hooks/useWindowDimensions";

function SwipeUpIcon({ className = "" }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

export default function Home() {
  const { width, height } = useWindowDimensions();

  const [showBtn, setShowBtn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const showBtnRef = useRef(showBtn);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    showBtnRef.current = showBtn;
  }, [showBtn]);

  const showThreshold = height * 0.9;
  const hideThreshold = height * 0.7;

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;

        const shouldShow =
          y > showThreshold ? true : y < hideThreshold ? false : showBtnRef.current;

        if (shouldShow !== showBtnRef.current) {
          showBtnRef.current = shouldShow;
          setShowBtn(shouldShow);
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showThreshold, hideThreshold]);

  useEffect(() => {
    scrollSpy.update();
    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!mounted) return null;

  if (!width || !height) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Atom color="#32cd32" size="large" text="" textColor="loading" />
      </div>
    );
  }

  return (
    <>
      <BackgroundParticles />

      {/* Sections */}
      <Element name="introduction">
        <section id="introduction">
          <Introduction />
        </section>
      </Element>

      <Element name="aboutme">
        <section id="aboutme">
          <AboutMe />
        </section>
      </Element>

      <Element name="skills">
        <section id="skills">
          <Skills />
        </section>
      </Element>

      <Element name="educationandexperience">
        <section id="educationandexperience">
          <EducationAndExperience />
        </section>
      </Element>

      <Element name="projects">
        <section id="projects">
          <Projects />
        </section>
      </Element>

      <AnimatePresence>
        {showBtn && (
          <div className="fixed right-5 bottom-5 z-100">
            <motion.div
              key="scrollToTopButton"
              initial={{ opacity: 0, y: "15%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "10%" }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            >
              <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="
                  bg-red-600 hover:bg-red-700 active:bg-red-800
                  text-white w-14 h-14 rounded-full
                  shadow-lg flex items-center justify-center
                  focus:outline-none transition-colors
                "
              >
                <SwipeUpIcon />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
