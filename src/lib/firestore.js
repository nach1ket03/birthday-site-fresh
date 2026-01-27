import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  Timestamp,
  addDoc
} from "firebase/firestore"; 
import { db } from "./firebase";

// --- User Functions (Saving Guesses) ---

export async function saveGuess(userId, dayId, guessText) {
  // Path: users -> [USER_ID] -> guesses -> [DAY_ID]
  const ref = doc(db, "users", userId, "guesses", dayId.toString());
  await setDoc(ref, { 
    guess: guessText,
    day: parseInt(dayId),
    timestamp: Timestamp.now()
  });
}

export async function loadGuess(userId, dayId) {
  const ref = doc(db, "users", userId, "guesses", dayId.toString());
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().guess : null;
}

export async function loadAllGuesses(userId) {
  const ref = collection(db, "users", userId, "guesses");
  const snap = await getDocs(ref);
  return snap.docs.map(d => d.data());
}

// --- Reveal Functions (The Admin Secrets) ---

export async function loadReveals() {
  // Path: reveals (collection)
  const ref = collection(db, "reveals");
  const snap = await getDocs(ref);
  // Returns an array of all reveal objects
  return snap.docs.map(d => d.data());
}

export async function logVisit(dayId) {
  try {
    // 1. Log to Firebase (Permanent Record)
    const ref = collection(db, "visits");
    await addDoc(ref, {
      day: parseInt(dayId),
      timestamp: Timestamp.now(),
      dateString: new Date().toLocaleString()
    });

    // 2. Send Discord Notification (The "Ping")
    // Replace this URL with your actual Discord Webhook URL
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1465592368492183662/7wnFIsdofE0lJsSy22N4BwYCkj8e7V468JyQze8wA1ILZhbSdNpzODoNDCuIY9bggAcK"; 
    
    // Only ping if we have a URL and we aren't on localhost (optional)
    if (WEBHOOK_URL && !window.location.hostname.includes("localhost")) {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📖 **Someone opened Day ${dayId}**\nTime: ${new Date().toLocaleTimeString()}`
        })
      });
    }

  } catch (e) {
    console.error("Error logging visit:", e);
  }
}