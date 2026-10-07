import { useEffect, useRef } from "react";

export default function SteamCanvas({
  count = 35,
  intensity = 1,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let particles = [];
    let animationFrame;

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        window.innerWidth * dpr;

      canvas.height =
        window.innerHeight * dpr;

      canvas.style.width =
        `${window.innerWidth}px`;

      canvas.style.height =
        `${window.innerHeight}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    const createParticle = () => ({
      x:
        Math.random() *
        window.innerWidth,

      y:
        window.innerHeight +
        Math.random() * 150,

      size:
        2 +
        Math.random() * 6,

      speed:
        0.3 +
        Math.random() * 1.1,

      life:
        Math.random(),

      drift:
        Math.random() * Math.PI * 2,

      driftSpeed:
        0.006 +
        Math.random() * 0.018,

      opacity:
        0.06 +
        Math.random() * 0.2,
    });

    const initialize = () => {
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push(
          createParticle()
        );
      }
    };

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      particles.forEach(
        (particle) => {
          particle.y -=
            particle.speed *
            intensity;

          particle.drift +=
            particle.driftSpeed;

          particle.x +=
            Math.sin(
              particle.drift
            ) * 0.35;

          particle.life += 0.003;

          if (
            particle.y < -100 ||
            particle.life > 1.5
          ) {
            Object.assign(
              particle,
              createParticle()
            );
          }

          const progress =
            Math.min(
              particle.life,
              1
            );

          const alpha =
            Math.sin(
              progress * Math.PI
            ) *
            particle.opacity;

          const radius =
            particle.size * 5;

          const gradient =
            ctx.createRadialGradient(
              particle.x,
              particle.y,
              0,
              particle.x,
              particle.y,
              radius
            );

          gradient.addColorStop(
            0,
            `rgba(255,255,255,${alpha})`
          );

          gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
          );

          ctx.fillStyle = gradient;

          ctx.beginPath();

          ctx.arc(
            particle.x,
            particle.y,
            radius,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    resize();
    initialize();
    animate();

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [count, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="steam-canvas"
      aria-hidden="true"
    />
  );
}