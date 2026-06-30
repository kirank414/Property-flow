import React from 'react';
import { motion } from 'motion/react';

export default function HeroAnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen dark:mix-blend-lighten">
      {/* Cyan Blob */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-500 opacity-20 dark:opacity-10 blur-[100px]"
        animate={{
          x: ['0%', '15%', '0%'],
          y: ['0%', '10%', '0%'],
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      />

      {/* Teal Blob */}
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500 opacity-20 dark:opacity-15 blur-[120px]"
        animate={{
          x: ['0%', '-20%', '0%'],
          y: ['0%', '-15%', '0%'],
          scale: [1, 1.15, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      />

      {/* Soft Purple/Blue Accent Blob */}
      <motion.div
        className="absolute top-[20%] left-[40%] w-[35vw] h-[35vw] rounded-full bg-indigo-500 opacity-15 dark:opacity-[0.08] blur-[120px]"
        animate={{
          x: ['0%', '25%', '-10%', '0%'],
          y: ['0%', '-15%', '20%', '0%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
