import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MorphingButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md", 
  className = "",
  disabled = false,
  loading = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: {
      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      color: "white",
      hoverBackground: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    },
    secondary: {
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      color: "#374151",
      hoverBackground: "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
    },
    success: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      hoverBackground: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    },
    danger: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "white",
      hoverBackground: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    },
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl font-semibold 
        transition-all duration-300 transform-gpu
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        background: isHovered && !disabled ? currentVariant.hoverBackground : currentVariant.background,
        color: currentVariant.color,
      }}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={false}
        animate={isPressed ? {
          background: [
            "radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%)",
            "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)"
          ],
        } : {}}
        transition={{ duration: 0.6 }}
      />
      
      {/* Floating particles on hover */}
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 12}%`,
                top: "50%",
              }}
              animate={{
                y: [-10, -20, -10],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}
      
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
      
      {/* Content */}
      <motion.span
        className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}
        transition={{ opacity: { duration: 0.2 } }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default MorphingButton;