import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

type HappyBirthdayProps = {
  onClose: () => void;
  firstName: string;
};

const HappyBirthday = ({ onClose, firstName }: HappyBirthdayProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [remainingTime, setRemainingTime] = useState(10_000);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1000;
        if (newTime <= 0) {
          setShowConfetti(false);
          window.clearInterval(intervalId);
          onClose();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [onClose]);

  const formatRemainingTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      {showConfetti && <Confetti width={width} height={height} />}
      <div className="p-8 bg-downy text-white rounded-lg shadow-lg text-center">
        <h3 className="text-2xl font-bold">
          🎉 Happy Birthday {firstName}! 🎉
        </h3>
        <p className="mt-2 text-lg">We celebrate you as you age gracefully!</p>
        <p className="mt-2 bg-success text-sm">
          Closing in: ⏰ {formatRemainingTime(remainingTime)}
        </p>
      </div>
    </div>
  );
};

export default HappyBirthday;
