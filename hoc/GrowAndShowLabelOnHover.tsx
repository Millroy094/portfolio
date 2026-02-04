'use client'

import { motion } from 'motion/react';
import { ReactElement } from 'react';
import GrowOnHover from './GrowOnHover';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

interface IGrowAndShowLabelOnHoverProps {
  children: ReactElement;
  label: string;
  scale?: number;
}

const labelMotion = {
  rest: { opacity: 0, ease: 'easeOut', duration: 0.2, type: 'tween' },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.4,
      type: 'tween',
      ease: 'easeIn',
    },
  },
};

function GrowAndShowLabelOnHover(
  props: Readonly<IGrowAndShowLabelOnHoverProps>,
) {
  const { children, label, scale } = props;
  const isBelowMidSize = useMediaQuery('(max-width:959px)');

  return (
    <motion.div
      initial='rest'
      whileHover='hover'
      animate='rest'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <GrowOnHover scale={scale}>{children}</GrowOnHover>
      {isBelowMidSize ? (
        <Typography variant='caption' textAlign='center'>
          {label}
        </Typography>
      ) : (
        <motion.div variants={labelMotion} style={{ display: 'flex' }}>
          <Typography variant='caption' textAlign='center'>
            {label}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
}

export default GrowAndShowLabelOnHover;
