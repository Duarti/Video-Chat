import { useEffect, useState } from "react";

const WaitingUserText = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 3) {
          return "";
        } else {
          return prevDots + ".";
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div class="waitingText">
      <h1>Waiting for other user to join</h1>
      <h1 className="dots">{dots}</h1>
    </div>
  );
};

export default WaitingUserText;
