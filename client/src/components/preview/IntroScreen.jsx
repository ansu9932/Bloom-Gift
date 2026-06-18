import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getPalette } from '../../data/themes';
import TapHint from './TapHint';

// Canvas particle burst: hundreds of petals bloom from the center and drift.
function IntroParticles({ palette }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const pal = getPalette(palette);
    const colors = pal.petal;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const cx = width / 2;
    const cy = height / 2;

    // Spawn a generous number of petals (kept reasonable for mobile perf).
    const COUNT = Math.min(640, Math.floor((width * height) / 2600));
    const particles = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 1.5;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 5,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        ttl: Math.random() * 120 + 120,
      };
    });

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.ttl);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 + 0.06; // gentle gravity / drift down
        p.rot += p.vr;
        drawPetal(p);
      });
      rafRef.current = requestAnimationFrame(frame);
    }
    frame();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [palette]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

export default function IntroScreen({ step, onNext }) {
  const palette = step.palette || 'pink';
  const pal = getPalette(palette);
  const [showText, setShowText] = useState(false);
  const introId = step.introId || 'xoxo';

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fullscreen flex items-center justify-center overflow-hidden" style={{ background: pal.bg }} onClick={onNext}>
      {introId === 'xoxo' && <IntroParticles palette={palette} />}

      {introId === 'love-letter' && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-7xl"
        >
          💌
        </motion.div>
      )}

      {introId === 'garden' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="relative z-10 text-7xl"
        >
          🌷🌻🌼
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.9 }}
        animate={showText ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1 }}
        className="relative z-10 text-center"
        style={{ color: pal.text }}
      >
        <p className="font-display text-5xl sm:text-6xl">For You</p>
      </motion.div>

      <TapHint />
    </div>
  );
}
