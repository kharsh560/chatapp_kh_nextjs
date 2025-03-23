// "use client";

// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";

// export function GlobalLoader() {
// //   const [dots, setDots] = useState("...");

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setDots((prev) => (prev.length < 3 ? prev + "." : ""));
// //     }, 500); // Cycle dots every 500ms
// //     return () => clearInterval(interval);
// //   }, []);


//   return (
//     <div className="h-screen w-screen flex justify-center items-center bg-black">
//         <h1 className="text-white w-2xl flex justify-center font-bold text-3xl">Loading</h1>
//     </div>
//   );
// }

export function GlobalLoader() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-black">
      <div className="text-white font-bold text-3xl animate-pulse">
        Loading<span className="dot-animation">...</span>
      </div>
    </div>
  );
}


/*
<motion.div
        className="text-white w-2xl flex justify-center font-bold text-3xl"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span>Loading</span>
        <span>...</span>
      </motion.div>
*/