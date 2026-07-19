import { useEffect, useRef } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function HeroAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.35 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStatic = () => {
      context.clearRect(0, 0, width, height);

      const baseGradient = context.createLinearGradient(0, 0, width, height);
      baseGradient.addColorStop(0, 'rgba(232, 103, 46, 0.16)');
      baseGradient.addColorStop(0.45, 'rgba(232, 103, 46, 0.04)');
      baseGradient.addColorStop(1, 'rgba(22, 23, 26, 0)');
      context.fillStyle = baseGradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = 'rgba(232, 103, 46, 0.18)';
      context.lineWidth = 1;
      for (let i = 0; i < 6; i += 1) {
        const y = height * (0.15 + i * 0.12);
        context.beginPath();
        context.moveTo(0, y);
        context.bezierCurveTo(width * 0.22, y - 20, width * 0.66, y + 22, width, y - 8);
        context.stroke();
      }
    };

    const drawFrame = (time: number) => {
      if (!running) return;

      const t = time * 0.001;
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;

      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        width * (0.76 + (px - 0.5) * 0.08),
        height * (0.2 + (py - 0.5) * 0.1),
        0,
        width * (0.76 + (px - 0.5) * 0.08),
        height * (0.2 + (py - 0.5) * 0.1),
        width * 0.42,
      );
      glow.addColorStop(0, 'rgba(232, 103, 46, 0.2)');
      glow.addColorStop(0.35, 'rgba(232, 103, 46, 0.08)');
      glow.addColorStop(1, 'rgba(22, 23, 26, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < 7; i += 1) {
        const progress = i / 6;
        const baseY = height * (0.14 + progress * 0.13);
        const drift = Math.sin(t * 0.85 + i * 0.7) * 10;
        const amplitude = 20 + i * 3 + py * 8;

        context.beginPath();
        context.lineWidth = i === 2 ? 1.15 : 1;
        context.strokeStyle = i === 2 ? 'rgba(232, 103, 46, 0.34)' : 'rgba(232, 103, 46, 0.22)';
        context.moveTo(0, baseY);
        context.bezierCurveTo(
          width * 0.18,
          baseY - amplitude + drift,
          width * 0.52,
          baseY + amplitude * 0.7 - drift,
          width,
          baseY + Math.sin(t + i) * 8,
        );
        context.stroke();
      }

      context.save();
      context.fillStyle = 'rgba(232, 103, 46, 0.55)';
      for (let i = 0; i < 18; i += 1) {
        const wave = i / 18;
        const x = width * (0.52 + wave * 0.44) + Math.sin(t * 0.8 + i * 1.3) * 14;
        const y = height * (0.18 + wave * 0.48) + Math.cos(t * 1.2 + i * 0.9) * 10;
        const size = i % 3 === 0 ? 2.6 : 1.6;
        context.fillRect(x, y, size, size);
      }
      context.restore();

      context.strokeStyle = 'rgba(241, 239, 236, 0.12)';
      context.lineWidth = 1;
      for (let i = 0; i < 5; i += 1) {
        const x = width * (0.58 + i * 0.08);
        context.beginPath();
        context.moveTo(x, height * 0.08);
        context.lineTo(x, height * 0.86);
        context.stroke();
      }

      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
      };
    };

    const onVisibilityChange = () => {
      running = document.visibilityState !== 'hidden';
      if (running && !media.matches) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      } else {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    resize();

    if (media.matches) {
      drawStatic();
    } else {
      animationFrame = window.requestAnimationFrame(drawFrame);
    }

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onPointerMove);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div className="hero-atmosphere" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-atmosphere__canvas" />
      <div className="hero-atmosphere__hud">
        <div className="hero-atmosphere__hud-item">
          <span className="hero-atmosphere__label">air density</span>
          <span className="hero-atmosphere__value">critical</span>
        </div>
        <div className="hero-atmosphere__hud-item">
          <span className="hero-atmosphere__label">surface state</span>
          <span className="hero-atmosphere__value">un-prepped</span>
        </div>
      </div>
    </div>
  );
}
