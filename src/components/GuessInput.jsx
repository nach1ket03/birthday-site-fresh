import React, { useState, useEffect } from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { saveGuess, loadGuess } from "../lib/firestore";

export default function GuessInput({ dayId, hint }) {
  const [guess, setGuess] = useState("");
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const existing = await loadGuess(u.uid, dayId);
        if (existing) {
          setGuess(existing);
          setSaved(true);
        }
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    return () => unsub();
  }, [dayId]);

  return (
    <div style={{ marginTop: 20 }}>
      <p style={{ 
        fontSize: '0.85rem', 
        color: 'var(--accent)', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        marginBottom: 16 
      }}>
        {hint || "Reflection"}
      </p>

      <textarea
        className="input-field"
        placeholder={user ? "Write your thought here..." : "Connecting..."}
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={saved || !user}
        rows={1}
        style={{
            minHeight: '40px',
            marginBottom: '24px'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
        {saved && <span style={{ fontSize: '0.85rem', opacity: 0.5, fontStyle: 'italic' }}>Saved</span>}
        
        {!saved && (
          <button 
            className="btn-primary"
            style={{ padding: '10px 28px', fontSize: '0.85rem' }} 
            disabled={!user || !guess.trim()}
            onClick={() => user && saveGuess(user.uid, dayId, guess).then(() => setSaved(true))}
          >
            Save Note
          </button>
        )}
      </div>
    </div>
  );
}