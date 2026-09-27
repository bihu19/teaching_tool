"use client";

import { useState } from "react";
import { useLang } from "@/components/LangContext";
import { Arrow, fmt, PillButton, Plot, Readout, Slider, Small, usePlayback } from "../deck/ui";

const G = 9.8;

/* ── Lab 1: x–t and v–t graphs ── */
export function MotionLab() {
  const { t } = useLang();
  const [u, setU] = useState(8);
  const [a, setA] = useState(-2);
  const time = usePlayback(8, 1);
  const tt = time.value;

  const xOf = (s: number) => u * s + 0.5 * a * s * s;
  const samples = Array.from({ length: 161 }, (_, i) => xOf(i / 20));
  const xmin = Math.min(0, ...samples);
  const xmax = Math.max(0, ...samples);
  const pad = Math.max(1, (xmax - xmin) * 0.1);
  const vmin = Math.min(0, u, u + 8 * a) - 1;
  const vmax = Math.max(0, u, u + 8 * a) + 1;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Plot xmax={8} ymin={xmin - pad} ymax={xmax + pad} fn={xOf} tPoint={tt} xLabel="t (s)" yLabel="x (m)" />
        <Plot xmax={8} ymin={vmin} ymax={vmax} fn={(s) => u + a * s} tPoint={tt} xLabel="t (s)" yLabel="v (m/s)" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-2">
        <Slider label="u (m/s)" value={u} min={-8} max={8} onChange={(v) => { setU(v); time.reset(); }} />
        <Slider label="a (m/s²)" value={a} min={-4} max={4} step={0.5} onChange={(v) => { setA(v); time.reset(); }} />
        <Slider label="t (s)" value={tt} min={0} max={8} step={0.05} onChange={time.scrub} display={fmt(tt)} />
      </div>
      <Readout>
        t = {fmt(tt)} s · x = {fmt(xOf(tt))} m · v = {fmt(u + a * tt)} m/s
      </Readout>
      <div className="flex gap-2">
        <PillButton primary onClick={time.toggle}>
          {time.playing ? t("หยุดชั่วคราว", "Pause") : t("เล่น", "Play")}
        </PillButton>
        <PillButton onClick={time.reset}>{t("เริ่มใหม่", "Reset")}</PillButton>
      </div>
    </div>
  );
}

/* ── Lab 2: free-body diagram, two horizontal forces ── */
export function ForceLab() {
  const { t } = useLang();
  const [fr, setFr] = useState(30);
  const [fl, setFl] = useState(10);
  const [m, setM] = useState(5);

  const cx = 200;
  const cy = 120;
  const k = 150 / 40;
  const len = 25 + m * 5;
  const net = fr - fl;

  return (
    <div>
      <svg viewBox="0 0 400 240" className="w-full h-auto" role="img" aria-label={t("แผนภาพแรงอิสระของกล่อง", "Free-body diagram of the box")}>
        <rect x={cx - 28} y={cy - 25} width={56} height={50} rx={8} fill="var(--card-bg)" stroke="var(--card-border-strong)" />
        <text x={cx} y={cy + 4} fontSize="12" textAnchor="middle" fill="var(--foreground)">
          {m} kg
        </text>
        <Arrow x1={cx + 28} y1={cy} x2={cx + 28 + fr * k} y2={cy} color="#ef4444" />
        <Arrow x1={cx - 28} y1={cy} x2={cx - 28 - fl * k} y2={cy} color="#3b82f6" />
        <text x={388} y={cy - 12} fontSize="12" textAnchor="end" fill="#ef4444">
          {fr} N
        </text>
        <text x={12} y={cy - 12} fontSize="12" fill="#3b82f6">
          {fl} N
        </text>
        <Arrow x1={cx} y1={cy - 25} x2={cx} y2={cy - 25 - len} color="#22c55e" />
        <Arrow x1={cx} y1={cy + 25} x2={cx} y2={cy + 25 + len} color="#a855f7" />
        <text x={cx + 10} y={cy - 30 - len + 12} fontSize="12" fill="#22c55e">
          N
        </text>
        <text x={cx + 10} y={cy + 25 + len - 2} fontSize="12" fill="#a855f7">
          mg
        </text>
      </svg>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-2">
        <Slider label={t("Fขวา (N)", "F right (N)")} value={fr} min={0} max={40} onChange={setFr} />
        <Slider label={t("Fซ้าย (N)", "F left (N)")} value={fl} min={0} max={40} onChange={setFl} />
        <Slider label={t("มวล m (kg)", "Mass m (kg)")} value={m} min={1} max={10} onChange={setM} />
      </div>
      <Readout>
        ΣFₓ = {net} N · aₓ = {fmt(net / m)} m/s² · N = mg = {fmt(m * G, 1)} N
      </Readout>
      <Small>
        {t(
          "ความยาวลูกศรเทียบกันได้ภายในแกนเดียวกันเท่านั้น • ใช้ g = 9.8 m/s²",
          "Arrow lengths are comparable only along the same axis • g = 9.8 m/s²"
        )}
      </Small>
    </div>
  );
}

