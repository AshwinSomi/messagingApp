import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { messageArrayValidator } from "@/lib/validations/message";
import { User } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

// interface pageProps {
//   params: {
//     chatId: string;
//   };
// }

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    console.log(error);
    notFound();
  }
}

const Page = async ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  // const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;

  const me = chatPartnerId === user.id ? true : false;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)] ">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12 ">
              {me ? (
                <div className="h-8 sm:h-12 w-auto bg-gray-300 rounded-full text-indigo-600 flex items-center justify-center ">
                  <User size={30} />
                </div>
              ) : (
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={chatPartner.image}
                  alt={`${chatPartner.image} profile picture`}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col leading-tight ">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold ">
                {me ? "Mee" : chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600 ">
              {me ? "" : chatPartner.email}
            </span>
          </div>
        </div>
      </div>
      <Messages
        chatId={chatId}
        initialMessages={initialMessages}
        sessionId={session.user.id}
      />
      <ChatInput me={me} chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default Page;
