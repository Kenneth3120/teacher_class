import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InteractiveCard = ({ 
  children, 
  className = "", 
  glowColor = "blue",
  tiltIntensity = 8,
  onClick,
  hoverable = true 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    blue: "rgba(59, 130, 246, 0.4)",
    purple: "rgba(139, 92, 246, 0.4)",
    pink: "rgba(236, 72, 153, 0.4)",
    green: "rgba(16, 185, 129, 0.4)",
    amber: "rgba(245, 158, 11, 0.4)",
    red: "rgba(239, 68, 68, 0.4)",
    orange: "rgba(249, 115, 22, 0.4)",
    indigo: "rgba(99, 102, 241, 0.4)",
    cyan: "rgba(6, 182, 212, 0.4)",
    gray: "rgba(107, 114, 128, 0.4)",
    teal: "rgba(20, 184, 166, 0.4)",
  };

  const handleMouseMove = (e) => {
    if (!hoverable) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (hoverable) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={`
        relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-soft 
        border border-white/20 dark:border-gray-700/20 overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateY: hoverable && isHovered ? mousePosition.x * tiltIntensity : 0,
        rotateX: hoverable && isHovered ? -mousePosition.y * tiltIntensity : 0,
        boxShadow: isHovered 
          ? `0 25px 50px -12px ${glowColors[glowColor] || glowColors.blue}, 0 0 0 1px ${glowColors[glowColor] || glowColors.blue}`
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      }}
      whileHover={hoverable ? { 
        scale: 1.02,
        y: -5,
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${glowColors[glowColor] || glowColors.blue}, transparent)`,
        }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)`,
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      )}
      
      {/* Floating dots */}
      {isHovered && hoverable && (
        <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 dark:bg-gray-300/60 rounded-full"
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default InteractiveCard;