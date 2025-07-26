import React from "react";
import { auth } from "./firebase";

const Settings = ({ user }) => {
  const handleSignOut = () => {
    auth.signOut().catch((error) => {
      console.error("Error signing out: ", error);
      alert("There was an issue signing out. Please try again.");
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <p className="mt-1 text-lg text-gray-900">{user?.displayName || "Not set"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-lg text-gray-900">{user?.email || "Not set"}</p>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Settings;