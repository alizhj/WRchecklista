'use client';

import Box from '@mui/material/Box';
import BackHandIcon from '@mui/icons-material/BackHand';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useEffect, useState } from 'react';
import { Modal, Tooltip } from '@mui/material';
import { ConfettiButton } from './magicui/confetti';
import dayjs from 'dayjs';
import Pepp from './pepp';
import { get } from 'http';

export default function Day({ daynumber }: { daynumber: number }) {
  const [dagliga, setDagliga] = useState(false);
  const [mage, setMage] = useState(false);
  const [utmaning, setUtmaning] = useState(false);
  const [showPepp, setShowPepp] = useState(false);

  useEffect(() => {
    setDagliga(localStorage.getItem(`${daynumber}-dagliga`) === 'dagliga');
    setMage(localStorage.getItem(`${daynumber}-mage`) === 'mage');
    setUtmaning(localStorage.getItem(`${daynumber}-utmaning`) === 'utmaning');
  }, [daynumber]);

  const getBackgroundColor = () => {
    const activeCount = [dagliga, mage, utmaning].filter(Boolean).length;

    if (activeCount === 3) {
      return 'bg-pink-500';
    } else if (activeCount === 2) {
      return 'bg-pink-400';
    } else if (activeCount === 1) {
      return 'bg-pink-300';
    } else {
      return 'bg-gray-200';
    }
  };

  const handlePepp = () => {
    if (
      daynumber === 7 ||
      daynumber === 22 ||
      daynumber === 33 ||
      daynumber === 44 ||
      daynumber === 66
    ) {
      setShowPepp(true);
    }
  };

  const getPeppTitle = () => {
    if (daynumber === 7) {
      return 'Vecka 1 avklarad!';
    } else if (daynumber === 22) {
      return 'En tredjedel avklarad!';
    } else if (daynumber === 33) {
      return 'Halvvägs!';
    } else if (daynumber === 44) {
      return 'Två tredejedelar avklarade!';
    } else if (daynumber === 66) {
      return 'Du klarade det!';
    }
  };

  const getPeppMessage = () => {
    if (daynumber === 7) {
      return 'Du är fantastisk! Kämpa vidare så kommer det gå bra det här!';
    } else if (daynumber === 22) {
      return 'Grymt jobbat! Du har nu gjort en tredjedel av resan! Rutinerna börjar sätta sig och du är på god väg mot ditt mål. Fortsätt kämpa!';
    } else if (daynumber === 33) {
      return 'Halvägs, var stolt över dig själv! Du har kommit långt och det är dags att fortsätta kämpa mot målet. Du klarar det här!';
    } else if (daynumber === 44) {
      return 'Det kan kännas lite jobbigt eller så flyter det på lättare än du trott. Hur som helst, Fortsätt kämpa!';
    } else if (daynumber === 66) {
      return 'Du är i mål! Fantastiskt jobbat! Du har genomfört hela 66 dagar av träning och utmaningar. Du är en riktig kämpe och har visat att du kan nå dina mål. Njut av din prestation!';
    }
  };

  // Hämta datum från localStorage
  const disabledDay = () => {
    const savedDateString = localStorage.getItem('startDatum');
    const startDate = dayjs(savedDateString);
    const today = dayjs();

    const daysSinceStart = today.diff(startDate, 'day') + 1;

    const isDisabled = daynumber <= daysSinceStart;
    return !isDisabled;
  };

  return (
    <>
      <Box className="flex items-center justify-center flex-col p-1">
        <Box
          className={`w-20 h-20 rounded-full flex justify-center items-center text-4xl ${getBackgroundColor()} ${disabledDay() ? 'text-gray-400 cursor-not-allowed' : 'text-pink-900'}`}
        >
          {daynumber}
        </Box>
        <Box>
          <Tooltip title="Dagliga">
            <BackHandIcon
              fontSize="large"
              className={` ${dagliga ? 'text-pink-900 cursor-pointer hover:text-pink-900' : 'text-gray-300 hover:text-pink-300'} ${disabledDay() ? 'text-gray-300 hover:text-gray-300 cursor-not-allowed' : 'text-gray-300'}`}
              onClick={
                disabledDay()
                  ? undefined
                  : () => {
                      setDagliga(!dagliga);
                      dagliga
                        ? localStorage.removeItem(`${daynumber}-dagliga`)
                        : localStorage.setItem(
                            `${daynumber}-dagliga`,
                            'dagliga'
                          );
                    }
              }
            />
          </Tooltip>

          <Tooltip title="Magträning">
            <FitnessCenterIcon
              fontSize="large"
              className={`${mage ? 'text-pink-900 hover:text-pink-900' : 'text-gray-300 hover:text-pink-300'} ${disabledDay() ? 'text-gray-300 hover:text-gray-300 cursor-not-allowed' : 'text-gray-300'}`}
              onClick={
                disabledDay()
                  ? undefined
                  : () => {
                      setMage(!mage);

                      if (mage) {
                        localStorage.removeItem(`${daynumber}-mage`);
                      } else {
                        localStorage.setItem(`${daynumber}-mage`, 'mage');
                        handlePepp();
                      }
                    }
              }
            />
          </Tooltip>
          {utmaning || disabledDay() ? (
            <Tooltip title="Utmaning">
              <EmojiEventsIcon
                fontSize="large"
                className={`${utmaning ? 'text-pink-900 hover:text-pink-900' : 'text-gray-300 hover:text-pink-300'} ${disabledDay() ? 'text-gray-300 hover:text-gray-300 cursor-not-allowed' : 'text-gray-300'}`}
                onClick={
                  disabledDay()
                    ? undefined
                    : () => {
                        setUtmaning(!utmaning);
                        utmaning
                          ? localStorage.removeItem(`${daynumber}-utmaning`)
                          : localStorage.setItem(
                              `${daynumber}-utmaning`,
                              'utmaning'
                            );
                      }
                }
              />
            </Tooltip>
          ) : (
            <Tooltip title="Utmaning">
              <ConfettiButton variant="ghost">
                <EmojiEventsIcon
                  fontSize="large"
                  className={`${utmaning ? 'text-pink-900 hover:text-pink-900' : 'text-gray-300 hover:text-pink-300'} ${disabledDay() ? 'text-gray-300 hover:text-gray-300 cursor-not-allowed' : 'text-gray-300'}`}
                  onClick={
                    disabledDay()
                      ? undefined
                      : () => {
                          setUtmaning(!utmaning);
                          utmaning
                            ? localStorage.removeItem(`${daynumber}-utmaning`)
                            : localStorage.setItem(
                                `${daynumber}-utmaning`,
                                utmaning ? '' : 'utmaning'
                              );
                        }
                  }
                />
              </ConfettiButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      <Modal
        open={showPepp}
        onClose={() => setShowPepp(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Pepp title={getPeppTitle()} message={getPeppMessage()} />
      </Modal>
    </>
  );
}
