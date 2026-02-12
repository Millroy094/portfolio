"use client";

import { SwipeUp } from "@mui/icons-material";
import { Fab, Box } from "@mui/material";
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

export default function Home() {
  const { width, height } = useWindowDimensions();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setScrollOffset] = useState(0);
  const [showBtn, setShowBtn] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const markMounted = () => setMounted(true);
    markMounted();
  }, []);

  const showBtnRef = useRef(showBtn);
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

        setScrollOffset((prev) => (prev !== y ? y : prev));

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!width || !height || !mounted) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Atom color="#32cd32" size="large" text="" textColor="loading" />
      </Box>
    );
  }

  return (
    <>
      <BackgroundParticles />

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
          <Box
            sx={{
              position: "fixed",
              right: 20,
              bottom: 20,
              zIndex: 100,
              willChange: "opacity, transform",
            }}
          >
            <motion.div
              key="scrollToTopButton"
              initial={{ opacity: 0, y: "15%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "10%" }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            >
              <Fab
                color="error"
                aria-label="scroll to top"
                onClick={scrollToTop}
                sx={{ "&.MuiFab-root:focus": { outline: "none" } }}
              >
                <SwipeUp />
              </Fab>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
