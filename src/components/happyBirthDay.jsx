import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const HappyBirthday = ({ onClose, firstName }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [remainingTime, setRemainingTime] = useState(10000);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1000;
        if (newTime <= 0) {
          setShowConfetti(false);
          clearInterval(intervalId);
          if (onClose) onClose();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onClose]);

  const formatRemainingTime = (time) => {
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

HappyBirthday.propTypes = {
  onClose: PropTypes.func.isRequired,
  firstName: PropTypes.string.isRequired,
};

export default HappyBirthday;
