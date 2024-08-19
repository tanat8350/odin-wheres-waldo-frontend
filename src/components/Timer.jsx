import { useEffect, useState } from 'react';
import { timeFormat } from '../helpers/timerFormat';

const Timer = ({ isRunning, refSec }) => {
  const [sec, setSec] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => setSec(sec + 1), 1000);
      refSec.current = sec;

      return () => clearInterval(interval);
    }
  }, [sec]);
  return <p className="timer">{timeFormat(sec)}</p>;
};

export default Timer;
