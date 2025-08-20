'use client';

import { Button, IconButton, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { ConfettiButton } from './magicui/confetti';
import dayjs from 'dayjs';
import { start } from 'repl';
import confetti from 'canvas-confetti';
import CloseIcon from '@mui/icons-material/Close';

export default function Pepp({
  title,
  message,
  onClose,
}: {
  title: string | undefined;
  message: string | undefined;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#ffbde1',
    border: '2px solid #600336',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  };
  useEffect(() => {
    const sparatDatum = localStorage.getItem('startDatum');
    sparatDatum ? setOpen(false) : setOpen(true);

    const end = Date.now() + 1 * 1000; // 3 seconds

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 7,
        angle: 60,
        spread: 35,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 35,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return (
    <Box sx={style}>
      <IconButton
        aria-label="close"
        onClick={() => onClose()}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'black',
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography id="modal-modal-title" variant="h4" component="h2">
        {title}
      </Typography>
      <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}
