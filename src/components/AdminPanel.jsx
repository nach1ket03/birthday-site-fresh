import React, { useState, useEffect } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AdminPanel() {
  const [day, setDay] = useState(1);
  const [actualGift, setActualGift] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  const handleSave = async () => {
    if (!actualGift || !description) return;
    setStatus("Saving...");
    try {
      // Save to "reveals" collection
      await setDoc(doc(db, "reveals", day.toString()), {
        day: parseInt(day),
        actualGift,
        description
      });
      setStatus(`Saved Day ${day}!`);
      // Clear for next input
      setActualGift("");
      setDescription("");
      setDay(d => d + 1);
    } catch (e) {
      console.error(e);
      setStatus("Error saving.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: 8 }}>Day Number</label>
        <input 
          type="number" 
          value={day} 
          onChange={(e) => setDay(parseInt(e.target.value))}
          className="input-field"
          style={{ padding: '8px 0', fontSize: '1.5rem' }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: 8 }}>The Actual Gift (Title)</label>
        <input 
          type="text" 
          value={actualGift} 
          onChange={(e) => setActualGift(e.target.value)}
          placeholder="e.g. A Vintage Watch"
          className="input-field"
          style={{ padding: '8px 0' }}
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: 8 }}>Description / Meaning</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why this gift?"
          className="input-field"
          rows={3}
          style={{ padding: '8px 0' }}
        />
      </div>

      <button onClick={handleSave} className="btn-primary" style={{ width: '100%' }}>
        Save Reveal
      </button>

      {status && <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--accent)' }}>{status}</p>}
    </div>
  );
}