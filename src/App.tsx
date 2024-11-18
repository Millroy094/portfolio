import { useEffect, useState } from 'react';
import {
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from 'react-scroll';
import { AnimatePresence, motion } from 'motion/react';
import AboutMe from './components/AboutMe';
import BackgroundParticles from './components/BackgroundParticles';
import EducationAndExperience from './components/EducationAndExpierence';
import Introduction from './components/Introduction';
import Projects from './components/Projects';
import Skills from './components/Skills';
import { Fab, Grid2 as Grid } from '@mui/material';
import { SwipeUp } from '@mui/icons-material';
import useWindowDimensions from './hooks/useWindowDimensions';

function App() {
  const { height } = useWindowDimensions();

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

  return (
    <>
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

export default App;
