import { useEffect } from "react";

export const GlobalMotionEffects = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-up");
    elements.forEach((element) => element.classList.add("show"));
    return () => {};
  }, []);

  return null;
};
