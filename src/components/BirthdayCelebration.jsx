// src/components/BirthdayCelebration.jsx
import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

export default function BirthdayCelebration() {
  
  // Function to trigger the confetti
  const triggerFireworks = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  // Trigger automatically when the component mounts
  useEffect(() => {
    triggerFireworks();
  }, [triggerFireworks]);

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      
      {/* Animated Greeting */}
      <div className="stagger-1">
        <h1 style={{ 
          marginBottom: '24px',
          fontSize: '3.5rem',
          lineHeight: '1.2',
          background: 'linear-gradient(135deg, var(--text-main) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Happy Birthday!
        </h1>
      </div>

      {/* The Final Message */}
      <div className="stagger-2" style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <p style={{ 
          fontSize: '1.2rem', 
          fontStyle: 'italic',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}>
          May this year bring you as much joy as you bring to everyone around you.
          Here is to new adventures, quiet moments, and everything in between.
        </p>
        <p style={{ 
          fontSize: '1.1rem',
          color: 'var(--text-main)',
          opacity: 0.8
        }}>
          Keep shining.
        </p>
      </div>

      {/* Interactive Button */}
      <div className="stagger-3">
        <button 
          onClick={triggerFireworks}
          className="btn-primary"
          style={{
            marginTop: '20px',
            fontSize: '1rem'
          }}
        >
          Celebrate Again 🎉
        </button>
      </div>

    </div>
  );
}