/* ── Lab 3: weight components on a smooth incline ── */
export function InclineLab() {
  const { t } = useLang();
  const [deg, setDeg] = useState(30);
  const th = (deg * Math.PI) / 180;
  const s = Math.sin(th);
  const c = Math.cos(th);

  // Slope rises to the right from A; box sits 55% of the way up.
  const Ax = 60;
  const Ay = 215;
  const L = 240;
  const Bx = Ax + L * c;
  const Cy = Ay - L * s;
  const Px = Ax + 0.55 * L * c;
  const Py = Ay - 0.55 * L * s;
  const ox = Px - 18 * s;
  const oy = Py - 18 * c;
  const W = 70;

  return (
    <div>
      <svg viewBox="0 0 400 240" className="w-full h-auto" role="img" aria-label={t("กล่องบนพื้นเอียง", "Box on an incline")}>
        <polygon points={`${Ax},${Ay} ${Bx},${Ay} ${Bx},${Cy}`} fill="var(--card-bg)" stroke="var(--muted)" strokeWidth={1.5} />
        {deg > 0 && (
          <>
            <path
              d={`M${Ax + 34},${Ay} A34,34 0 0 0 ${Ax + 34 * c},${Ay - 34 * s}`}
              fill="none"
              stroke="var(--muted)"
            />
            <text x={Ax + 40} y={Ay - 6} fontSize="11" fill="var(--muted)">
              θ
            </text>
          </>
        )}
        <g transform={`translate(${Px},${Py}) rotate(${-deg})`}>
          <rect x={-18} y={-36} width={36} height={36} rx={5} fill="var(--background)" stroke="var(--foreground)" strokeWidth={1.2} />
        </g>
        <Arrow x1={ox} y1={oy} x2={ox} y2={oy + W} color="#a855f7" />
        <Arrow x1={ox} y1={oy} x2={ox - W * s * c} y2={oy + W * s * s} color="#ef4444" dashed width={2} />
        <Arrow x1={ox} y1={oy} x2={ox + W * c * s} y2={oy + W * c * c} color="#3b82f6" dashed width={2} />
        <Arrow x1={ox} y1={oy} x2={ox - W * c * s} y2={oy - W * c * c} color="#22c55e" />
        <text x={ox + 6} y={oy + W + 4} fontSize="11" fill="#a855f7">mg</text>
        <text x={ox - W * s * c - 8} y={oy + W * s * s + 14} fontSize="11" textAnchor="end" fill="#ef4444">W∥</text>
        <text x={ox + W * c * s + 6} y={oy + W * c * c + 12} fontSize="11" fill="#3b82f6">W⊥</text>
        <text x={ox - W * c * s - 6} y={oy - W * c * c - 4} fontSize="11" textAnchor="end" fill="#22c55e">N</text>
      </svg>
      <Slider label={t("มุม θ (°)", "Angle θ (°)")} value={deg} min={0} max={60} onChange={setDeg} />
      <Readout>
        mg sin θ = {fmt(5 * G * s)} N
        <br />
        N = mg cos θ = {fmt(5 * G * c)} N
        <br />a = {fmt(G * s)} m/s² {t("ลงตามพื้น", "down the slope")}
      </Readout>
    </div>
  );
}

