import { Grid2 as Grid, Typography } from '@mui/material';
import { Zoom } from 'react-awesome-reveal';
import Lottie from 'react-lottie';
import AboutMeLottie from '../lotties/about-me.json';

function AboutMe() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: AboutMeLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Grid container direction='column' sx={{ marginBottom: '60px' }}>
      <Zoom cascade>
        <Grid
          container
          spacing={2}
          justifyItems='center'
          sx={{ padding: '0 40px' }}
        >
          <Grid container size={4}>
            <Lottie options={defaultOptions} width={400} height={400} />
          </Grid>
          <Grid container size={8} alignContent='center'>
            <Grid container justifyContent='start' spacing={1}>
              <Typography
                variant='overline'
                fontWeight='bold'
                fontSize={35}
                sx={{
                  display: 'inline-block',
                }}
              >
                About
              </Typography>
              <Typography
                variant='overline'
                fontWeight='bold'
                fontSize={35}
                sx={{
                  color: '#d32f2f',
                  display: 'inline-block',
                }}
              >
                Me
              </Typography>
            </Grid>
            <Grid container>
              <Typography variant='body1' fontSize='20px'>
                I've been a developer for about 6+ years, I've climbed my way up
                from a customer service advisor to a support engineer to a
                software engineer and since then I've been on this amazing
                journey where there is always something to learn. I am well
                versed with not only the dev world but everything outside and
                everything in between. Well through my whole career my only goal
                has been to learn, to do the right thing, and be better than my
                past self.
              </Typography>
              <Typography variant='body1' fontSize='20px'>
                I've trained myself up as a DevOps and a QA engineer as much as
                my fullstack experience because I feel as Dev you need to know
                how important these roles are.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Zoom>
    </Grid>
  );
}

export default AboutMe;
