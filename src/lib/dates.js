// Set this to your start date (e.g., Jan 1, 2025)
export const START_DATE = new Date(2025, 0, 1); 

export function getDayStatus(dayNumber) {
  const today = new Date();
  const unlockDate = new Date(START_DATE);
  unlockDate.setDate(START_DATE.getDate() + (dayNumber - 1));
  unlockDate.setHours(0, 0, 0, 0);
  return today >= unlockDate;
}

export function isRevealUnlocked() {
  const today = new Date();
  const revealDate = new Date(START_DATE);
  revealDate.setDate(START_DATE.getDate() + 30);
  return today >= revealDate;
}