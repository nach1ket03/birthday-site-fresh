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
        setUnlocked(isRevealUnlocked());
        async function fetchData() {
            try {
                const revealData = await loadReveals();
                setReveals(revealData);
                if (auth.currentUser) {
                    const userGuesses = await loadAllGuesses(auth.currentUser.uid);
                    setGuesses(userGuesses);
                }
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        }
        fetchData();
    }, []);

    if (loading) return <div style={{ textAlign: "center", marginTop: 80, opacity: 0.5 }}>Loading...</div>;

    return (
        <div style={{ position: 'relative' }}>
             {!unlocked && (
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <p style={{ fontSize: '1.1rem', fontStyle: 'italic', opacity: 0.7 }}>
                        "Patience is the calm acceptance that things can happen<br/>in a different order than the one you have in mind."
                    </p>
                </div>
            )}

            <div style={{ 
                filter: unlocked ? 'none' : 'blur(16px)', 
                opacity: unlocked ? 1 : 0.6,
                pointerEvents: unlocked ? 'auto' : 'none',
                transition: 'all 1s ease'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {reveals.map((rev) => {
                        const userGuessObj = guesses.find(g => g.day === rev.day);
                        const userGuess = userGuessObj ? userGuessObj.guess : "";

                        return (
                            <div key={rev.day} style={{ 
                                background: 'rgba(255,255,255,0.5)', 
                                padding: '32px', 
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.6)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ 
                                    fontFamily: 'var(--font-heading)', 
                                    fontSize: '1.5rem', 
                                    marginBottom: '24px',
                                    color: 'var(--accent)'
                                }}>
                                    Day {rev.day}
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                    <div style={{ borderRight: '1px solid rgba(0,0,0,0.05)', paddingRight: '16px' }}>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>You Thought</span>
                                        <p style={{ fontStyle: 'italic', marginTop: '8px', opacity: 0.8 }}>
                                            {userGuess || "..."}
                                        </p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>The Truth</span>
                                        <h3 style={{ fontSize: '1.2rem', marginTop: '8px', marginBottom: '4px' }}>{rev.actualGift}</h3>
                                        <p style={{ fontSize: '0.95rem', margin: 0, opacity: 0.7 }}>{rev.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {!unlocked && (
                <div style={{ 
                    position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--bg-color)', padding: '16px 32px', borderRadius: 50,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12,
                    zIndex: 20
                }}>
                    <span style={{ fontSize: '1.2rem' }}>🔒</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>Locked</span>
                </div>
            )}
        </div>
    );
}