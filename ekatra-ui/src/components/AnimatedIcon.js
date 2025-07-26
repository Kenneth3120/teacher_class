import React from 'react';
import { motion } from 'framer-motion';

const AnimatedIcon = ({ 
  icon, 
  size = 24, 
  animation = "bounce", 
  color = "currentColor",
  className = "",
  onClick,
  hover = true 
}) => {
  const animations = {
    bounce: {
      hover: { y: -5, scale: 1.1 },
      tap: { scale: 0.9 },
      animate: { 
        y: [0, -3, 0],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }
    },
    rotate: {
      hover: { rotate: 15, scale: 1.1 },
      tap: { scale: 0.9 },
      animate: { 
        rotate: [0, 5, -5, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
    },
    pulse: {
      hover: { scale: 1.2 },
      tap: { scale: 0.8 },
      animate: { 
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }
    },
    shake: {
      hover: { x: 2, scale: 1.1 },
      tap: { scale: 0.9 },
      animate: { 
        x: [0, 2, -2, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
    },
    float: {
      hover: { y: -8, scale: 1.1 },
      tap: { scale: 0.9 },
      animate: { 
        y: [0, -5, 0],
        rotate: [0, 2, -2, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
    },
    glow: {
      hover: { 
        scale: 1.2,
        filter: "drop-shadow(0 0 10px currentColor)",
      },
      tap: { scale: 0.8 },
      animate: { 
        filter: [
          "drop-shadow(0 0 0px currentColor)",
          "drop-shadow(0 0 5px currentColor)",
          "drop-shadow(0 0 0px currentColor)"
        ],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
    }
  };

  const currentAnimation = animations[animation] || animations.bounce;

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ color, width: size, height: size }}
      whileHover={hover ? currentAnimation.hover : {}}
      whileTap={onClick ? currentAnimation.tap : {}}
      animate={currentAnimation.animate}
      onClick={onClick}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Icon content */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        style={{ fontSize: size }}
      >
        {typeof icon === 'string' ? (
          <span>{icon}</span>
        ) : (
          icon
        )}
      </motion.div>
      
      {/* Particle trail effect */}
      {animation === 'float' && (
        <motion.div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-current rounded-full opacity-40"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: -2,
                marginTop: -2,
              }}
              animate={{
                y: [0, -20, -40],
                x: [0, (i - 1) * 10],
                opacity: [0.4, 0.8, 0],
                scale: [0.5, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedIcon;