import {
  Code,
  HistoryEdu,
  Savings,
  School,
  SupportAgent,
  Troubleshoot,
  WorkspacePremium,
} from "@mui/icons-material";
import { Grid2 as Grid } from "@mui/material";
import Lottie from "react-lottie";
import HistoryTimeline from "./HistoryTimeline";
import WorkAndEducationLottie from "../lotties/work-and-education.json";

function EducationAndExperience() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: WorkAndEducationLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const workTimeline = [
    {
      year: 2013,
      title: "Nationwide Building Society",
      subTitle: "Customer Service Advisor",
      Icon: <Savings />,
    },
    {
      year: 2015,
      title: "Ricoh UK",
      subTitle: "Service Desk Analyst",
      Icon: <SupportAgent />,
    },
    {
      year: 2017,
      title: "Integral UK",
      subTitle: "Graduate Data Analyst",
      Icon: <Troubleshoot />,
    },
    {
      year: 2018,
      title: "Guides For Brides",
      subTitle: "Junior Web Developer",
      Icon: <Code />,
    },
    {
      year: 2020,
      title: "Q:Chi",
      subTitle: "Software Engineer",
      Icon: <Code />,
    },
    {
      year: 2023,
      title: "Alcumus",
      subTitle: "Senior Software Developer",
      Icon: <Code />,
    },
  ];

  const educationTimeline = [
    {
      year: 2008,
      title: "St. Anthony's High School Goa India",
      subTitle: "Higher Secondary",
      Icon: <HistoryEdu />,
    },
    {
      year: 2009,
      title: "Fr. Agnel Polytechnic Verna Goa India",
      subTitle: "Diploma in Computer Engineering",
      Icon: <WorkspacePremium />,
    },
    {
      year: 2014,
      title: "New College Swindon UK",
      subTitle: "HND In Computing and Systems Development",
      Icon: <WorkspacePremium />,
    },
    {
      year: 2016,
      title: "Coventry University",
      subTitle: "B.Sc. (Hons) Informatics",
      Icon: <School />,
    },
  ];

  return (
    <Grid
      container
      sx={{ zIndex: 10, position: "relative", marginBottom: "60px" }}
    >
      <HistoryTimeline title={"Experience"} timeline={workTimeline} />
      <Grid
        container
        size={{ lg: 3, sm: 0, xs: 0 }}
        justifyContent="center"
        alignItems="center"
      >
        <Lottie options={defaultOptions} height={300} width={300} />
      </Grid>
      <HistoryTimeline title={"Education"} timeline={educationTimeline} />
    </Grid>
  );
}

export default EducationAndExperience;
