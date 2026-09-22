import { useState } from "react";

export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(52);
  return (
    <div className="before-after">
      <img src={before} alt="Reported issue" className="ba-base" />
      <div className="ba-clip" style={{ width: `${pos}%` }}>
        <img src={after} alt="Verified resolution" />
      </div>
      <span className="ba-line" style={{ left: `${pos}%` }} />
      <input
        type="range"
        min={4}
        max={96}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after evidence"
      />
      <span className="ba-tag left">Reported</span>
      <span className="ba-tag right">Resolved</span>
    </div>
  );
}
