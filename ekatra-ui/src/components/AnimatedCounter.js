import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let startTime;
      let startValue = 0;

      const animateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const progressRatio = Math.min(progress / duration, 1);
        
        // Easing function for smooth animation
        const easedProgress = progressRatio * (2 - progressRatio);
        const currentCount = Math.floor(easedProgress * (end - startValue) + startValue);
        
        setCount(currentCount);

        if (progressRatio < 1) {
          requestAnimationFrame(animateCount);
        }
      };

      requestAnimationFrame(animateCount);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="font-bold">
      {prefix}{count}{suffix}
    </span>
  );
};

export default AnimatedCounter;