/* ── Lab 4: lever balance ── */
export function BalanceLab() {
  const { t } = useLang();
  const [fl, setFl] = useState(20);
  const [dl, setDl] = useState(2);
  const [fr, setFr] = useState(40);
  const [dr, setDr] = useState(1);
  const ccw = fl * dl;
  const cw = fr * dr;
  const tor = ccw - cw;
  const x = 200;
  const y = 130;
  const k = 175 / 3;

  return (
    <div>
      <svg viewBox="0 0 400 225" className="w-full h-auto" role="img" aria-label={t("คานและโมเมนต์รอบจุดหมุน", "Lever and torques about the pivot")}>
        <line x1={20} y1={y} x2={380} y2={y} stroke="var(--foreground)" strokeWidth={4} strokeLinecap="round" />
        <polygon points={`${x},${y + 2} ${x - 15},${y + 32} ${x + 15},${y + 32}`} fill="var(--muted)" />
        <Arrow x1={x - dl * k} y1={40} x2={x - dl * k} y2={y - 3} color="#3b82f6" />
        <Arrow x1={x + dr * k} y1={40} x2={x + dr * k} y2={y - 3} color="#ef4444" />
        <text x={x - dl * k} y={30} fontSize="12" textAnchor="middle" fill="#3b82f6">{fl} N</text>
        <text x={x + dr * k} y={30} fontSize="12" textAnchor="middle" fill="#ef4444">{fr} N</text>
        <text x={x - (dl * k) / 2} y={y + 22} fontSize="11" textAnchor="middle" fill="var(--foreground)">{dl} m</text>
        <text x={x + (dr * k) / 2} y={y + 22} fontSize="11" textAnchor="middle" fill="var(--foreground)">{dr} m</text>
        <text x={x} y={y + 50} fontSize="11" textAnchor="middle" fill="var(--muted)">{t("จุดหมุน", "Pivot")}</text>
        <text x={12} y={216} fontSize="11" fill="#3b82f6">{t("ทวนเข็ม", "CCW")} {ccw} N·m</text>
        <text x={388} y={216} fontSize="11" textAnchor="end" fill="#ef4444">{t("ตามเข็ม", "CW")} {cw} N·m</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-4 mt-2">
        <Slider label={t("Fซ้าย (N)", "F left (N)")} value={fl} min={5} max={50} step={5} onChange={setFl} />
        <Slider label={t("dซ้าย (m)", "d left (m)")} value={dl} min={0.5} max={3} step={0.5} onChange={setDl} />
        <Slider label={t("Fขวา (N)", "F right (N)")} value={fr} min={5} max={50} step={5} onChange={setFr} />
        <Slider label={t("dขวา (m)", "d right (m)")} value={dr} min={0.5} max={3} step={0.5} onChange={setDr} />
      </div>
      <Readout>
        Στ = {fmt(tor, 1)} N·m ·{" "}
        {Math.abs(tor) < 0.01 ? (
          <span style={{ color: "#22c55e" }}>
            {t(`สมดุล: แรงพยุง = ${fl + fr} N`, `Balanced: pivot support = ${fl + fr} N`)}
          </span>
        ) : tor > 0 ? (
          t("มีแนวโน้มหมุนทวนเข็ม", "Tends to rotate counter-clockwise")
        ) : (
          t("มีแนวโน้มหมุนตามเข็ม", "Tends to rotate clockwise")
        )}
      </Readout>
    </div>
  );
}

/* ── Lab 5: projectile ── */
function flight(u: number, deg: number, h: number) {
  const r = (deg * Math.PI) / 180;
  const vx = u * Math.cos(r);
  const vy = u * Math.sin(r);
  const T = (vy + Math.sqrt(vy * vy + 2 * G * h)) / G;
  return { vx, vy, T, R: vx * T, H: h + (vy * vy) / (2 * G) };
}

