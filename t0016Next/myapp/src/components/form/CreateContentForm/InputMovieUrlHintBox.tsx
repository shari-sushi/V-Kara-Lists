type InputMovieUrlHintBoxProps = {
  isDisplay: boolean
  setIsDisplay: (open: boolean) => void
}

export const InputMovieUrlHintBox = ({ isDisplay, setIsDisplay }: InputMovieUrlHintBoxProps) => {
  return (
    <div className="flex relative w-5 text-white ">
      <div
        className="flex absolute -top-5 text-xs justify-center rounded-md h-[16px] w-[15px] m-0.5 bg-[#B7A893] hover:bg-[#776D5C] shadow-sm shadow-black hover:shadow-none cursor-pointer"
        onClick={() => setIsDisplay(true)}
      >
        ？
      </div>

      {isDisplay && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="h-full w-full bg-black opacity-50" onClick={() => setIsDisplay(false)} />

          <div className="absolute z-30 md:top-[150px] items-center min-w-[300px] md:min-w-[600px] md:max-w-3xl w-[90%] py-2 px-4 flex flex-col gap-y-1 bg-[#B7A692] rounded-2xl shadow-lg shadow-black">
            <div className="w-32 self-start text-center rounded-t-md font-bold bg-[#776D5C]">ヒント💡</div>

            <div className="flex flex-col overflow-y-auto h-60 text-black w-full bg-[#FFF6E4]">
              <div className="h-full w-full rounded-b-md px-2">
                V-Karaでは次のような書き方をURLとして認識できます。
                <ul className="pl-3">
                  <li>
                    https://www.youtube.com/watch?v=<u>gwgo01UVPvY</u>&t=1342
                  </li>
                  <li>
                    https://www.youtube.com/live/<u>4OnkujqOMx4</u>
                  </li>
                  <li>
                    https://youtu.be/<u>SHF-EJiC9qk</u>
                  </li>
                  <li>
                    www.youtube.com/watch?v=<u>77lB1lMNOvY</u>&t=1342
                  </li>
                  <li>
                    www.youtube.com/live/<u>CsOHuZLRQOs</u>
                  </li>
                  <li>
                    youtu.be/<u>JXEyM8oZyhg</u>
                  </li>
                  <li>
                    <u>R6w92OanMD8</u>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`flex justify-center items-center w-[40%] h-10 rounded-md p-1 bg-[#776D5C] text-white font-semibold shadow-sm shadow-black hover:shadow-inner hover:shadow-[#FFF6E4]`}
              onClick={() => setIsDisplay(false)}
            >
              閉じる
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
