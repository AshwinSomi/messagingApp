import { User } from "lucide-react";
import React from "react";

interface MeChatProps {
  sessionId: string;
}

const MeChat: React.FC<MeChatProps> = ({ sessionId }) => {
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1 ">
      <li key="MeChat">
        <a
          className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold "
          href={`/dashboard/chat/${sessionId}--${sessionId}`}
        >
          <div className="relative h-8 w-auto  ">
            <div className="p-1 bg-gray-300 rounded-full flex items-center justify-center ">
              <User />
            </div>
          </div>
          Mee
        </a>
      </li>
    </ul>
  );
};

export default MeChat;
