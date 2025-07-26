import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [editingId, setEditingId] = useState(null);

  const studentsCollectionRef = collection(db, "students");

  const fetchStudents = async () => {
    const data = await getDocs(studentsCollectionRef);
    setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const studentDoc = doc(db, "students", editingId);
      await updateDoc(studentDoc, { name, grade });
      setEditingId(null);
    } else {
      await addDoc(studentsCollectionRef, { name, grade });
    }
    setName("");
    setGrade("");
    fetchStudents();
  };

  const handleEdit = (student) => {
    setName(student.name);
    setGrade(student.grade);
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
    fetchStudents();
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold">{editingId ? "Edit Student" : "Add Student"}</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Grade"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
          {editingId ? "Update Student" : "Add Student"}
        </button>
        {editingId && (
          <button onClick={() => setEditingId(null)} className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 mt-2">
            Cancel
          </button>
        )}
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Student List</h3>
        <button
          onClick={() => {
            const grouped = students.reduce((acc, student) => {
              const grade = student.grade || "Ungraded";
              if (!acc[grade]) {
                acc[grade] = [];
              }
              acc[grade].push(student);
              return acc;
            }, {});
            setStudents(Object.values(grouped).flat());
          }}
          className="mb-4 bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600"
        >
          Cluster by Grade
        </button>
        <div className="space-y-2">
          {students.map((student) => (
            <div key={student.id} className="p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <span>{student.name} - Grade {student.grade}</span>
                <div>
                  <button onClick={() => handleEdit(student)} className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2">Edit</button>
                  <button onClick={() => handleDelete(student.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg">Delete</button>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Feedback</h4>
                <textarea
                  placeholder="Add feedback..."
                  className="w-full mt-1 p-2 border rounded"
                  defaultValue={student.feedback || ""}
                  onBlur={(e) => {
                    const studentDoc = doc(db, "students", student.id);
                    updateDoc(studentDoc, { feedback: e.target.value });
                  }}
                />
                <div className="mt-2">
                  <h4 className="font-semibold">Rating</h4>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    defaultValue={student.rating || "3"}
                    onBlur={(e) => {
                      const studentDoc = doc(db, "students", student.id);
                      updateDoc(studentDoc, { rating: e.target.value });
                    }}
                  >
                    <option value="1">1 - Needs Improvement</option>
                    <option value="2">2 - Satisfactory</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentManager;