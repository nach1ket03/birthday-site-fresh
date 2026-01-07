import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { loadAllGuesses, loadReveals } from "../lib/firestore";
import { isRevealUnlocked } from "../lib/dates";

export default function RevealFeed() {
    const [guesses, setGuesses] = useState([]);
    const [reveals, setReveals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        // 1. Check if the date has passed
        setUnlocked(isRevealUnlocked());

        async function fetchData() {
            try {
                // 2. Load the actual answers (Gifts)
                const revealData = await loadReveals();
                setReveals(revealData);

                // 3. Load the user's private notes (if logged in)
                if (auth.currentUser) {
                    const userGuesses = await loadAllGuesses(auth.currentUser.uid);
                    setGuesses(userGuesses);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: 100, opacity: 0.5 }}>Loading...</div>;
    }

    return (
        <div style={{ position: 'relative' }}>
             {/* Header Info */}
             {!unlocked && (
                <div style={{ textAlign: 'center', marginBottom: 40, opacity: 0.7 }}>
                    <p>Some things make sense only when the time is right.<br/>Wait for the final day.</p>
                </div>
            )}

            {/* The Content - Blurred if locked */}
            <div style={{ filter: unlocked ? 'none' : 'blur(12px)', transition: 'filter 0.5s', pointerEvents: unlocked ? 'auto' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {reveals.map((rev) => {
                        const userGuessObj = guesses.find(g => g.day === rev.day);
                        const userGuess = userGuessObj ? userGuessObj.guess : "No note written.";

                        return (
                            <div key={rev.day} style={{ 
                                background: 'rgba(255,255,255,0.4)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.5)' 
                            }}>
                                <div style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: 12 }}>Day {rev.day}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    {/* Left: User's Guess */}
                                    <div>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>You Thought</span>
                                        <p style={{ fontStyle: 'italic', opacity: 0.8, marginTop: 4 }}>"{userGuess}"</p>
                                    </div>
                                    {/* Right: Actual Gift */}
                                    <div>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)' }}>The Gift</span>
                                        <h3 style={{ fontSize: '1.1rem', margin: '4px 0' }}>{rev.actualGift}</h3>
                                        <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>{rev.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {reveals.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No reveals found in database.</p>}
                </div>
            </div>

            {/* Lock Overlay */}
            {!unlocked && (
                <div style={{ 
                    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--bg-color)', padding: '20px 40px', borderRadius: 50,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 10
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🔒</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Locked</span>
                </div>
            )}
        </div>
    );
}