import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  Timestamp 
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