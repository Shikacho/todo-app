import { useEffect, useLayoutEffect, useRef, useState } from "react";
import FolderCard from "./FolderCard";
import "../styles/FolderCarousel.css";

const VISIBLE = 3;

export default function FolderCarousel({
  folders,
  onAddTask,
  onRemoveTask,
  onToggleTask,
  onRemoveFolder,
}) {
  const stripRef = useRef(null);
  const [cardW, setCardW] = useState(300);
  const [gap, setGap] = useState(24);
  const [start, setStart] = useState(0);

  const maxStart = Math.max(0, folders.length - VISIBLE);
  const showPrev = start > 0;
  const showNext = start < maxStart;

  const step = cardW + gap;

  const measure = () => {
    const el = stripRef.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const g = parseFloat(cs.getPropertyValue("--gap")) || 24;
    setGap(g);

    const viewport = el.clientWidth;
    const cw = Math.floor((viewport - g * (VISIBLE - 1)) / VISIBLE);
    setCardW(cw);
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stripRef.current) ro.observe(stripRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const clipped = Math.min(start, Math.max(0, folders.length - VISIBLE));
    if (clipped !== start) setStart(clipped);
    const el = stripRef.current;
    if (el) el.scrollTo({ left: clipped * step, behavior: "instant" });
  }, [folders.length, cardW, gap]);

  const scrollToIndex = (i, smooth = true) => {
    const el = stripRef.current;
    if (!el) return;
    const left = i * step;
    el.scrollTo({ left, behavior: smooth ? "smooth" : "instant" });
  };

  const prev = () => {
    const nextStart = Math.max(0, start - 1);
    setStart(nextStart);
    scrollToIndex(nextStart);
  };

  const next = () => {
    const nextStart = Math.min(maxStart, start + 1);
    setStart(nextStart);
    scrollToIndex(nextStart);
  };

  return (
    <div className="carousel-viewport" role="region" aria-label="Dossiers">
      {showPrev && (
        <button className="nav-btn left" onClick={prev} aria-label="Précédent">
          ‹
        </button>
      )}

      <div
        className="strip"
        ref={stripRef}
        style={{ ["--card-w"]: `${cardW}px`, ["--gap"]: `${gap}px` }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" && showPrev) prev();
          if (e.key === "ArrowRight" && showNext) next();
        }}
      >
        {folders.map((folder) => (
          <div className="card-wrap" key={folder.id}>
            <FolderCard
              folder={folder}
              onAddTask={(text) => onAddTask(folder.id, text)}
              onRemoveTask={(taskId) => onRemoveTask(folder.id, taskId)}
              onToggleTask={(taskId) => onToggleTask(folder.id, taskId)}
              onRemoveFolder={() => onRemoveFolder(folder.id)}
            />
          </div>
        ))}
      </div>

      {showNext && (
        <button className="nav-btn right" onClick={next} aria-label="Suivant">
          ›
        </button>
      )}
    </div>
  );
}
