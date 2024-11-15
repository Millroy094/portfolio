import { ReactElement } from "react";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Grid2 as Grid, Typography } from "@mui/material";

interface ITimelineItem {
  year: number;
  title: string;
  subTitle: string;
  Icon: ReactElement;
}

interface IHistoryTimelineProps {
  title: string;
  timeline: ITimelineItem[];
}

function HistoryTimeline(props: Readonly<IHistoryTimelineProps>) {
  const { timeline, title } = props;
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
    >
      <Typography
        variant="overline"
        fontWeight="bold"
        fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
      >
        {title}
      </Typography>
      <Timeline sx={{ width: "100%" }}>
        {timeline?.map((t: ITimelineItem, index: number) => (
          <TimelineItem key={t.title}>
            <TimelineOppositeContent>{t.year}</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="error">{t.Icon}</TimelineDot>
              {index !== timeline.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ flex: 2 }}>
              <Typography variant="h6" component="span">
                {t.title}
              </Typography>
              <Typography>{t.subTitle}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Grid>
  );
}

export default HistoryTimeline;
