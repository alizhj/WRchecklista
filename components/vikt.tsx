'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
// Confetti removed per request
// Snackbar removed per request

type Metrics = {
  weight: number;
  arm: number;
  thigh: number;
  belly: number;
  waist: number;
};
type MetricsHistoryEntry = {
  date: string;
  data: Metrics;
};

type ViktProps = {
  open: boolean;
  onClose: () => void;
};

const STORAGE_KEY = 'startMetrics';
const CURRENT_STORAGE_KEY = 'currentMetrics';
const HISTORY_STORAGE_KEY = 'metricsHistory';

export default function Vikt({ open, onClose }: ViktProps) {
  const [startMetrics, setStartMetrics] = useState<Metrics | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<Partial<Metrics>>({});
  const [phase, setPhase] = useState<'start' | 'current'>('start');
  const [showStart, setShowStart] = useState(false);
  const [history, setHistory] = useState<MetricsHistoryEntry[]>([]);
  // Snackbar removed per request
  // Confetti removed per request

  useEffect(() => {
    if (!open) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedCurrent = localStorage.getItem(CURRENT_STORAGE_KEY);
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
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

    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(
          storedHistory
        ) as MetricsHistoryEntry[];
        setHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
      } catch {
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, [open]);

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 320, md: 520 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#ffbde1',
    border: '2px solid #600336',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
  };

  // No manual sizing needed; Confetti component resizes itself

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
      const prevRaw = localStorage.getItem(CURRENT_STORAGE_KEY);
      const prev: Partial<Metrics> | null = prevRaw
        ? JSON.parse(prevRaw)
        : null;
      localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(currentMetrics));

      const prevWeight = prev?.weight;
      const newWeight = currentMetrics.weight;
      // Removed toast; no UI side-effect on weight decrease
      // Append full entry to history
      const entry: MetricsHistoryEntry = {
        date: new Date().toISOString(),
        data: currentMetrics as Metrics,
      };
      const nextHistory = [...history, entry];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
      setHistory(nextHistory);
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

  const lastDelta = useMemo(() => {
    if (!history || history.length < 2) return null;
    const prev = history[history.length - 2];
    const last = history[history.length - 1];
    const dw = last.data.weight - prev.data.weight; // positive means up
    return dw;
  }, [history]);

  const weights = useMemo(() => history.map(h => h.data.weight), [history]);

  const WeightChart = ({
    entries,
    width = 360,
    height = 160,
  }: {
    entries: MetricsHistoryEntry[];
    width?: number;
    height?: number;
  }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    if (!entries || entries.length === 0) return null;
    const data = entries.map(e => e.data.weight);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const paddingY = (max - min) * 0.1 || 1;
    const yMin = min - paddingY;
    const yMax = max + paddingY;
    const range = yMax - yMin || 1;

    const margin = { top: 10, right: 12, bottom: 28, left: 36 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const stepX = data.length > 1 ? w / (data.length - 1) : w;

    const xFor = (i: number) => margin.left + i * stepX;
    const yFor = (v: number) => margin.top + h - ((v - yMin) / range) * h;

    const linePoints = data.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ');

    const areaPoints = `${margin.left},${margin.top + h} ${linePoints} ${margin.left + w},${margin.top + h}`;

    const gridLines = 4;
    const yTicks: number[] = Array.from(
      { length: gridLines + 1 },
      (_, i) => yMin + (range * i) / gridLines
    );

    const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = (e.target as SVGElement)
        .closest('svg')
        ?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left - margin.left;
      const i = Math.round(x / stepX);
      if (i >= 0 && i < data.length) setHoverIndex(i);
    };

    const handleLeave = () => setHoverIndex(null);

    const firstDate = new Date(entries[0].date).toLocaleDateString();
    const lastDate = new Date(
      entries[entries.length - 1].date
    ).toLocaleDateString();

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          background: '#fff7fb',
          borderRadius: 8,
          border: '1px solid #60033633',
        }}
      >
        <defs>
          <linearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#600336" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#600336" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((yt, idx) => {
          const y = yFor(yt);
          return (
            <g key={idx}>
              <line
                x1={margin.left}
                y1={y}
                x2={margin.left + w}
                y2={y}
                stroke="#60033622"
                strokeDasharray="4 4"
              />
              <text
                x={margin.left - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                fill="#600336"
              >
                {yt.toFixed(1)}
              </text>
            </g>
          );
        })}

        <polyline
          points={`${margin.left},${margin.top + h} ${margin.left + w},${margin.top + h}`}
          stroke="#60033666"
          strokeWidth="1"
        />

        <polygon points={areaPoints} fill="url(#weightArea)" />
        <polyline
          points={linePoints}
          fill="none"
          stroke="#600336"
          strokeWidth="2.5"
        />

        {data.map((v, i) => (
          <circle
            key={i}
            cx={xFor(i)}
            cy={yFor(v)}
            r={3}
            fill={i === hoverIndex ? '#ff2e8b' : '#600336'}
          />
        ))}

        <text x={margin.left} y={height - 8} fontSize="10" fill="#600336aa">
          {firstDate}
        </text>
        <text
          x={margin.left + w}
          y={height - 8}
          fontSize="10"
          textAnchor="end"
          fill="#600336aa"
        >
          {lastDate}
        </text>

        {hoverIndex !== null && (
          <g>
            <line
              x1={xFor(hoverIndex)}
              y1={margin.top}
              x2={xFor(hoverIndex)}
              y2={margin.top + h}
              stroke="#ff2e8b66"
            />
            <rect
              x={Math.min(xFor(hoverIndex) + 8, margin.left + w - 90)}
              y={margin.top + 8}
              width={90}
              height={36}
              rx={6}
              ry={6}
              fill="#600336"
            />
            <text
              x={Math.min(xFor(hoverIndex) + 14, margin.left + w - 84)}
              y={margin.top + 22}
              fontSize="11"
              fill="#ffffff"
            >
              {new Date(entries[hoverIndex].date).toLocaleDateString()}
            </text>
            <text
              x={Math.min(xFor(hoverIndex) + 14, margin.left + w - 84)}
              y={margin.top + 34}
              fontSize="11"
              fill="#ffffff"
            >
              {data[hoverIndex].toFixed(1)} kg
            </text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <>
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
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Senaste invägning
              </Typography>
              {lastDelta !== null ? (
                <Typography sx={{ mb: 1 }}>
                  Förändring sedan förra invägning: {lastDelta > 0 ? '+' : ''}
                  {lastDelta.toFixed(1)} kg
                </Typography>
              ) : (
                <Typography sx={{ mb: 1 }}>
                  Lägg till minst två invägningar för att se förändring sedan
                  förra.
                </Typography>
              )}
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
                  <Divider sx={{ my: 2, borderColor: '#600336' }} />
                  {weights.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#333', mb: 0.5 }}
                      >
                        Vikt över tid
                      </Typography>
                      <WeightChart entries={history} />
                    </Box>
                  )}
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
    </>
  );
}
