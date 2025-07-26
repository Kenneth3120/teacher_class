import React, { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = ({ theme = "light", type = "floating" }) => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const getParticleConfig = () => {
    const baseConfig = {
      background: {
        opacity: 0,
      },
      fpsLimit: 120,
      particles: {
        number: {
          value: type === "floating" ? 50 : 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        opacity: {
          value: theme === "dark" ? 0.6 : 0.3,
          random: true,
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: type === "floating" ? 3 : 2,
          random: true,
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.5,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: type === "floating" ? 1 : 2,
          direction: "none",
          random: false,
          straight: false,
          outModes: {
            default: "bounce",
          },
        },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      detectRetina: true,
    };

    if (type === "floating") {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          color: {
            value: theme === "dark" ? ["#3b82f6", "#8b5cf6", "#06b6d4"] : ["#3b82f6", "#8b5cf6", "#f59e0b"],
          },
          shape: {
            type: ["circle", "triangle"],
          },
          links: {
            enable: false,
          },
        },
      };
    }

    if (type === "network") {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          color: {
            value: theme === "dark" ? "#64748b" : "#e2e8f0",
          },
          shape: {
            type: "circle",
          },
          links: {
            enable: true,
            distance: 150,
            color: theme === "dark" ? "#374151" : "#e2e8f0",
            opacity: 0.4,
            width: 1,
          },
        },
      };
    }

    return baseConfig;
  };

  return (
    <Particles
      id={`particles-${type}`}
      init={particlesInit}
      options={getParticleConfig()}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default ParticleBackground;