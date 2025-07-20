"use client"; // if you're using Next.js App Router

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full border-b border-white/20 backdrop-blur-md z-50 p-2 md:p-6 md:pl-8 md:pr-8">
      <div className="flex justify-between items-center md:ml-10">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
   <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="50px" fill="#e3e3e3"><path d="M240-360h280l80-80H240v80Zm0-160h240v-80H240v80Zm-80-160v400h280l-80 80H80v-560h800v120h-80v-40H160Zm756 212q5 5 5 11t-5 11l-36 36-70-70 36-36q5-5 11-5t11 5l48 48ZM520-120v-70l266-266 70 70-266 266h-70ZM160-680v400-400Z"/></svg>
          <span className="text-white font-bold text-1xl md:text-3xl ">
            ATTENDIFY
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-12 text-white font-mono text-xl">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <a href="#how-it-works" className="hover:text-gray-400">How It Works</a>
          <Link href="#" className="hover:text-gray-400"></Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 text-white font-mono text-lg">
          <Link href="/" className="hover:text-black" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="#how-it-works" className="hover:text-black" onClick={() => setIsOpen(false)}>How It Works</a>
          {/* <Link href="#" className="hover:text-black" onClick={() => setIsOpen(false)}></Link> */}
        </div>
      )}
    </nav>
  );
}
