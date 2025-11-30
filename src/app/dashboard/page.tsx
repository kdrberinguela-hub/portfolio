"use client";

import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

interface User {
  username: string;
  role: string;
  email?: string;
  phone?: string;
}

export default function DashboardHome() {
  const token = getToken();
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User>({
    username: "Guest",
    role: "User",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const savedUser = localStorage.getItem("user");
        const storedUser = savedUser ? JSON.parse(savedUser) : {};
        setUser({
          username: decoded.username || "Guest",
          role: decoded.role || "User",
          email: storedUser.email || "",
          phone: storedUser.phone || "",
        });
      } catch (e) {
        console.error("Token decoding failed:", e);
      }
    }
  }, [token]);

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(showCopyPopup).catch(() => {
        fallbackCopy(text);
        showCopyPopup();
      });
    } else {
      fallbackCopy(text);
      showCopyPopup();
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const showCopyPopup = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full py-8 px-4 bg-transparent min-h-screen relative">
      {/* User Card */}
      <div className="flex flex-col items-center bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md transition-all duration-300 transform hover:scale-105 border border-gray-700/50 overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-pink-500/10 opacity-50 animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Profile Image with Glow */}
          <div className="relative mb-6">
            <img
              src="/profile.png"
              alt="Profile Photo"
              className="w-28 h-28 rounded-full object-cover border-4 border-gradient-to-r from-red-500 to-pink-500 shadow-xl"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 blur-xl"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2">{user.username}</h2>
          <p className="text-gray-400 mb-4 text-lg font-medium">{user.role}</p>

          {/* Email & Phone in styled boxes */}
          <div className="flex flex-col items-center space-y-2">
            {user.email && (
              <div className="bg-gray-700/70 px-4 py-2 rounded-xl border border-gray-600/50">
                <span className="text-gray-300 text-sm font-medium">Email: </span>
                <span className="text-white">{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="bg-gray-700/70 px-4 py-2 rounded-xl border border-gray-600/50">
                <span className="text-gray-300 text-sm font-medium">Phone: </span>
                <span className="text-white">{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Token Section */}
      {token && (
        <div className="w-full max-w-md bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-gray-700/50 flex flex-col gap-4 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 opacity-50 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              {/* Small profile picture on the left */}
              <img
                src="/profile.png"
                alt="Profile Photo"
                className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg"
              />
              {/* Show/Hide Token Button */}
              <button
                onClick={() => setShowToken(!showToken)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {showToken ? "Hide Token" : "Show Token"}
              </button>
            </div>

            {showToken && (
              <>
                <pre className="p-4 bg-gray-900/80 text-sm text-white break-all rounded-xl border border-gray-600/50 overflow-x-auto w-full shadow-inner">
                  {token}
                </pre>
                <button
                  onClick={() => copyToClipboard(token)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white text-sm rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-300 w-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Copy Token
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Copy Popup */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-fadeInOut z-50 border border-red-500/50">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
