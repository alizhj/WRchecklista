'use client';

import { Button, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { ConfettiButton } from './magicui/confetti';
import dayjs from 'dayjs';
import { start } from 'repl';
import confetti from 'canvas-confetti';

export default function Start({ onStart }: { onStart: () => void }) {
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
  }, []);

  const handleStart = () => {
    const datum = dayjs();
    localStorage.setItem('startDatum', datum.toISOString());
    setOpen(false);
    const end = Date.now() + 2 * 1000; // 3 seconds

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
    onStart();
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2">
          Redo?
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Nu jävlar kör vi! <br />
          Klicka på knappen för att starta.
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: '#600336',
            borderRadius: '50px',
            mt: 2,
            cursor: 'pointer',
            color: '#fff',
            p: 1,
          }}
          onClick={handleStart}
        >
          Starta Weekly Revolt
        </Button>
      </Box>
    </Modal>
  );
}
