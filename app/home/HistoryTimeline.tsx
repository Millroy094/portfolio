'use client'
import { ReactElement } from 'react';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Grid, Typography } from '@mui/material';
import { timelineContentClasses } from '@mui/lab/TimelineContent';
import GrowOnHover from '../../hoc/GrowOnHover';

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
      direction='column'
      alignItems='center'
      size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
    >
      <Typography
        variant='overline'
        fontWeight='bold'
        fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
      >
        {title}
      </Typography>
      <Timeline
        sx={{
          [`& .${timelineContentClasses.root}`]: {
            justifyContent: 'center',
          },
        }}
      >
        {timeline?.map((t: ITimelineItem, index: number) => (
          <GrowOnHover key={t.title}>
            <TimelineItem>
              <TimelineOppositeContent
                sx={{ display: 'flex', flex: 0, alignItems: 'center' }}
              >
                {t.year}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color='error'>{t.Icon}</TimelineDot>
                {index !== timeline.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ flex: 1 }}>
                <Typography variant='h6' component='span'>
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
