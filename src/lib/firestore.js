import { doc, setDoc, getDoc, collection, getDocs, Timestamp } from "firebase/firestore"; 
import { db } from "./firebase";

export async function saveGuess(userId, dayId, guessText) {
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

export async function loadReveals() {
  const ref = collection(db, "reveals");
  const snap = await getDocs(ref);
  return snap.docs.map(d => d.data());
}