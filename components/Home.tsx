'use client'

import {
    Element,
    Events,
    animateScroll as scroll,
    scrollSpy,
} from 'react-scroll';
import {Atom} from 'react-loading-indicators'
import BackgroundParticles from "@/components/BackgroundParticles";
import Introduction from "@/components/Introduction";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {Fab, Grid} from "@mui/material";
import {SwipeUp} from "@mui/icons-material";
import AboutMe from "@/components/AboutMe";
import Skills from "@/components/Skills";
import EducationAndExperience from "@/components/EducationAndExpierence";
import Projects from "@/components/Projects";
import Box from "@mui/material/Box";

export default function Home() {


    const { width, height } = useWindowDimensions();

    const [scrollOffset, setScrollOffset] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollOffset(window.scrollY);
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        scrollSpy.update();

        return () => {
            Events.scrollEvent.remove('begin');
            Events.scrollEvent.remove('end');
        };
    }, []);

    const scrollToTop = () => {
        scroll.scrollToTop();
    };

    if (!width || !height) {
        return (
            <Box sx={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}><Atom color="#32cd32" size="large" text="" textColor="loading" /></Box>
        );
    }

    return (
            < >
                <BackgroundParticles />
                <Element name='introduction'>
                    <Introduction />
                </Element>
                <Element name='aboutme'>
                    <AboutMe />
                </Element>
                <Element name='skills'>
                    <Skills />
                </Element>
                <Element name='educationandexperience'>
                    <EducationAndExperience />
                </Element>
                <Element name='projects'>
                    <Projects />
                </Element>
                <AnimatePresence mode='wait'>
                    {scrollOffset > height && (
                        <Grid
                            container
                            justifyContent='end'
                            p={1}
                            sx={{
                                margin: 0,
                                top: 'auto',
                                right: 20,
                                bottom: 20,
                                left: 'auto',
                                position: 'fixed',
                                zIndex: 100,
                            }}
                        >
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: '15%' }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    ease: 'linear',
                                    duration: 0.5,
                                }}
                            >
                                <Fab
                                    color='error'
                                    aria-label='add'
                                    onClick={scrollToTop}
                                    sx={{
                                        '&.MuiFab-root:focus': { outline: 'none' },
                                    }}
                                >
                                    <SwipeUp />
                                </Fab>
                            </motion.div>
                        </Grid>
                    )}
                </AnimatePresence>
            </>
    );
}