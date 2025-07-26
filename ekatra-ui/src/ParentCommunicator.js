import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const ParentCommunicator = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsCollectionRef = collection(db, "students");
      const data = await getDocs(studentsCollectionRef);
      setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchStudents();
  }, []);

  const handleSend = () => {
    if (!selectedStudent || !message) {
      setStatus("Please select a student and write a message.");
      return;
    }
    // In a real app, this would trigger an email or SMS API.
    // For this demo, we'll just show a success message.
    setStatus(`Message sent to ${selectedStudent}'s parent: "${message}"`);
    setMessage("");
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Parent Communicator</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
          <select
            id="student-select"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Select a student --</option>
            {students.map((student) => (
              <option key={student.id} value={student.name}>{student.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows="4"
            placeholder="Write a message to the parent..."
          />
        </div>
        <button onClick={handleSend} className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">
          Send Message
        </button>
        {status && <p className="mt-4 text-center p-2 bg-green-100 text-green-800 rounded-lg">{status}</p>}
      </div>
    </div>
  );
};

export default ParentCommunicator;