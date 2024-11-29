"use client";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequests[];
  sessionId: string;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<
    IncomingFriendRequests[]
  >(incomingFriendRequests);

  const acceptFriend = async (senderId: string) => {
    try {
      await axios.post("/api/friends/accept", { id: senderId });
      setFriendRequests((prev) =>
        prev.filter((req) => req.senderId !== senderId)
      );
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });
    setFriendRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId)
    );
    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500 ">No Friend requests.</p>
      ) : (
        friendRequests.map((requests) => (
          <div key={requests.senderId} className="flex gap-4 items-center ">
            <UserPlus className="text-black " />
            <p className="font-medium text-lg">{requests.senderEmail}</p>
            <button
              aria-label="accept friend"
              onClick={() => acceptFriend(requests.senderId)}
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md "
            >
              <Check className="font-semibold text-wite w-3/4 h-3/4 " />
            </button>

            <button
              aria-label="deny friend"
              onClick={() => denyFriend(requests.senderId)}
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md "
            >
              <X className="font-semibold text-wite w-3/4 h-3/4 " />
            </button>

            <button></button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
