import { useEffect, useRef, useState } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  onDone?: () => void;
}

export function useTypewriter({ text, speed = 28, onDone }: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  const skip = () => {
    if (frameRef.current) clearTimeout(frameRef.current);
    setDisplayed(text);
    setIsDone(true);
    onDone?.();
  };

  useEffect(() => {
    setDisplayed("");
    setIsDone(false);
    indexRef.current = 0;

    const tick = () => {
      indexRef.current++;
      const next = text.slice(0, indexRef.current);
      setDisplayed(next);
      if (indexRef.current < text.length) {
        const ch = text[indexRef.current - 1];
        const delay = ch === "." || ch === "!" || ch === "?" ? speed * 8 :
                      ch === "," || ch === "\n"               ? speed * 4 :
                      speed;
        frameRef.current = setTimeout(tick, delay);
      } else {
        setIsDone(true);
        onDone?.();
      }
    };

    frameRef.current = setTimeout(tick, speed);
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [text]);

  return { displayed, isDone, skip };
}

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onDone?: () => void;
  className?: string;
  style?: React.CSSProperties;
  onSkip?: () => void;
}

export function TypewriterText({
  text,
  speed,
  onDone,
  className,
  style,
  onSkip,
}: TypewriterTextProps) {
  const { displayed, isDone, skip } = useTypewriter({ text, speed, onDone });

  const handleClick = () => {
    if (!isDone) {
      skip();
    } else {
      onSkip?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={className}
      style={{ cursor: "pointer", userSelect: "none", ...style }}
    >
      <span style={{ whiteSpace: "pre-wrap" }}>{displayed}</span>
      {!isDone && (
        <span
          style={{ animation: "blink 0.8s step-end infinite", opacity: 1 }}
        >
          ▮
        </span>
      )}
    </div>
  );
}
