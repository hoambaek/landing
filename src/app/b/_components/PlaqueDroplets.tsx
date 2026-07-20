"use client";

/**
 * 플레이트(블루 스톤) 표면의 응결 물방울 — canvas 2D.
 * 표면에 맺힌 정지 물방울(condensation)만 렌더한다 (흘러내림 없음).
 * 각 방울: 밝은 스펙큘러 하이라이트 + 굴절 엣지 링 + 하단 그림자로 사실적 표현.
 * 정적이라 애니메이션 루프 없이 마운트·리사이즈 시 1회만 그린다.
 */

import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  r: number;
}

export default function PlaqueDroplets() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let drops: Drop[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function drawDrop(d: Drop) {
      const { x, y, r } = d;
      if (r < 0.6) return;
      const c = ctx!;

      // 하단 그림자 (표면에 얹힌 느낌)
      c.beginPath();
      c.ellipse(x + r * 0.22, y + r * 0.5, r * 0.92, r * 0.72, 0, 0, Math.PI * 2);
      c.fillStyle = "rgba(0,0,0,0.16)";
      c.fill();

      // 물방울 본체 — 중앙 투명(스톤 비침), 굴절 엣지 링, 하단 다크 림
      const g = c.createRadialGradient(x - r * 0.3, y - r * 0.34, r * 0.08, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,0.26)");
      g.addColorStop(0.36, "rgba(214,226,238,0.05)");
      g.addColorStop(0.74, "rgba(255,255,255,0.02)");
      g.addColorStop(0.93, "rgba(238,246,255,0.34)");
      g.addColorStop(1, "rgba(8,16,28,0.4)");
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fillStyle = g;
      c.fill();

      // 스펙큘러 하이라이트 (좌상단 작은 밝은 점)
      c.beginPath();
      c.arc(x - r * 0.32, y - r * 0.38, Math.max(0.6, r * 0.22), 0, Math.PI * 2);
      c.fillStyle = "rgba(255,255,255,0.9)";
      c.fill();
    }

    function render() {
      ctx!.clearRect(0, 0, W, H);
      for (const d of drops) drawDrop(d);
    }

    function resize() {
      const rect = parent!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = [];
      const n = Math.round((W * H) / 1500);
      for (let i = 0; i < n; i += 1) {
        drops.push({ x: rand(0, W), y: rand(0, H), r: rand(1.1, 4.6) });
      }
      render();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
