// src/components/Countdown.jsx
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

  return (
    <div style={{
      fontFamily: 'var(--font-heading)', // Playfair Display
      color: 'var(--accent)',
      fontSize: '1.1rem',
      letterSpacing: '0.05em',
      marginTop: '32px',
      marginBottom: '40px',
      opacity: 0.9
    }}>
      <span>{timeLeft.days.toString().padStart(2, '0')} Days</span>
      <span style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
      <span>{timeLeft.hours.toString().padStart(2, '0')} Hours</span>
      <span style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
      <span>{timeLeft.minutes.toString().padStart(2, '0')} Minutes</span>
      <span style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {timeLeft.seconds.toString().padStart(2, '0')} Seconds
      </span>
    </div>
  );
}