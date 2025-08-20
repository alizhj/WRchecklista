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
  const [started, setStarted] = useState(false);
  const [startOver, setStartOver] = useState(false);
  const [programDays, setProgramDays] = useState(66); // Default fallback

  const getProgramDays = () => {
    const savedProgram = localStorage.getItem('program');
    return savedProgram ? parseInt(savedProgram) : 66;
  };

  const getNumberedDays = () => {
    const currentProgramDays = getProgramDays();
    let content = [];
    for (let i = 1; i <= currentProgramDays; i++) {
      const item = i;
      content.push(<Day key={item} daynumber={item} />);
    }
    return content;
  };

  const getCurrentActiveDay = () => {
    const savedDateString = localStorage.getItem('startDatum');
    if (!savedDateString) return 1;

    const currentProgramDays = getProgramDays();
    const startDate = dayjs(savedDateString).startOf('day');
    const today = dayjs().startOf('day');
    const daysSinceStart = today.diff(startDate, 'day') + 1;

    // Begränsa till mellan 1 och currentProgramDays
    return Math.max(1, Math.min(daysSinceStart, currentProgramDays));
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
        const dayElementTop = (dayElement as HTMLElement).offsetTop;
        const dayElementHeight = (dayElement as HTMLElement).offsetHeight;

        // Centrera elementet i containern
        const scrollTop =
          dayElementTop - containerHeight / 2 + dayElementHeight / 2;

        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth',
        });
      }
    }, 500);
  };

  useEffect(() => {
    const hasStarted = localStorage.getItem('startDatum') !== null;
    const savedProgram = localStorage.getItem('program');

    // Sätt antal dagar från localStorage, fallback till 66
    if (savedProgram) {
      setProgramDays(parseInt(savedProgram));
    }

    setStarted(hasStarted);

    // Om redan startad, skrolla till aktuellt datum
    if (hasStarted) {
      scrollToCurrentDay();
    }
  }, []);

  // Lyssna på localStorage ändringar för att uppdatera när program ändras
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProgram = localStorage.getItem('program');
      if (savedProgram) {
        setProgramDays(parseInt(savedProgram));
      }
    };

    // Lyssna på storage events (fungerar mellan tabs)
    window.addEventListener('storage', handleStorageChange);

    // Lyssna på custom event för samma tab
    window.addEventListener('programUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('programUpdated', handleStorageChange);
    };
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
