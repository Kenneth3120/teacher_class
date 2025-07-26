import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveQuestion = async (questionText, responseText) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "questions"), {
    uid: user.uid,
    question: questionText,
    response: responseText,
    createdAt: serverTimestamp(),
  });
};