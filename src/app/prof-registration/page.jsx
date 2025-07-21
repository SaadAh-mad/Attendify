"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/navbar";
import { auth, provider, db } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ProfRegister() {
  const [user, setUser] = useState(null);
  const [sessionCode, setSessionCode] = useState("");
  const [sessionPassword, setSessionPassword] = useState("");
  const [sessionValid, setSessionValid] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [classSection, setClassSection] = useState("");
  const [subject, setSubject] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  function handleLogin() {
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => console.log("Login failed: ", error));
  }

  function handleLogout() {
    signOut(auth).then(() => {
      setUser(null);
      setSessionValid(false);
      setStudents([]);
    });
  }

  async function handleAccessSession() {
    if (!sessionCode || !sessionPassword) {
      alert("Please enter both code & password.");
      return;
    }

    const sessionRef = doc(db, "sessions", sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      alert("Session not found.");
      return;
    }

    const dbPassword = sessionSnap.data().password;

    if (dbPassword !== sessionPassword) {
      alert("Incorrect password.");
      return;
    }

    const expectedClassSection = sessionSnap.data().class_section || "";
    const dbSubject = sessionSnap.data().subject || "";
    setCreatedBy(sessionSnap.data().createdBy || "");
    setClassSection(expectedClassSection);
    setSubject(dbSubject); 
    setSessionValid(true);

    const studentsCol = collection(db, `sessions/${sessionCode}/students`);
    onSnapshot(studentsCol, (snapshot) => {
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredByClass = studentList.filter(
        (s) => s.classSection === expectedClassSection
      );

      setStudents(filteredByClass);
    });
  }

  function exportToCSV() {
    if (students.length === 0) {
      alert("No students to export.");
      return;
    }

    const headers = ["Roll Number", "Name", "Timestamp", "Selfie URL"];
    const rows = students.map((s) => [s.id, s.name, s.timestamp, s.selfieURL]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `attendance_${sessionCode}_${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportToPDF() {
    if (students.length === 0) {
      alert("No students to export.");
      return;
    }

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text(`Created by: ${createdBy}`, 14, 20);
    pdf.setFontSize(12);
    pdf.text(`Attendance Report: ${sessionCode}`, 14, 28);
    pdf.setFontSize(12);
    pdf.text(`Subject: ${subject}`, 14, 36); 

    const tableColumn = ["Roll Number", "Name", "Timestamp"];
    const tableRows = students.map((s) => [
      s.id,
      s.name,
      formatDate(s.timestamp),
    ]);

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
    });

    pdf.save(`attendance_${sessionCode}_${new Date().toISOString()}.pdf`);
  }

  const filteredStudents = students.filter((s) =>
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-l from-[#2e1a47] to-[#1a0d34] text-white mt-15 md:mt-35 md:pt-20">
      <Nav />

      {!user ? (
        <div className="flex flex-col items-center mt-10 px-4">
          <h2 className="text-2xl md:text-3xl pb-4 text-center">
            To access a session, please sign in
          </h2>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full"
            onClick={handleLogin}
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <section className="max-w-5xl mx-auto p-4 flex flex-col gap-8 mt-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-2xl md:text-3xl">Hello, {user.displayName}</p>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <button
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>

          {!sessionValid && (
            <div className="flex flex-col gap-4 items-center">
              <div className="flex flex-col w-full max-w-sm gap-2">
                <label className="text-lg">Session Code:</label>
                <input
                  type="text"
                  placeholder="Session Code"
                  className="p-3 rounded bg-gray-800 border border-gray-700"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-full max-w-sm gap-2">
                <label className="text-lg">Session Password:</label>
                <input
                  type="password"
                  placeholder="Session Password"
                  className="p-3 rounded bg-gray-800 border border-gray-700"
                  value={sessionPassword}
                  onChange={(e) => setSessionPassword(e.target.value)}
                />
              </div>

              <button
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full"
                onClick={handleAccessSession}
              >
                Access Session
              </button>
            </div>
          )}

          {sessionValid && (
            <div>
              <p className="text-lg mb-1">
                <strong>Professor:</strong> {createdBy}
              </p>
              <p className="text-lg mb-4">
                <strong>Class Section:</strong> {classSection}
              </p>
              <p className="text-lg mb-1">
  <strong>Subject:</strong> {subject}
</p>


              <h3 className="text-2xl mb-4">Live Attendance</h3>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full"
                    onClick={exportToCSV}
                  >
                    Export CSV
                  </button>
                  <button
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full"
                    onClick={exportToPDF}
                  >
                    Export PDF
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Total: {filteredStudents.length}</span>
                  <input
                    type="text"
                    placeholder="Search Roll No."
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

      {filteredStudents.length === 0 ? (
  <p>No students marked yet.</p>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-700 hidden md:table">
      <thead className="bg-gray-800">
        <tr>
          <th className="px-4 py-2 border">Roll Number</th>
          <th className="px-4 py-2 border">Name</th>
          <th className="px-4 py-2 border">Timestamp</th>
          <th className="px-4 py-2 border">Selfie</th>
        </tr>
      </thead>
      <tbody>
        {filteredStudents.map((s) => (
          <tr key={s.id} className="text-center">
            <td className="px-4 py-2 border">{s.id}</td>
            <td className="px-4 py-2 border">{s.name || "—"}</td>
            <td className="px-4 py-2 border">
              {formatDate(s.timestamp)}
            </td>
            <td className="px-4 py-2 border">
              <img
                src={s.selfieURL}
                alt="Selfie"
                className="w-16 h-16 rounded object-cover mx-auto"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Mobile stacked cards version */}
    <div className="flex flex-col gap-4 md:hidden">
      {filteredStudents.map((s) => (
        <div
          key={s.id}
          className="border border-gray-700 p-4 rounded bg-gray-800"
        >
          <p><strong>Roll Number:</strong> {s.id}</p>
          <p><strong>Name:</strong> {s.name || "—"}</p>
          <p><strong>Timestamp:</strong> {formatDate(s.timestamp)}</p>
          <div className="mt-2">
            <img
              src={s.selfieURL}
              alt="Selfie"
              className="w-32 h-32 rounded object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)}

            </div>
          )}
        </section>
      )}
    </main>
  );
}
