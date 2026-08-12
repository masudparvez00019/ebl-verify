'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCw } from 'lucide-react';

interface CaptchaProps {
  onCodeChange: (code: string) => void;
}

export default function DynamicCaptcha({ onCodeChange }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setCaptchaText] = useState<string>('');

  // Keep a ref of the callback to prevent infinite re-render loops
  const onCodeChangeRef = useRef(onCodeChange);
  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  const generateCaptcha = useCallback(() => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCaptchaText(code);
    if (onCodeChangeRef.current) {
      onCodeChangeRef.current(code);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas background - Crisp light grey background with faint grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add random noise dots
    for (let i = 0; i < 65; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 150)}, 0.25)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 1.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Add random distortion line overlays (matching Image 1)
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 80)}, ${Math.floor(Math.random() * 80)}, ${Math.floor(Math.random() * 120)}, 0.45)`;
      ctx.lineWidth = 1 + Math.random() * 0.8;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.bezierCurveTo(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      ctx.stroke();
    }

    // Render characters with slight rotation & offset
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.textBaseline = 'middle';

    const startX = 26;
    const spaceX = 32;

    for (let i = 0; i < code.length; i++) {
      const char = code.charAt(i);
      ctx.save();

      const x = startX + i * spaceX;
      const y = canvas.height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 24 - 12) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#003876'; // Official EBL Dark Blue
      ctx.fillText(char, 0, 0);

      ctx.restore();
    }
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  return (
    <div className="flex items-center justify-center gap-3 mb-[18px]">
      <div className="border border-[#ddd] rounded-lg overflow-hidden bg-[#f8f8f8]">
        <canvas
          ref={canvasRef}
          width={190}
          height={60}
          className="block cursor-pointer"
          title="Click to refresh CAPTCHA"
          onClick={generateCaptcha}
        />
      </div>
      <button
        type="button"
        onClick={generateCaptcha}
        className="w-[46px] h-[46px] min-w-[46px] bg-[#003876] hover:bg-[#002957] text-white flex items-center justify-center rounded-lg shadow-none transition-colors"
        title="Refresh Captcha"
      >
        <RotateCw className="w-5 h-5" />
      </button>
    </div>
  );

}
