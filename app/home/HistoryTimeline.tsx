"use client";
import { Code } from "@mui/icons-material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { timelineContentClasses } from "@mui/lab/TimelineContent";
import { Grid, Typography } from "@mui/material";

import GrowOnHover from "../../hoc/GrowOnHover";

interface ITimelineItem {
  year: number;
  title: string;
  subTitle: string;
}

interface IHistoryTimelineProps {
  title: string;
  timeline: ITimelineItem[];
}

function HistoryTimeline(props: Readonly<IHistoryTimelineProps>) {
  const { timeline, title } = props;
  return (
    <Grid container direction="column" alignItems="center" size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
      <Typography
        component="h2"
        variant="overline"
        fontWeight="bold"
        fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
      >
        {title}
      </Typography>
      <Timeline
        sx={{
          [`& .${timelineContentClasses.root}`]: {
            justifyContent: "center",
          },
        }}
      >
        {timeline
          ?.sort((ta, tb) => ta.year - tb.year)
          .map((t: ITimelineItem, index: number) => (
            <GrowOnHover key={t.title}>
              <TimelineItem>
                <TimelineOppositeContent sx={{ display: "flex", flex: 0, alignItems: "center" }}>
                  {t.year}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="error">
                    <Code />
                  </TimelineDot>
                  {index !== timeline.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ flex: 1 }}>
                  <Typography variant="h6" component="span">
                    {t.title}
                  </Typography>
                  <Typography>{t.subTitle}</Typography>
                </TimelineContent>
              </TimelineItem>
            </GrowOnHover>
          ))}
      </Timeline>
    </Grid>
  );
}

export default HistoryTimeline;
