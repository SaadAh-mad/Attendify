"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Body() {
  return (
    <>
      <main className="container mx-auto px-4 md:px-8 py-12  mt-10 md:mt-30">
        {/* Hero Section */}
        <div className="flex flex-col mb-5 md:ml-10">
          <h1 className="text-4xl md:text-6xl bg-gradient-to-r from-[#e2c9eb] to-purple-700 bg-clip-text text-transparent leading-tight md:mb-5">
            Smarter Attendance for <br />
            <span className="font-bold text-5xl md:text-7xl">Smarter Classrooms</span>
          </h1>
          <p className="text-[1.1rem] md:text-[1.2rem] leading-7 tracking-wider mb-4 md:mt-2">
            Built for classrooms that value time. Attendance done right, so teaching stays first.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-5 md:ml-10 mb-10 md:mb-30">
          <Link href={"/join-session"}>
            <Button
              variant="outline"
              className="w-full md:w-auto border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white p-5"
            >
              Join a Session
            </Button>
          </Link>
          <Link href={"/create-session"}>
            <Button
              className="w-full md:w-auto border-gray-600 text-black bg-[#9f7bcd] hover:bg-purple-300 p-5"
            >
              Create a Session
            </Button>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 px-4 md:ml-10 md:mr-10">
          {/* Students Section */}
          <Card className="bg-gradient-to-l from-[#2e1a47] to-[#1a0d34]">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-3 rounded-full w-fit">
                {/* Student Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="50px" fill="#e3e3e3"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/></svg>
              </div>
              <CardTitle className="text-[1.4rem] text-white">
                Not registered yet? Complete your student registration to join sessions.
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Link href={"/student-register"}>
                <Button className="w-full md:w-fit bg-[#9f7bcd] hover:bg-purple-300 text-black p-5 text-lg">
                  Register as Student
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Professors Section */}
          <Card className="bg-gradient-to-r from-[#2e1a47] to-[#1a0d34]">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-3 rounded-full w-fit">
                {/* Professor Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="50px" fill="#e3e3e3"><path d="M840-120v-640H120v320H40v-320q0-33 23.5-56.5T120-840h720q33 0 56.5 23.5T920-760v560q0 33-23.5 56.5T840-120ZM360-400q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM40-80v-112q0-34 17.5-62.5T104-298q62-31 126-46.5T360-360q66 0 130 15.5T616-298q29 15 46.5 43.5T680-192v112H40Zm80-80h480v-32q0-11-5.5-20T580-226q-54-27-109-40.5T360-280q-56 0-111 13.5T140-226q-9 5-14.5 14t-5.5 20v32Zm240-400Zm0 400Z"/></svg>
              </div>
              <CardTitle className="text-[1.4rem] text-white">
                Want to access and manage sessions? Register as an educator first.
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Link href={"/prof-registration"}>
                <Button className="w-full md:w-fit bg-[#9f7bcd] hover:bg-purple-300 text-black p-5 text-lg">
                  Register as Professor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <section id="how-it-works" className="mt-16 px-4 md:px-10 md:ml-10 md:mr-10 md:mt-25 md:mb-15 ">
          <h2  className="text-4xl font-semibold text-center mb-10 bg-gradient-to-r from-[#e2c9eb] to-purple-500 bg-clip-text text-transparent md:mb-15">
            HOW IT WORKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-[#9060ce] rounded-full w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e3e3e3"><path d="M240-120h480v-80H520v-288l64 64 56-56-160-160-160 160 56 56 64-64v288H240v80Zm240-360ZM160-320q-33 0-56.5-23.5T80-400v-360q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v360q0 33-23.5 56.5T800-320H600v-80h200v-360H160v360h200v80H160Z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Join a Session</h3>
              <p className="text-gray-400">
                Professor generates a unique session code for students to join.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-[#9060ce] rounded-full w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80Z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Mark Attendance</h3>
              <p className="text-gray-400">
                Enter Roll No. and Section → Upload Selfie
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-[#9060ce] rounded-full w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e3e3e3"><path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160Zm0-80h640v-560H160v560Zm40-80h200v-80H200v80Zm382-80 198-198-57-57-141 142-57-57-56 57 113 113Zm-382-80h200v-80H200v80Zm0-160h200v-80H200v80Z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Professor checks attendance live</h3>
              <p className="text-gray-400">
                Real-time attendance tracking with photo verification and analytics.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-8 px-4 md:px-10">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-2">
            Powered by <span className="text-orange-400 font-semibold">Firebase</span> &{" "}
            <span className="text-white font-semibold">Next.js</span>
          </p>
          <p className="text-gray-400 mb-2">
            Developed by: <span className="font-bold text-white">Saad Ahmad</span>
          </p>
        </div>
      </footer>
    </>
  );
}
