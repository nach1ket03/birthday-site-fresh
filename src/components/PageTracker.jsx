import { useEffect } from "react";
import { logVisit } from "../lib/firestore";

export default function PageTracker({ dayId }) {
  useEffect(() => {
    // 1. Check if we already logged this day in this session (prevents refresh spam)
    const key = `visited_day_${dayId}`;
    if (sessionStorage.getItem(key)) return;

    // 2. Mark as visited so we don't log again instantly
    sessionStorage.setItem(key, "true");

    // 3. Send the ping
    logVisit(dayId);
  }, [dayId]);

  return null; // It renders nothing visibly
}