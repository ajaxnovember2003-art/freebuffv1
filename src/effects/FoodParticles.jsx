import { useEffect, useRef } from "react";

export default function FoodParticles({
  amount = 70,
}) {
  const canvasRef = useRef(null);

  const mouse = useRef({
    x: 0,
    y: 0,
  });

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
        Math.random() *
        window.innerHeight,

      size:
        1 +
        Math.random() * 2.5,

      vx:
        (Math.random() - 0.5) *
        0.25,

      vy:
        (Math.random() - 0.5) *
        0.25,

      alpha:
        0.12 +
        Math.random() * 0.35,
    });

    const initialize = () => {
      particles = [];

      for (
        let i = 0;
        i < amount;
        i++
      ) {
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
          const dx =
            mouse.current.x -
            particle.x;

          const dy =
            mouse.current.y -
            particle.y;

          const distance =
            Math.sqrt(
              dx * dx +
                dy * dy
            );

          if (
            distance > 0 &&
            distance < 180
          ) {
            particle.vx -=
              (dx / distance) *
              0.003;

            particle.vy -=
              (dy / distance) *
              0.003;
          }

          particle.x +=
            particle.vx;

          particle.y +=
            particle.vy;

          particle.vx *= 0.995;
          particle.vy *= 0.995;

          if (
            particle.x < -20
          ) {
            particle.x =
              window.innerWidth +
              20;
          }

          if (
            particle.x >
            window.innerWidth + 20
          ) {
            particle.x = -20;
          }

          if (
            particle.y < -20
          ) {
            particle.y =
              window.innerHeight +
              20;
          }

          if (
            particle.y >
            window.innerHeight + 20
          ) {
            particle.y = -20;
          }

          ctx.beginPath();

          ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            `rgba(255,255,255,${particle.alpha})`;

          ctx.fill();
        }
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    const handleMouseMove =
      (event) => {
        mouse.current.x =
          event.clientX;

        mouse.current.y =
          event.clientY;
      };

    resize();
    initialize();
    animate();

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, [amount]);

  return (
    <canvas
      ref={canvasRef}
      className="food-particles"
      aria-hidden="true"
    />
  );
}