'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Metrics = {
  weight: number;
  arm: number;
  thigh: number;
  belly: number;
  waist: number;
};

type ViktProps = {
  open: boolean;
  onClose: () => void;
};

const STORAGE_KEY = 'startMetrics';
const CURRENT_STORAGE_KEY = 'currentMetrics';

export default function Vikt({ open, onClose }: ViktProps) {
  const [startMetrics, setStartMetrics] = useState<Metrics | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<Partial<Metrics>>({});
  const [phase, setPhase] = useState<'start' | 'current'>('start');
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    if (!open) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedCurrent = localStorage.getItem(CURRENT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Metrics;
        setStartMetrics(parsed);
        setPhase('current');
      } catch {
        setStartMetrics(null);
        setPhase('start');
      }
    } else {
      setStartMetrics(null);
      setPhase('start');
    }

    if (storedCurrent) {
      try {
        const parsedCurrent = JSON.parse(storedCurrent) as Partial<Metrics>;
        setCurrentMetrics(parsedCurrent);
      } catch {
        setCurrentMetrics({});
      }
    } else {
      setCurrentMetrics({});
    }
  }, [open]);

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 320, md: 520 },
    bgcolor: '#ffbde1',
    border: '2px solid #600336',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
  };

  const labels: Record<keyof Metrics, string> = {
    weight: 'Vikt (kg)',
    arm: 'Arm (cm)',
    thigh: 'Lår (cm)',
    belly: 'Mage (cm)',
    waist: 'Midja (cm)',
  };

  const [startForm, setStartForm] = useState<Partial<Metrics>>({});

  const isStartValid = useMemo(() => {
    return (
      startForm.weight! > 0 &&
      startForm.arm! > 0 &&
      startForm.thigh! > 0 &&
      startForm.belly! > 0 &&
      startForm.waist! > 0
    );
  }, [startForm]);

  const isCurrentValid = useMemo(() => {
    return (
      currentMetrics.weight! > 0 &&
      currentMetrics.arm! > 0 &&
      currentMetrics.thigh! > 0 &&
      currentMetrics.belly! > 0 &&
      currentMetrics.waist! > 0
    );
  }, [currentMetrics]);

  const handleStartChange = (key: keyof Metrics, value: string) => {
    setStartForm(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const handleCurrentChange = (key: keyof Metrics, value: string) => {
    setCurrentMetrics(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const saveCurrent = () => {
    if (!isCurrentValid) return;
    try {
      localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(currentMetrics));
    } catch {}
  };

  const saveStart = () => {
    if (!isStartValid) return;
    const payload = startForm as Metrics;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setStartMetrics(payload);
    setPhase('current');
  };

  const deltas = useMemo(() => {
    if (!startMetrics) return null;
    if (!isCurrentValid) return null;
    const diff: Metrics = {
      weight: startMetrics.weight - (currentMetrics.weight as number),
      arm: startMetrics.arm - (currentMetrics.arm as number),
      thigh: startMetrics.thigh - (currentMetrics.thigh as number),
      belly: startMetrics.belly - (currentMetrics.belly as number),
      waist: startMetrics.waist - (currentMetrics.waist as number),
    };

    return { diff };
  }, [startMetrics, currentMetrics, isCurrentValid]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="vikt-modal-title">
      <Box sx={style}>
        <IconButton
          aria-label="Stäng"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: '#600336' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          id="vikt-modal-title"
          variant="h4"
          component="h2"
          sx={{ textAlign: 'center' }}
        >
          Mätningar
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          {phase === 'start' ? 'Spara startvärden' : 'Ange nuvarande värden'}
        </Typography>

        {phase === 'start' ? (
          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            {(Object.keys(labels) as (keyof Metrics)[]).map(k => (
              <TextField
                key={k}
                type="number"
                label={labels[k]}
                inputProps={{ step: '0.1' }}
                value={startForm[k] ?? ''}
                onChange={e => handleStartChange(k, e.target.value)}
                variant="outlined"
              />
            ))}

            <Box
              sx={{
                gridColumn: { xs: 'auto', sm: '1 / -1' },
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                disabled={!isStartValid}
                onClick={saveStart}
                sx={{ background: '#600336' }}
              >
                Spara startvärden
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {(Object.keys(labels) as (keyof Metrics)[]).map(k => (
                <TextField
                  key={k}
                  type="number"
                  label={labels[k]}
                  inputProps={{ step: '0.1' }}
                  value={currentMetrics[k] ?? ''}
                  onChange={e => handleCurrentChange(k, e.target.value)}
                  variant="outlined"
                />
              ))}
            </Box>

            {startMetrics && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="text"
                  onClick={() => setShowStart(v => !v)}
                  sx={{ color: '#600336', p: 0, minWidth: 0 }}
                >
                  {showStart ? 'Dölj startvärden' : 'Visa startvärden'}
                </Button>
                {showStart && (
                  <Box
                    sx={{
                      mt: 1,
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 1,
                    }}
                  >
                    <Typography>Vikt (kg): {startMetrics.weight}</Typography>
                    <Typography>Arm (cm): {startMetrics.arm}</Typography>
                    <Typography>Lår (cm): {startMetrics.thigh}</Typography>
                    <Typography>Mage (cm): {startMetrics.belly}</Typography>
                    <Typography>Midja (cm): {startMetrics.waist}</Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={saveCurrent}
                disabled={!isCurrentValid}
                sx={{ background: '#600336' }}
              >
                Spara
              </Button>
            </Box>

            <Divider sx={{ my: 2, borderColor: '#600336' }} />

            {deltas ? (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Förändring
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1,
                  }}
                >
                  <Typography>
                    Vikt: {deltas.diff.weight > 0 ? '-' : '+'}
                    {Math.abs(deltas.diff.weight).toFixed(1)} kg
                  </Typography>
                  <Typography>
                    Arm: {deltas.diff.arm > 0 ? '-' : '+'}
                    {Math.abs(deltas.diff.arm).toFixed(1)} cm
                  </Typography>
                  <Typography>
                    Lår: {deltas.diff.thigh > 0 ? '-' : '+'}
                    {Math.abs(deltas.diff.thigh).toFixed(1)} cm
                  </Typography>
                  <Typography>
                    Mage: {deltas.diff.belly > 0 ? '-' : '+'}
                    {Math.abs(deltas.diff.belly).toFixed(1)} cm
                  </Typography>
                  <Typography>
                    Midja: {deltas.diff.waist > 0 ? '-' : '+'}
                    {Math.abs(deltas.diff.waist).toFixed(1)} cm
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: '#333' }}>
                Fyll i alla nuvarande värden för att se förändringarna.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
