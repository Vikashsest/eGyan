
import React from "react";
import { FaBookOpen, FaBook, FaUniversity } from "react-icons/fa"; 

export default function NotFound404() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center px-4 overflow-hidden">
        <FaUniversity className="text-8xl text-blue-500 mb-2 animate-fade-in" />
        
        <h1 className="text-[200px] font-bold mb-2 animate-pulse-404 tracking-widest">
          404
        </h1>

        <p className="text-4xl font-bold bg-blue-600 text-transparent bg-clip-text animate-fade-in mb-2">
          Page Not Found
        </p>

        <div className="flex items-center gap-4 text-blue-400 mb-8 animate-fade-in">
          <FaBook className="text-2xl" />
          <FaBookOpen className="text-2xl" />
        </div>

        <a
          href="/"
          className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 hover:text-white transition-all duration-300 ease-in-out animate-fade-in-glow"
        >
          ⬅ Go to Login
        </a>
      </div>

      <style>
        {`
          @keyframes pulse-404 {
            0%, 100% {
              transform: scale(1);
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }
            50% {
              transform: scale(1.1);
              text-shadow: 0 0 40px rgba(255, 255, 255, 1);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-glow {
            from {
              opacity: 0;
              transform: scale(0.95);
              box-shadow: 0 0 0 transparent;
            }
            to {
              opacity: 1;
              transform: scale(1);
              box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
            }
          }

          .animate-pulse-404 {
            animation: pulse-404 2s infinite ease-in-out;
          }

          .animate-fade-in {
            animation: fade-in 1.5s ease-out forwards;
          }

          .animate-fade-in-glow {
            animation: fade-in-glow 1.2s ease-out forwards;
          }
        `}
      </style>
    </>
  );
}
