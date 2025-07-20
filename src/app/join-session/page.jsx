"use client";

import Nav from "@/components/navbar";
import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; // adjust your path

export default function JoinSession() {
  const [sessionCode, setSessionCode] = useState("");
  const [sessionValid, setSessionValid] = useState(false);
  const [classSection, setClassSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0); // ✅ add this

  const inputHandler = (e) => setSessionCode(e.target.value);
  const rollHandler = (e) => setRollNumber(e.target.value);
  const fileHandler = (e) => setFile(e.target.files[0]);
  const classSectionHandler = (e) => setClassSection(e.target.value);

// STEP 1️⃣: Check session code only
async function handleJoinSession() {
  const trimmedSessionCode = sessionCode.trim();

  if (!trimmedSessionCode) {
    alert("Please enter session code");
    return;
  }

  const sessionRef = doc(db, "sessions", trimmedSessionCode);
  const sessionSnap = await getDoc(sessionRef);

  if (!sessionSnap.exists()) {
    alert("Invalid session code");
    return;
  }

  const status = sessionSnap.data().status || "ended";
  if (status === "ended") {
    alert("This session has ended. Attendance is closed.");
    return;
  }

  setSessionCode(trimmedSessionCode); // store trimmed
  setSessionValid(true);
}

// STEP 2️⃣: Mark attendance
async function handleMarkAttendance() {
  const trimmedSessionCode = sessionCode.trim();
  const trimmedClassSection = classSection.trim();
  const trimmedRollNumber = rollNumber.trim();

  if (!trimmedRollNumber || !file || !trimmedClassSection) {
    alert("Please enter all details");
    return;
  }

  const localDeviceID = localStorage.getItem(`deviceID_${trimmedClassSection}`);
  if (!localDeviceID) {
    alert("Device not registered! Please register first.");
    return;
  }

  const sessionRef = doc(db, "sessions", trimmedSessionCode);
  const sessionSnap = await getDoc(sessionRef);

  if (!sessionSnap.exists()) {
    alert("Session does not exist.");
    return;
  }

  const status = sessionSnap.data().status || "ended";
  if (status === "ended") {
    alert("This session has ended. Attendance is closed.");
    return;
  }

  const sessionClassSection = sessionSnap.data().class_section;
  if (sessionClassSection !== trimmedClassSection) {
    alert(`This session is only for ${sessionClassSection}. You entered ${trimmedClassSection}.`);
    return;
  }

  const studentDocID = `${trimmedClassSection}_${trimmedRollNumber}`;
  const studentRef = doc(db, "students", studentDocID);
  const studentSnap = await getDoc(studentRef);

  if (!studentSnap.exists()) {
    alert("Student not registered.");
    return;
  }

  const studentData = studentSnap.data();
  const studentName = studentData.name; // ✅ only AFTER checking exists!

  const dbDeviceID = studentSnap.data().deviceID;
  if (dbDeviceID !== localDeviceID) {
    alert("Device mismatch. Use your original device.");
    return;
  }

  const selfieRef = ref(storage, `sessions/${trimmedSessionCode}/${studentDocID}.jpg`);
  await uploadBytes(selfieRef, file);
  const selfieURL = await getDownloadURL(selfieRef);

  await setDoc(doc(db, `sessions/${trimmedSessionCode}/students`, studentDocID), {
    name: studentName, // ✅ now it won't be undefined
    timestamp: new Date().toISOString(),
    selfieURL,
    deviceID: localDeviceID,
    classSection: trimmedClassSection,
  });

  alert("✅ Attendance marked successfully!");

  setRollNumber("");
  setFile(null);
  setFileInputKey((prev) => prev + 1);
  setSessionValid(false);
  setSessionCode("");
}




  return (
    <>
      <Nav />
      <div className="flex flex-col gap-y-4 items-center p-6 bg-transparent from-[#2e1a47] to-[#1a0d34] mt-15 md:mt-25 w-full">
  <label>Enter Session Code:</label>
  <input
    type="text"
    placeholder="Session code"
    className="p-3 w-full max-w-sm h-12 text-white border-2 border-gray-200 rounded mx-4"
    value={sessionCode}
    onChange={inputHandler}
  />

  {!sessionValid && (
    <button
      onClick={handleJoinSession}
      className="bg-blue-600 text-white px-6 py-3 rounded-full mt-2"
    >
      Join Session
    </button>
  )}

  {sessionValid && (
    <>
      <label>Enter Roll Number:</label>
      <input
        type="text"
        placeholder="Roll Number"
        className="p-3 w-full max-w-sm h-12 text-white border-2 border-gray-200 rounded mx-4"
        value={rollNumber}
        onChange={rollHandler}
      />

      <label>Class-Section:</label>
      <input
        type="text"
        placeholder="Example: A1-C"
        className="p-3 w-full max-w-sm h-12 text-white border-2 border-gray-200 rounded mx-4"
        value={classSection}
        onChange={classSectionHandler}
      />

      <label>Upload Selfie:</label>
      <input
        key={fileInputKey}
        id="selfie"
        type="file"
        accept="image/*"
        capture="user"
        onChange={fileHandler}
        className="p-3 w-full max-w-sm text-white border-2 border-gray-200 rounded mx-4"
      />

      <button
        onClick={handleMarkAttendance}
        className="bg-green-600 text-white px-6 py-3 rounded-full mt-4"
      >
        Mark Attendance
      </button>
    </>
  )}
</div>

    </>
  );
}
