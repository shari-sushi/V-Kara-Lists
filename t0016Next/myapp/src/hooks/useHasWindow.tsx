import { useState, useEffect } from 'react';

const useHasWindow = () => {
    const [hasWindow, setHasWindow] = useState<boolean>(false);

    useEffect(() => {
        // const handleResize = () => {
        //     setWindowSize({
        //         width: window.innerWidth,
        //         height: window.innerHeight,
        //     });
        // };

        // handleResize(); // マウント時にwindowサイズを取得

        setHasWindow(true)

        // setHasWindowSize(true)

        // window.addEventListener('resize', handleResize);
        // return () => window.removeEventListener('resize', handleResize);

    }, []); // 空の依存関係配列を渡すことで、マウント時とアンマウント時のみ実行されます。

    return hasWindow;
};

export default useHasWindow;