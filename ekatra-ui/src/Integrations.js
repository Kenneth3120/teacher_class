import React from "react";

const Integrations = () => {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Google Workspace & LMS Integration</h2>
      <p>Integration features will be implemented here.</p>
      <div className="mt-4 space-y-2">
        <button className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
          Connect to Google Calendar
        </button>
        <button className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
          Export Grades to Google Sheets
        </button>
        <button className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
          Import Roster from LMS
        </button>
      </div>
    </div>
  );
};

export default Integrations;