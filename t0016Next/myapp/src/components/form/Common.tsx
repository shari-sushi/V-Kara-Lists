import { ToClickTW } from "@/styles/tailwiind";

export const SelectCrudContent = ({ crudContentType, setCrudContentType }: any) => {
    return (
        <div className='w-full'>
            <span className={`flex justify-center items-center`}>
                登録するコンテンツの種類を選択してください
            </span>
            <div id="button_group" className='flex justify-center '>
                <button onClick={() => setCrudContentType("vtuber")}
                    className={`${ToClickTW.choice}  mx-2 
                    ${crudContentType === "vtuber" ? "bg-[#65cf45]" : ""} 
                    `}>
                    VTuber
                </button>
                <button onClick={() => setCrudContentType("movie")}
                    className={`${ToClickTW.choice} mx-2
                    ${crudContentType === "movie" ? "bg-[#65cf45]" : ""}
                    `}>
                    動画(歌枠)
                </button>
                <button onClick={() => setCrudContentType("karaoke")}
                    className={`${ToClickTW.choice} mx-2
                    ${crudContentType === "karaoke" ? "bg-[#65cf45]" : ""}
                    `}>
                    歌(karaoke)
                </button>
            </div>
        </div >
    );
}
