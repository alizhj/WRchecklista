'use client';

import Box from '@mui/material/Box';
import Day from '../components/day';
import { Button, Typography } from '@mui/material';
import Start from '@/components/start';
import { useEffect, useState } from 'react';
import StartOver from '@/components/ui/startover';
import RestoreIcon from '@mui/icons-material/Restore';

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

  useEffect(() => {
    localStorage.getItem('startDatum') === null
      ? setStarted(false)
      : setStarted(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center pt-4 pb-4 text-pink-900 bg-pink-200">
      <Button
        variant="contained"
        sx={{
          position: 'absolute',
          top: 10,
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
      <Box className="flex flex-col items-center  text-4xl mb-6 ">
        <h1 className="text-md mt-10 md:text-8xl md:mt-0 font-bold">
          Weekly Revolt
        </h1>
      </Box>
      {started && (
        <Box
          className={`m-4 grid gap-4 grid-cols-7 transition-opacity bg-white p-4 rounded-3xl duration-500 ${started ? 'opacity-100' : 'opacity-0'} md:m-0`}
        >
          {getNumberedDays()}
        </Box>
      )}
      <Start
        onStart={() => {
          setTimeout(() => setStarted(true), 2000);
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
