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
    <div style={{ marginTop: 40, padding: 20, background: 'rgba(0,0,0,0.03)', borderRadius: 12 }}>
      <p style={{ fontSize: '0.9rem', opacity: 0.7, fontStyle: 'italic', marginBottom: 12 }}>
        {hint || "Write a note..."}
      </p>
      <textarea
        className="input-field"
        placeholder={user ? "Type here..." : "Connecting..."}
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={saved || !user}
        rows={1}
      />
      {!saved && (
        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <button 
            className="btn-primary" 
            disabled={!user || !guess.trim()}
            onClick={() => user && saveGuess(user.uid, dayId, guess).then(() => setSaved(true))}
          >
            Save
          </button>
        </div>
      )}
      {saved && <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: 8 }}>Saved.</p>}
    </div>
  );
}