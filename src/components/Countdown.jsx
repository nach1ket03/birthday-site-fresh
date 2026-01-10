import { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target Date: Feb 19, 2026
    const targetDate = new Date('2026-02-19T00:00:00');

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      fontFamily: 'var(--font-heading)'
    }}>
      {timeUnits.map((unit, index) => (
        <div key={index} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '50px'
        }}>
          <span style={{
            fontSize: '1.8rem',
            color: 'var(--text-main)',
            lineHeight: '1',
            fontVariantNumeric: 'tabular-nums' // Keeps numbers from jumping width
          }}>
            {unit.value.toString().padStart(2, '0')}
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            marginTop: '6px'
          }}>
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}