import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = ({ theme = "light" }) => {
  const elements = [
    { id: 1, size: 20, x: "10%", y: "20%", delay: 0 },
    { id: 2, size: 15, x: "80%", y: "10%", delay: 1 },
    { id: 3, size: 25, x: "70%", y: "70%", delay: 2 },
    { id: 4, size: 18, x: "20%", y: "80%", delay: 1.5 },
    { id: 5, size: 12, x: "90%", y: "50%", delay: 0.5 },
    { id: 6, size: 22, x: "5%", y: "60%", delay: 2.5 },
  ];

  const shapes = ['circle', 'triangle', 'square', 'diamond'];
  const colors = theme === 'dark' 
    ? ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)', 'rgba(6, 182, 212, 0.1)']
    : ['rgba(59, 130, 246, 0.05)', 'rgba(139, 92, 246, 0.05)', 'rgba(245, 158, 11, 0.05)'];

  const getShapeComponent = (shape, size, color) => {
    const shapeProps = {
      width: size,
      height: size,
      className: "absolute",
    };

    switch (shape) {
      case 'circle':
        return (
          <div
            {...shapeProps}
            style={{
              backgroundColor: color,
              borderRadius: '50%',
              border: `1px solid ${color.replace('0.05', '0.2').replace('0.1', '0.3')}`,
            }}
          />
        );
      case 'triangle':
        return (
          <div
            {...shapeProps}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
            }}
          />
        );
      case 'square':
        return (
          <div
            {...shapeProps}
            style={{
              backgroundColor: color,
              border: `1px solid ${color.replace('0.05', '0.2').replace('0.1', '0.3')}`,
              transform: 'rotate(45deg)',
            }}
          />
        );
      case 'diamond':
        return (
          <div
            {...shapeProps}
            style={{
              backgroundColor: color,
              transform: 'rotate(45deg)',
              borderRadius: '20%',
              border: `1px solid ${color.replace('0.05', '0.2').replace('0.1', '0.3')}`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {elements.map((element) => {
        const shape = shapes[element.id % shapes.length];
        const color = colors[element.id % colors.length];
        
        return (
          <motion.div
            key={element.id}
            className="absolute"
            style={{
              left: element.x,
              top: element.y,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8 + element.delay,
              repeat: Infinity,
              ease: "linear",
              delay: element.delay,
            }}
          >
            {getShapeComponent(shape, element.size, color)}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingElements;