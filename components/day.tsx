'use client';

import Box from '@mui/material/Box';
import BackHandIcon from '@mui/icons-material/BackHand';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useEffect, useState } from 'react';
import { IconButton, Modal, Tooltip, Typography } from '@mui/material';
import { ConfettiButton } from './magicui/confetti';
import dayjs from 'dayjs';
import Pepp from './pepp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

export default function Day({ daynumber }: { daynumber: number }) {
  const [dagliga, setDagliga] = useState(false);
  const [mage, setMage] = useState(false);
  const [utmaning, setUtmaning] = useState(false);
  const [extra, setExtra] = useState(false);
  const [showPepp, setShowPepp] = useState(false);

  useEffect(() => {
    setDagliga(localStorage.getItem(`${daynumber}-dagliga`) === 'dagliga');
    setMage(localStorage.getItem(`${daynumber}-mage`) === 'mage');
    setUtmaning(localStorage.getItem(`${daynumber}-utmaning`) === 'utmaning');
    setExtra(localStorage.getItem(`${daynumber}-extra`) === 'extra');
  }, [daynumber]);

  const getBackgroundColor = () => {
    const activeCount = [dagliga, mage, utmaning, extra].filter(Boolean).length;

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
    const program = localStorage.getItem('program');
    const peppDays: Record<string, number[]> = {
      '66': [7, 22, 33, 44, 66],
      '33': [7, 11, 17, 22, 33],
    };

    // Kontrollera om aktuellt program finns och om daynumber är en pepp-dag
    if (program && peppDays[program]?.includes(daynumber)) {
      const hasDagliga =
        localStorage.getItem(`${daynumber}-dagliga`) === 'dagliga';
      if (hasDagliga) {
        setShowPepp(true);
      }
    }
  };

  const getPeppTitle = () => {
    const program = localStorage.getItem('program');
    if (program === '66') {
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
    }
    if (program === '33') {
      if (daynumber === 7) {
        return 'Vecka 1 avklarad!';
      } else if (daynumber === 11) {
        return 'En tredjedel avklarad!';
      } else if (daynumber === 17) {
        return 'Halvvägs!';
      } else if (daynumber === 22) {
        return 'Två tredejedelar avklarade!';
      } else if (daynumber === 33) {
        return 'Du klarade det!';
      }
    }
  };

  const getPeppMessage = () => {
    const program = localStorage.getItem('program');
    if (program === '66') {
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
    }
    if (program === '33') {
      if (daynumber === 7) {
        return 'Du är fantastisk! Kämpa vidare så kommer det gå bra det här!';
      } else if (daynumber === 11) {
        return 'Grymt jobbat! Du har nu gjort en tredjedel av resan! Rutinerna börjar sätta sig och du är på god väg mot ditt mål. Fortsätt kämpa!';
      } else if (daynumber === 17) {
        return 'Halvägs, var stolt över dig själv! Du har kommit långt och det är dags att fortsätta kämpa mot målet. Du klarar det här!';
      } else if (daynumber === 22) {
        return 'Det kan kännas lite jobbigt eller så flyter det på lättare än du trott. Hur som helst, Fortsätt kämpa!';
      } else if (daynumber === 33) {
        return 'Du är i mål! Fantastiskt jobbat! Du har genomfört hela 66 dagar av träning och utmaningar. Du är en riktig kämpe och har visat att du kan nå dina mål. Njut av din prestation!';
      }
    }
  };

  // Hämta datum från localStorage
  const disabledDay = () => {
    const savedDateString = localStorage.getItem('startDatum');
    const startDate = dayjs(savedDateString).startOf('day');
    const today = dayjs().startOf('day');

    const daysSinceStart = today.diff(startDate, 'day') + 1;

    const isDisabled = daynumber <= daysSinceStart;
    return !isDisabled;
  };

  return (
    <>
      <Box
        className="flex items-center justify-center flex-col p-1"
        data-day={daynumber} // Lägg till detta för scroll-funktionalitet
      >
        <Box
          className={`w-12 h-12 mb-2 rounded-full flex justify-center items-center text-3xl md:text-4xl ${getBackgroundColor()} ${disabledDay() ? 'text-gray-400 cursor-not-allowed' : 'text-pink-900'} md:w-20 md:h-20`}
        >
          {daynumber}
        </Box>
        <Box className={'flex items-center flex-col md:flex-row'}>
          <Tooltip title="Dagliga">
            <>
              <BackHandIcon
                sx={{
                  fontSize: { xs: '1.5rem', md: '1.8rem' },
                }}
                className={`${dagliga ? 'text-pink-900 cursor-pointer hover:text-pink-900' : 'text-gray-300 hover:text-pink-300'} ${disabledDay() ? 'text-gray-300 hover:text-gray-300 cursor-not-allowed' : 'text-gray-300'}`}
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
                        handlePepp();
                      }
                }
              />
              <Typography variant="body2" className="text-gray-300 md:hidden">
                Dagliga
              </Typography>
            </>
          </Tooltip>

          <Tooltip title="Magträning">
            <>
              <FitnessCenterIcon
                sx={{
                  fontSize: { xs: '1.6rem', md: '2rem' },
                }}
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
                        }
                      }
                }
              />{' '}
              <Typography variant="body2" className="text-gray-300 md:hidden">
                Mage
              </Typography>
            </>
          </Tooltip>
          {utmaning || disabledDay() ? (
            <Tooltip title="Utmaning">
              <>
                <EmojiEventsIcon
                  sx={{
                    fontSize: { xs: '1.7rem', md: '2rem' },
                  }}
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
                />{' '}
                <Typography variant="body2" className="text-gray-300 md:hidden">
                  Utmaning
                </Typography>
              </>
            </Tooltip>
          ) : (
            <Tooltip title="Utmaning">
              <>
                <ConfettiButton variant="ghost">
                  <EmojiEventsIcon
                    sx={{
                      fontSize: { xs: '1.7rem', md: '2rem' },
                    }}
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
                <Typography variant="body2" className="text-gray-300 md:hidden">
                  Utmaning
                </Typography>
              </>
            </Tooltip>
          )}
          {extra || disabledDay() ? (
            <Tooltip title="Utmaning">
              <>
                <WorkspacePremiumIcon
                  sx={{
                    fontSize: { xs: '1.7rem', md: '2rem' },
                  }}
                  className={`${extra ? 'text-pink-900 hover:text-pink-900' : 'text-gray-300 hover:text-pink-300'} ${disabledDay() ? 'text-gray-300 hover:text-gray-300 cursor-not-allowed' : 'text-gray-300'}`}
                  onClick={
                    disabledDay()
                      ? undefined
                      : () => {
                          setExtra(!extra);
                          extra
                            ? localStorage.removeItem(`${daynumber}-extra`)
                            : localStorage.setItem(
                                `${daynumber}-extra`,
                                'extra'
                              );
                        }
                  }
                />{' '}
                <Typography variant="body2" className="text-gray-300 md:hidden">
                  Extra
                </Typography>
              </>
            </Tooltip>
          ) : (
            <Tooltip title="Extra">
              <>
                <ConfettiButton
                  variant="ghost"
                  options={{
                    shapes: ['star'],
                    particleCount: 40,
                    spread: 40,
                    colors: ['#FFD700', '#FFA500', '#FF6347'],
                  }}
                >
                  <WorkspacePremiumIcon
                    sx={{
                      fontSize: { xs: '1.7rem', md: '2rem' },
                    }}
                    className={`${extra ? 'text-pink-900 hover:text-pink-900' : 'text-gray-300 hover:text-pink-300'} ${disabledDay() ? 'text-gray-300 hover:text-gray-300 cursor-not-allowed' : 'text-gray-300'}`}
                    onClick={
                      disabledDay()
                        ? undefined
                        : () => {
                            setExtra(!extra);
                            extra
                              ? localStorage.removeItem(`${daynumber}-extra`)
                              : localStorage.setItem(
                                  `${daynumber}-extra`,
                                  extra ? '' : 'extra'
                                );
                          }
                    }
                  />
                </ConfettiButton>
                <Typography variant="body2" className="text-gray-300 md:hidden">
                  Extra
                </Typography>
              </>
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
        <Pepp
          title={getPeppTitle()}
          message={getPeppMessage()}
          onClose={() => setShowPepp(false)}
        />
      </Modal>
    </>
  );
}
