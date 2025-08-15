export const getWindowSize = () => {
  const windowSize = {
    width: 0,
    height: 0,
  };

  if (typeof window !== "undefined") {
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;
  }

  // window.addEventListener("resize", windowSize);
  // handleResize();
  // return () => window.removeEventListener("resize", handleResize);
  return windowSize;
};