export function ProjectileLab() {
  const { t } = useLang();
  const [u, setU] = useState(20);
  const [angle, setAngle] = useState(45);
  const [h0, setH0] = useState(0);
  const [compare, setCompare] = useState(false);

  const p = flight(u, angle, h0);
  const time = usePlayback(100, 100 / Math.max(0.1, p.T));
  const tt = (p.T * time.value) / 100;
  const px = p.vx * tt;
  const py = Math.max(0, h0 + p.vy * tt - 0.5 * G * tt * tt);

  const cmp = compare ? [flight(u, 30, h0), flight(u, 60, h0)] : [];
  const xmax = Math.max(5, p.R, ...cmp.map((q) => q.R)) * 1.12;
  const ymax = Math.max(3, p.H, ...cmp.map((q) => q.H)) * 1.15;

  const L = 44;
  const T0 = 20;
  const bw = 340;
  const bh = 195;
  const X = (x: number) => L + (x / xmax) * bw;
  const Y = (y: number) => T0 + bh - (y / ymax) * bh;
  const path = (q: ReturnType<typeof flight>) =>
    Array.from({ length: 161 }, (_, i) => {
      const s = (q.T * i) / 160;
      const yy = Math.max(0, h0 + q.vy * s - 0.5 * G * s * s);
      return `${i ? "L" : "M"}${X(q.vx * s).toFixed(1)},${Y(yy).toFixed(1)}`;
    }).join(" ");

  const change = (fn: (v: number) => void) => (v: number) => {
    fn(v);
    time.reset();
  };

  return (
    <div>
      <svg viewBox="0 0 400 260" className="w-full h-auto" role="img" aria-label={t("กราฟวิถีโพรเจกไทล์", "Projectile trajectory")}>
        {[0, 1, 2, 3, 4].map((i) => {
          const gx = L + (bw * i) / 4;
          const gy = T0 + (bh * i) / 4;
          return (
            <g key={i}>
              <line x1={gx} y1={T0} x2={gx} y2={T0 + bh} stroke="var(--card-border-strong)" />
              <line x1={L} y1={gy} x2={L + bw} y2={gy} stroke="var(--card-border-strong)" />
              <text x={gx} y={T0 + bh + 14} fontSize="10" textAnchor="middle" fill="var(--muted)">
                {fmt((xmax * i) / 4, 0)}
              </text>
              <text x={L - 5} y={gy + 3} fontSize="10" textAnchor="end" fill="var(--muted)">
                {fmt(ymax * (1 - i / 4), 0)}
              </text>
            </g>
          );
        })}
        <text x={L} y={12} fontSize="11" fill="var(--foreground)">y (m)</text>
        <text x={L + bw} y={254} fontSize="11" textAnchor="end" fill="var(--muted)">x (m)</text>
        {cmp.map((q, i) => (
          <path key={i} d={path(q)} fill="none" stroke={i ? "#a855f7" : "#f59e0b"} strokeWidth={1.8} strokeDasharray="5 5" />
        ))}
        <path d={path(p)} fill="none" stroke="#3b82f6" strokeWidth={2.2} />
        <circle cx={X(px)} cy={Y(py)} r={6} fill="#f59e0b" />
      </svg>
      <div className="grid grid-cols-2 gap-x-4 mt-2">
        <Slider label="u (m/s)" value={u} min={5} max={30} onChange={change(setU)} />
        <Slider label="θ (°)" value={angle} min={0} max={90} onChange={change(setAngle)} />
        <Slider label="h (m)" value={h0} min={0} max={20} onChange={change(setH0)} />
        <Slider
          label={t("เวลา (% ของการบิน)", "Time (% of flight)")}
          value={time.value}
          min={0}
          max={100}
          step={0.1}
          onChange={time.scrub}
          display={fmt(time.value, 0)}
        />
      </div>
      <Readout>
        T = {fmt(p.T)} s · R = {fmt(p.R)} m · H = {fmt(p.H)} m
        <br />t = {fmt(tt)} s · x = {fmt(px)} m · y = {fmt(py)} m · vᵧ = {fmt(p.vy - G * tt)} m/s
      </Readout>
      <div className="flex flex-wrap gap-2">
        <PillButton primary onClick={time.toggle}>
          {time.playing ? t("หยุดชั่วคราว", "Pause") : t("ยิง / เล่น", "Launch / play")}
        </PillButton>
        <PillButton onClick={time.reset}>{t("เริ่มใหม่", "Reset")}</PillButton>
        <PillButton onClick={() => setCompare((c) => !c)} pressed={compare}>
          {t("เทียบมุม 30° / 60°", "Compare 30° / 60°")}
        </PillButton>
      </div>
      {compare && (
        <Small>
          {t(
            `เส้นประ: 30° สีส้ม R = ${fmt(cmp[0].R)} m, T = ${fmt(cmp[0].T)} s / 60° สีม่วง R = ${fmt(cmp[1].R)} m, T = ${fmt(cmp[1].T)} s`,
            `Dashed: 30° orange R = ${fmt(cmp[0].R)} m, T = ${fmt(cmp[0].T)} s / 60° purple R = ${fmt(cmp[1].R)} m, T = ${fmt(cmp[1].T)} s`
          )}
        </Small>
      )}
    </div>
  );
}
