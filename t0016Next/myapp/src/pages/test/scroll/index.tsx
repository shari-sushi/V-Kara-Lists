import { useState, useEffect, useCallback, useRef } from "react";
import Logo from "@/assets/images/logo.png";

interface WorkspaceSummary {
  workspaceId: string;
  workspaceName: string;
  workspaceIcon?: string;
  members: { id: string; name: string; avatarUrl: string | undefined }[];
  memberCount: number;
}

const DisplayJoinedWorkspaceLists = ({ state }: { state: { summaries: WorkspaceSummary[]; user: { email: string } } }) => {
  const { summaries, user } = state;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        // 追加: スクロール位置のパーセンテージを計算
        const scrollableHeight = scrollHeight - clientHeight;
        if (scrollableHeight > 0) {
          const percentage = (scrollTop / scrollableHeight) * 100;
          setScrollPercentage(Math.round(percentage));
        } else {
          setScrollPercentage(0);
        }
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollUp = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: -300,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollDown = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 300,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      <div className="text-center text-[1.8rem] font-bold">&#x1f973;Welcome to PortalKey!</div>
      <div className="mt-12 p-0 rounded-md overflow-hidden">
        <div className="flex p-4 bg-surface-container-highest justify-between items-center">
          <div className="font-bold">{user.email} のワークスペース</div>
          <a
            className="flex items-center gap-2 cursor-pointer hover:brightness-110 bg-gradient-to-r from-primary to-[#18B7D3] font-semibold rounded hover:text-[#0d394b] text-white disabled:text-gray-100 disabled:bg-gray-300 py-2 px-6 fill-white hover:fill-[#0d394b]"
            href={`DESKTOP_LOGIN_URL`}
            rel="noreferrer"
            target="_self"
          >
            PortalKeyを起動する
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
            </svg>
          </a>
        </div>
        <div className="relative bg-surface-container-high">
          <div ref={scrollRef} className="max-h-[400px] m-0 list-none p-0 overflow-y-auto scrollbar">
            {summaries.map((summary) => {
              return (
                <li key={summary.workspaceId} className="flex gap-2 p-4">
                  <div className="object-scale-down h-[70px] w-[70px]">
                    <DummyIcon />
                  </div>
                  <Description summary={summary} />
                </li>
              );
            })}
          </div>
          {summaries.length > 4 && scrollPercentage > 10 && (
            <div className="absolute top-0.5 left-1/2 cursor-pointer opacity-40 hover:opacity-90 rounded-full overflow-hidden" onClick={scrollUp}>
              <ScrollUpIcon height={30} width={30} className="fill-gray-100 bg-gray-800 " />
            </div>
          )}
          {summaries.length > 4 && scrollPercentage < 99 && (
            <div className="absolute bottom-0.5 left-1/2 cursor-pointer opacity-40 hover:opacity-90 rounded-full overflow-hidden" onClick={scrollDown}>
              <ScrollDownIcon height={30} width={30} className="fill-gray-100 bg-gray-800 " />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const DummyIcon = ({}: {}) => {
  return (
    <div className={`flex text-sm rounded-sm w-full h-full bg-secondary-container text-on-primary overflow-hidden items-center justify-center no-underline`}>
      <span className="text-center flex justify-center text-nowrap no-underline text-on-secondary-container"></span>
    </div>
  );
};

const ScrollUpIcon = ({ height, width, className }: { height: number; width: number; className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} className={className}>
      <path xmlns="http://www.w3.org/2000/svg" d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z" />
    </svg>
  );
};

const ScrollDownIcon = ({ height, width, className }: { height: number; width: number; className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} className={className}>
      <path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z" />
    </svg>
  );
};

const Description = ({ summary }: { summary: WorkspaceSummary }) => {
  const pickMembers = summary.members.slice(0, 5);

  return (
    <div className="flex flex-col gap-2 justify-center ml-2">
      <div className="text-lg font-bold leading-5">{summary.workspaceName}</div>
      <div className="flex">
        {pickMembers.map((member) => (
          <div key={member.id} className="flex h-6 w-6 -ml-1">
            {/* <AvatarImage className="" user={member} alt={member.name} /> */}
          </div>
        ))}
        <div className="ml-1">{summary.memberCount}人のメンバーが参加しています</div>
      </div>
    </div>
  );
};
