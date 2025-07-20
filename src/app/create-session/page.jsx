"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Nav from "@/components/navbar";

function generateRandomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomPassword(length = 8) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function CreateSessionPage() {
  const [sessionCode, setSessionCode] = useState("");
  const [sessionPassword, setSessionPassword] = useState("");
  const [name, setName] = useState("");
  const [class_section, setClass_section] = useState("");
  const [subject, setSubject] = useState("");

  const [students, setStudents] = useState([]);

  async function handleCreateSession() {
    const newCode = generateRandomCode();
    const newPassword = generateRandomPassword();

    await setDoc(doc(db, "sessions", newCode), {
      password: newPassword,
      createdAt: new Date().toISOString(),
      createdBy: name,
      class_section: class_section,
      status: "active",
      subject: subject,
    });

    setSessionCode(newCode);
    setSessionPassword(newPassword);
  }

  const inputHandler = (e) => {
    setName(e.target.value);
  };

  const class_sectionHandler = (e) => {
    setClass_section(e.target.value);
  };

  // ✅ LIVE SNAPSHOT LISTENER
  useEffect(() => {
    if (!sessionCode) return;

    const studentsRef = collection(db, "sessions", sessionCode, "students");

    const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({
          rollNumber: doc.id,
          ...doc.data(),
        });
      });
      setStudents(list);
    });

    return () => unsubscribe();
  }, [sessionCode]);

  return (
    <main className="p-6">
      <Nav />

      {!sessionCode && (
        <>
          <div className="flex flex-col gap-y-3 mt-15 md:mt-25">
            <label>Create New Session</label>
            <input
              type="text"
              placeholder="Professor Name"
              className="w-100 p-2 mb-2 text-white border-2 border-gray-700"
              value={name}
              onChange={inputHandler}
            />
            <label>Class-Section</label>
            <input
              type="text"
              placeholder="Example: A1-C"
              className="w-100 p-2 mb-2 text-white border-2 border-gray-700"
              value={class_section}
              onChange={class_sectionHandler}
            />
            <label>Subject</label>
            <input
              type="text"
              placeholder="Example: Physics"
              className="w-100 p-2 mb-2 text-white border-2 border-gray-700"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreateSession}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-5"
          >
            Create New Session
          </button>
        </>
      )}

      {sessionCode && (
        <div className="mt-25">
          <p className="flex gap-3">
            Professor:<strong>{name}</strong>
          </p>
          <p className="flex gap-3">
            Class-Section:<strong>{class_section}</strong>
          </p>
            <p className="flex gap-3">
  Subject: <strong>{subject}</strong>
</p>

          <p>
            Session Code: <strong>{sessionCode}</strong>
          </p>
          <p>
            Session Password: <strong>{sessionPassword}</strong>
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">Live Attendance Feed</h2>
          <button
            onClick={async () => {
              await setDoc(
                doc(db, "sessions", sessionCode),
                { status: "ended" },
                { merge: true }
              );
              alert("Session ended!");
              setSessionCode("");
              setSessionPassword("");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded mt-4"
          >
            End Session
          </button>

          <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-2xl">
            {students.length === 0 ? (
              <p className="text-gray-400">No students marked present yet.</p>
            ) : (
              <ul className="space-y-2">
                {students
                  .filter((s) => s.classSection === class_section)
                  .map((student) => (
                    <li
                      key={student.rollNumber}
                      className="flex flex-col gap-1 bg-gray-700 p-3 rounded"
                    >
                      <p>
                        <strong>Roll No:</strong> {student.rollNumber}
                      </p>
                      <p>
                        <strong>Name:</strong> {student.name || "-"}
                      </p>
                    
                      <p>
                        <strong>Time:</strong>{" "}
                        {new Date(student.timestamp).toLocaleTimeString()}
                      </p>
                      {student.selfieURL && (
                        <img
                          src={student.selfieURL}
                          alt="Selfie"
                          className="w-24 h-24 object-cover rounded border border-gray-500"
                        />
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
