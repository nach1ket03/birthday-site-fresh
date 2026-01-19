// src/lib/dates.js

// 1. Use ISO format with the explicit Timezone Offset (+05:30 for IST).
// This ensures "Midnight" is the same absolute moment on both Server and Client.
export const START_DATE = new Date("2026-01-20T00:00:00+05:30"); 

export function getDayStatus(dayNumber) {
  const today = new Date();
  
  // Clone the start date
  const unlockDate = new Date(START_DATE);
  
  // Add the days. setDate handles month rollovers correctly.
  // Note: START_DATE.getDate() might return the previous day in UTC (e.g., 19th instead of 20th),
  // but adding the offset works consistently because we are modifying the same UTC timestamp.
  unlockDate.setDate(START_DATE.getDate() + (dayNumber - 1));

  // 2. REMOVED: unlockDate.setHours(0, 0, 0, 0); 
  // We removed this because it forces the time to 00:00 UTC (Server Time), 
  // which would push the unlock time to 5:30 AM IST. 
  // By removing it, we keep the "18:30 UTC" (which is 00:00 IST) time component intact.

  return today >= unlockDate;
}

export function isRevealUnlocked() {
  const today = new Date();
  const revealDate = new Date(START_DATE);
  revealDate.setDate(START_DATE.getDate() + 30);
  return today >= revealDate;
}