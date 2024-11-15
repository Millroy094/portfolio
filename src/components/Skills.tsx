import { Grid2 as Grid, Typography } from '@mui/material';
import { Zoom } from 'react-awesome-reveal';
import StackIcon from 'tech-stack-icons';
import {
  SiDotnet,
  SiExpress,
  SiGithubactions,
  SiHelm,
  SiTerraform,
} from '@icons-pack/react-simple-icons';
import Lottie from 'react-lottie';
import SkillsLottie from '../lotties/skills.json';

function Skills() {
  const skills = [
    <StackIcon key='reactjs' name='reactjs' style={{ width: '40px' }} />,
    <StackIcon key='redux' name='redux' style={{ width: '40px' }} />,
    <StackIcon key='nodejs' name='nodejs' style={{ width: '40px' }} />,
    <StackIcon key='typescript' name='typescript' style={{ width: '40px' }} />,
    <SiExpress key='express' size={40} color='#ffffff' />,
    <StackIcon key='graphql' name='graphql' style={{ width: '40px' }} />,
    <StackIcon key='go' name='go' style={{ width: '40px' }} />,
    <StackIcon key='java' name='java' style={{ width: '40px' }} />,
    <StackIcon key='php' name='php' style={{ width: '40px' }} />,
    <StackIcon key='laravel' name='laravel' style={{ width: '40px' }} />,
    <StackIcon key='csharp' name='csharp' style={{ width: '40px' }} />,
    <SiDotnet key='dotnet' size={40} color='#2088FF' />,
    <StackIcon key='jest' name='jest' style={{ width: '40px' }} />,
    <StackIcon key='cypress' name='cypress' style={{ width: '40px' }} />,
    <StackIcon key='playwright' name='playwright' style={{ width: '40px' }} />,
    <StackIcon key='mongodb' name='mongodb' style={{ width: '40px' }} />,
    <StackIcon key='redis' name='redis' style={{ width: '40px' }} />,
    <StackIcon key='mysql' name='mysql' style={{ width: '40px' }} />,
    <StackIcon key='postgresql' name='postgresql' style={{ width: '40px' }} />,
    <StackIcon key='docker' name='docker' style={{ width: '40px' }} />,
    <StackIcon key='kubernetes' name='kubernetes' style={{ width: '40px' }} />,
    <SiHelm key='helm' size={40} color='#0F1689' />,
    <SiTerraform key='terraform' size={40} color='#844FBA' />,
    <SiGithubactions key='githubactions' size={40} color='#2088FF' />,
    <StackIcon key='aws' name='aws' style={{ width: '40px' }} />,
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SkillsLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Zoom cascade>
      <Grid container justifyContent='center'>
        <Grid container size={3}>
          <Lottie options={defaultOptions} height={400} width={400} />
        </Grid>
        <Grid container size={9} sx={{ padding: '40px' }}>
          <Grid container spacing={2}>
            <Typography
              variant='overline'
              fontWeight='bold'
              fontSize={35}
              sx={{
                display: 'inline-block',
              }}
            >
              Technology &
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
              Skills
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            {skills?.map((skill: JSX.Element) => (
              <Grid key={skill.key}>{skill}</Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Zoom>
  );
}

export default Skills;
