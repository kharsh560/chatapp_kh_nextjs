"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

export function HomePage() {
  const isLoggedIn = false;
  return (
    <div className={`bg-black min-h-screen flex flex-col items-center justify-center px-6 text-white ${inter.className}`}>
      <motion.h1
        className="text-5xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Chat Like Never Before
      </motion.h1>
      
      <motion.p
        className="text-lg text-gray-400 max-w-xl text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Connect instantly with your friends using our secure, modern, and lightning-fast chat platform.
      </motion.p>
      
      <div className="flex space-x-4">
        <Link href={isLoggedIn ? "/chatroom" : "/signin"} >
          <motion.button
            className="px-6 py-3 bg-white text-black rounded-lg text-lg font-semibold shadow-lg transition hover:bg-gray-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </Link>
        <motion.button
          className="px-6 py-3 border border-gray-500 text-gray-300 rounded-lg text-lg font-semibold backdrop-blur-lg bg-white/10 hover:bg-white/20 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
        </motion.button>
      </div>
    </div>
  );
}
