import { useEffect, useRef } from "react";

export default function HeatHaze() {
  const hazeRef = useRef(null);

  useEffect(() => {
    const element = hazeRef.current;

    if (!element) return;

    let frame;
    let time = 0;

    const animate = () => {
      time += 0.015;

      const x =
        Math.sin(time) * 15;

      const y =
        Math.cos(time * 0.8) * 10;

      const scale =
        1 +
        Math.sin(time * 1.4) *
          0.025;

      element.style.transform = `
        translate3d(
          ${x}px,
          ${y}px,
          0
        )
        scale(${scale})
      `;

      frame =
        requestAnimationFrame(
          animate
        );
    };

    animate();

    return () =>
      cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={hazeRef}
      className="heat-haze"
      aria-hidden="true"
    />
  );
}