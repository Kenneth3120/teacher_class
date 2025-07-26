// src/firestoreHelpers.js
import { auth, db } from "./firebase";
import {
  doc, setDoc, getDoc, serverTimestamp,
  collection, addDoc,
  query, where, orderBy, getDocs
} from "firebase/firestore";

export async function saveUserProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:       user.uid,
      name:      user.displayName,
      email:     user.email,
      photoURL:  user.photoURL || null,
      role:      "student",
      createdAt: serverTimestamp(),
    });
  }
}

export async function saveQuestion(questionText, responseText) {
  const user = auth.currentUser;
  if (!user) return;
  await addDoc(collection(db, "questions"), {
    uid:       user.uid,
    question:  questionText,
    response:  responseText,
    createdAt: serverTimestamp(),
  });
}

export async function fetchUserQuestions() {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(
    collection(db, "questions"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}