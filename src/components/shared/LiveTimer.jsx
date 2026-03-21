import { useState, useEffect } from "react";
import { formatDuration, calcRealTime } from "../../utils";

export default function LiveTimer({ timeHistory }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (timeHistory.length % 2 === 1) {
      const id = setInterval(() => setTick((t) => t + 1), 1000);
      return () => clearInterval(id);
    }
  }, [timeHistory]);

  return (
    <span className="live-timer card-time">
      {formatDuration(calcRealTime(timeHistory))}
    </span>
  );
}
