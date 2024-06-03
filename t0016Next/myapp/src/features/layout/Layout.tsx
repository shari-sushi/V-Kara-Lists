
import { useEffect, useState } from "react";

// export const getWindowSize2 = () => {
//     const [windowSize, setWindowSize] = useState({
//         width: 0,
//         height: 0,
//     });

//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const handleResize = () => {
//                 setWindowSize({
//                     width: window.innerWidth,
//                     height: window.innerHeight,
//                 });
//             };

//             window.addEventListener("resize", handleResize);
//             handleResize();
//             return () => window.removeEventListener("resize", handleResize);
//         } else {
//             return;
//         }
//     }, []);
//     return windowSize;
// };

export const getWindowSize = () => {
    const windowSize = {
        width: 0,
        height: 0,
    }

    if (typeof window !== "undefined") {
        windowSize.width = window.innerWidth
        windowSize.height = window.innerHeight
    }

    // window.addEventListener("resize", windowSize);
    // handleResize();
    // return () => window.removeEventListener("resize", handleResize);
    return windowSize
};