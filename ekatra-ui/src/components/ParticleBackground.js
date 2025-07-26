import React from "react";
import { motion } from "framer-motion";

const ParticleBackground = ({ theme = "light", type = "floating" }) => {
  // Create simple CSS-based particle effect instead of complex library
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 2,
  }));

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            theme === "dark" 
              ? "bg-blue-400/20" 
              : "bg-blue-500/10"
          }`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;