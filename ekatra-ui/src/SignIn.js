// src/SignIn.js
import React from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignIn() {
  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // After popup, onAuthStateChanged in App.js will fire
    } catch (err) {
      console.error("Sign‑in error:", err);
      alert("Failed to sign in: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Sign in to Sahayak</h2>
        <button
          onClick={handleSignIn}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}