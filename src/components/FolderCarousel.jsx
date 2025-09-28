import { useEffect, useLayoutEffect, useRef, useState } from "react";
import FolderCard from "./FolderCard";
import "../styles/FolderCarousel.css";

export default function FolderCarousel({
  folders,
  onAddTask,
  onRemoveTask,
  onToggleTask,
  onRemoveFolder,
  onRenameFolder,
  onChangeStatus,
}) {
  const stripRef = useRef(null);

  const [cardW, setCardW] = useState(300);
  const [gap, setGap] = useState(24);
  const [visible, setVisible] = useState(3);
  const [start, setStart] = useState(0);

  const step = cardW + gap;
  const maxStart = Math.max(0, folders.length - visible);
  const showPrev = start > 0;
  const showNext = start < maxStart;

  const measure = () => {
    const el = stripRef.current;
    if (!el) return;

    const cs = getComputedStyle(el);
    const g = parseFloat(cs.getPropertyValue("--gap")) || 24;
    setGap(g);

    const viewport = el.clientWidth;

    let nextVisible = 3;
    if (viewport < 560) nextVisible = 1;
    else if (viewport < 900) nextVisible = 2;
    setVisible(nextVisible);

    const cw = Math.floor((viewport - g * (nextVisible - 1)) / nextVisible);
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
    const clipped = Math.min(start, Math.max(0, folders.length - visible));
    if (clipped !== start) setStart(clipped);
    const el = stripRef.current;
    if (el) el.scrollTo({ left: clipped * step, behavior: "instant" });
  }, [folders.length, visible, cardW, gap, start, step]);

  const scrollToIndex = (i, smooth = true) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollTo({ left: i * step, behavior: smooth ? "smooth" : "instant" });
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
              onRenameFolder={(id, name) => onRenameFolder?.(folder.id, name)}
              onChangeStatus={(taskId, newS) =>
                onChangeStatus?.(folder.id, taskId, newS)
              }
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
