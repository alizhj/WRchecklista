'use client';

import Box from '@mui/material/Box';
import Day from '../components/day';
import { Button, Typography } from '@mui/material';
import Start from '@/components/start';
import { useEffect, useState } from 'react';
import StartOver from '@/components/ui/startover';
import RestoreIcon from '@mui/icons-material/Restore';
import dayjs from 'dayjs';

export default function Home() {
  const days = 66;
  const [started, setStarted] = useState(false);
  const [startOver, setStartOver] = useState(false);

  const getNumberedDays = () => {
    let content = [];
    for (let i = 1; i <= 66; i++) {
      const item = i;
      content.push(<Day key={item} daynumber={item} />);
    }
    return content;
  };

  const getCurrentActiveDay = () => {
    const savedDateString = localStorage.getItem('startDatum');
    if (!savedDateString) return 1;

    const startDate = dayjs(savedDateString).startOf('day');
    const today = dayjs().startOf('day');
    const daysSinceStart = today.diff(startDate, 'day') + 1;

    // Begränsa till mellan 1 och 66
    return Math.max(1, Math.min(daysSinceStart, 66));
  };

  const scrollToCurrentDay = () => {
    const currentDay = getCurrentActiveDay();

    // Vänta lite för att DOM:en ska vara redo
    setTimeout(() => {
      const container = document.getElementById('days-container');
      const dayElement = document.querySelector(`[data-day="${currentDay}"]`);

      if (container && dayElement) {
        // Eftersom containern nu använder CSS Grid, behöver vi beräkna annorlunda
        const containerHeight = container.clientHeight;
        const dayElementTop = (dayElement as HTMLElement).offsetTop; // Cast to HTMLElement
        const dayElementHeight = (dayElement as HTMLElement).offsetHeight; // Cast to HTMLElement

        // Centrera elementet i containern
        const scrollTop =
          dayElementTop - containerHeight / 2 + dayElementHeight / 2;

        container.scrollTo({
          top: Math.max(0, scrollTop), // Se till att vi inte scrollar till negativa värden
          behavior: 'smooth',
        });
      }
    }, 500);
  };

  useEffect(() => {
    const hasStarted = localStorage.getItem('startDatum') !== null;
    setStarted(hasStarted);

    // Om redan startad, skrolla till aktuellt datum
    if (hasStarted) {
      scrollToCurrentDay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="h-screen flex flex-col items-center pt-4 pb-4 text-pink-900 bg-pink-200">
      <Button
        variant="contained"
        sx={{
          position: 'absolute',
          top: { xs: 0, md: 10 },
          right: 10,
          background: '#600336',
          borderRadius: '50px',
          mt: 2,
          cursor: 'pointer',
          color: '#fff',
          p: { md: 1 },
          '& .button-text': {
            display: { xs: 'none', md: 'inline' },
          },
        }}
        onClick={() => {
          setStartOver(true);
        }}
      >
        <RestoreIcon /> <span className="button-text">Börja om</span>
      </Button>
      <Box className="flex flex-col items-center text-4xl mb-1 md:mb-6 flex-shrink-0">
        <h1 className="text-md mt-12 md:text-8xl md:mt-0 font-bold">
          Weekly Revolt
        </h1>
      </Box>
      {started && (
        <Box
          id="days-container"
          className={`m-4 grid gap-4 grid-cols-5 md:grid-cols-7 transition-opacity bg-white p-4 rounded-3xl duration-500 ${started ? 'opacity-100' : 'opacity-0'} md:m-0 flex-1 overflow-y-auto min-h-0`}
        >
          {getNumberedDays()}
        </Box>
      )}
      <Start
        onStart={() => {
          setTimeout(() => {
            setStarted(true);
            scrollToCurrentDay();
          }, 2000);
        }}
      />
      <StartOver
        onClose={() => {
          setStartOver(false);
        }}
        show={startOver}
      />
    </main>
  );
}
