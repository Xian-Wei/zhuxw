"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import styles from "./dev.module.scss";

const COLS = 20;
const ROWS = 20;
const CELL = 24;
const TICK_MS = 120;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

const opposite: Record<Dir, Dir> = {
  UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
};

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

const DevPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Point[],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 15, y: 10 } as Point,
    score: 0,
    dead: false,
    started: false,
  });
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = "rgba(80,80,160,0.08)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke();
    }

    // Food
    const fx = s.food.x * CELL + CELL / 2;
    const fy = s.food.y * CELL + CELL / 2;
    const grad = ctx.createRadialGradient(fx, fy, 1, fx, fy, CELL / 2 - 2);
    grad.addColorStop(0, "#C4B5FD");
    grad.addColorStop(1, "#7C3AED");
    ctx.beginPath();
    ctx.arc(fx, fy, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.shadowColor = "#A78BFA";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    s.snake.forEach((seg, i) => {
      const t = i / s.snake.length;
      const r = Math.round(60 + t * 40);
      const g = Math.round(60 + t * 40);
      const b = Math.round(160 + t * 60);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      if (i === 0) {
        ctx.shadowColor = "#818CF8";
        ctx.shadowBlur = 12;
      }
      const pad = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, []);

  const reset = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    stateRef.current = {
      snake: initial,
      dir: "RIGHT",
      nextDir: "RIGHT",
      food: randomFood(initial),
      score: 0,
      dead: false,
      started: false,
    };
    setScore(0);
    setDead(false);
    setStarted(false);
    draw();
  }, [draw]);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.dead || !s.started) return;

    s.dir = s.nextDir;
    const head = s.snake[0];
    const next: Point = {
      x: (head.x + (s.dir === "RIGHT" ? 1 : s.dir === "LEFT" ? -1 : 0) + COLS) % COLS,
      y: (head.y + (s.dir === "DOWN" ? 1 : s.dir === "UP" ? -1 : 0) + ROWS) % ROWS,
    };

    if (s.snake.some(seg => seg.x === next.x && seg.y === next.y)) {
      s.dead = true;
      setDead(true);
      return;
    }

    const ate = next.x === s.food.x && next.y === s.food.y;
    const newSnake = [next, ...s.snake];
    if (!ate) newSnake.pop();
    s.snake = newSnake;
    if (ate) {
      s.score += 1;
      s.food = randomFood(newSnake);
      setScore(s.score);
    }
    draw();
  }, [draw]);

  const start = useCallback(() => {
    stateRef.current.started = true;
    setStarted(true);
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    tickRef.current = setInterval(tick, TICK_MS);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [tick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
        W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      const s = stateRef.current;
      if (!s.started) start();
      if (dir !== opposite[s.dir]) s.nextDir = dir;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    const s = stateRef.current;
    if (!s.started) start();
    let dir: Dir;
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? "RIGHT" : "LEFT";
    } else {
      dir = dy > 0 ? "DOWN" : "UP";
    }
    if (dir !== opposite[s.dir]) s.nextDir = dir;
  };

  const steer = (dir: Dir) => {
    const s = stateRef.current;
    if (!s.started) start();
    if (dir !== opposite[s.dir]) s.nextDir = dir;
  };

  return (
    <Layout navbarEnabled={true} backgroundEnabled={true}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.gameWrapper}>
            <div className={styles.gameHeader}>
              <span className={styles.gameTitle}>Snake</span>
              <span className={styles.gameScore}>{score}</span>
            </div>
            <div className={styles.canvasWrapper}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <canvas
                ref={canvasRef}
                width={COLS * CELL}
                height={ROWS * CELL}
                className={styles.canvas}
              />
              {!started && !dead && (
                <div className={styles.overlay} onClick={start}>
                  <p className={styles.overlayText}>Press any arrow key</p>
                  <p className={styles.overlaySub}>or tap to start</p>
                </div>
              )}
              {dead && (
                <div className={styles.overlay} onClick={reset}>
                  <p className={styles.overlayText}>Game Over</p>
                  <p className={styles.overlaySub}>Score: {score}</p>
                  <p className={styles.overlayRestart}>Tap to restart</p>
                </div>
              )}
            </div>
            <div className={styles.dpad}>
              <button className={styles.dpadBtn} onPointerDown={() => steer("UP")}>▲</button>
              <div className={styles.dpadRow}>
                <button className={styles.dpadBtn} onPointerDown={() => steer("LEFT")}>◀</button>
                <button className={styles.dpadBtn} onPointerDown={() => steer("RIGHT")}>▶</button>
              </div>
              <button className={styles.dpadBtn} onPointerDown={() => steer("DOWN")}>▼</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DevPage;
