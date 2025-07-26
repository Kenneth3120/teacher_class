import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const DoubtScheduler = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsCollectionRef = collection(db, "students");
      const data = await getDocs(studentsCollectionRef);
      setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchStudents();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }
    const newSession = { student: selectedStudent, date, time };
    await addDoc(collection(db, "sessions"), newSession);
    setSessions([...sessions, newSession]);
    setSelectedStudent("");
    setDate("");
    setTime("");
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Doubt Session Scheduler</h2>
      <form onSubmit={handleSchedule} className="space-y-4 mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold">Schedule a Session</h3>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">-- Select a student --</option>
          {students.map((student) => (
            <option key={student.id} value={student.name}>{student.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
        <button type="submit" className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600">
          Schedule Session
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Scheduled Sessions</h3>
        <div className="space-y-2">
          {sessions.map((session, index) => (
            <div key={index} className="p-3 bg-gray-100 rounded-lg">
              <p><strong>Student:</strong> {session.student}</p>
              <p><strong>Date:</strong> {session.date}</p>
              <p><strong>Time:</strong> {session.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoubtScheduler;