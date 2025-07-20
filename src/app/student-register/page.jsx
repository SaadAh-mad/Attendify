"use client";

import Nav from "@/components/navbar";
import { useState } from "react";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; // adjust path

export default function StudentRegister() {
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [mobile, setMobile] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function generateUUID() {
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !section || !course || !year || !enrollment || !mobile || !rollNumber || !file) {
      alert("Please fill all fields and select a selfie.");
      return;
    }

    setIsSubmitting(true); // ✅ show "Submitting..."

    try {
      const studentDocID = `${section}_${rollNumber}`;
      let deviceID = localStorage.getItem(`deviceID_${section}`);
      if (!deviceID) {
        deviceID = generateUUID();
        localStorage.setItem(`deviceID_${section}`, deviceID);
      }

      const studentsRef = collection(db, "students");
      const q = query(studentsRef, where("deviceID", "==", deviceID));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        alert("❌ This device is already registered for another student. Please use a different device.");
        return;
      }

      const selfieRef = ref(storage, `students/${studentDocID}.jpg`);
      await uploadBytes(selfieRef, file);
      const selfieURL = await getDownloadURL(selfieRef);

      await setDoc(doc(db, "students", studentDocID), {
        name,
        section,
        course,
        year,
        enrollment,
        mobile,
        rollNumber,
        selfieURL,
        deviceID,
      });

      alert("✅ Your form has been submitted successfully!");

      setName("");
      setSection("");
      setCourse("");
      setYear("");
      setEnrollment("");
      setMobile("");
      setRollNumber("");
      setFile(null);
      setFileInputKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // ✅ done submitting
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-l from-[#2e1a47] to-[#1a0d34] text-white">
      <Nav />
      <div className="mt-20 px-4 md:px-20 md:mt-25 w-full">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl mx-auto flex flex-col gap-6 bg-gradient-to-l from-[#2e1a47] to-[#1a0d34] p-4 sm:p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-8">
            Register as a Student
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="section">Section</label>
              <input
                id="section"
                type="text"
                placeholder="example: A1-C"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="course">Course</label>
              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="">Select Course</option>
                <option value="btech">B.Tech</option>
                <option value="bsc">B.Sc.</option>
                <option value="bca">BCA</option>
                <option value="msc">M.Sc.</option>
                <option value="mtech">M.Tech.</option>
                <option value="polytechnic">Polytechnic</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="year">Year of Study</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="">Select Year</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="enrollment">Enrollment</label>
                <input
                  id="enrollment"
                  type="text"
                  placeholder="Enrollment"
                  value={enrollment}
                  onChange={(e) => setEnrollment(e.target.value)}
                  className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="mobile">Mobile</label>
                <input
                  id="mobile"
                  type="text"
                  placeholder="Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="class_roll_no">Class Roll no.</label>
                <input
                  id="class_roll_no"
                  type="number"
                  placeholder="Class roll no"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="selfie">Capture Selfie</label>
                <input
                  id="selfie"
                  type="file"
                  accept="image/*"
                  capture="user"
                  key={fileInputKey}
                  onChange={(e) => setFile(e.target.files[0])}
                  className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end mb-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg text-white text-lg font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition duration-300 ease-in-out ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <footer className="border-t border-gray-800 py-8 text-center">
        <p className="text-gray-400">
          Powered by{" "}
          <span className="text-orange-400 font-semibold">Firebase</span> &{" "}
          <span className="text-white font-semibold">Next.js</span>
        </p>
      </footer>
    </main>
  );
}
