import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // const RESTResponse = await fetch(
    //   `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    //     },
    //     cache: "no-store",
    //   }
    // );

    // const data = (await RESTResponse.json()) as { result: string | null };

    // const idAdd = data.result;
    const idAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    if (!idAdd) {
      return new Response("This person doesn't exist", { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idAdd === session.user.id) {
      return new Response("Your are that person :P", { status: 400 });
    }

    //if user already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 });
    }
    //if user already a friend
    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idAdd
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response("Already a friend with you", { status: 400 });
    }

    //valid req, send friend req

    await db.sadd(`user:${idAdd}:incomming_friend_requests`, session.user.id);

    return new Response("ok");
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid req payload", { status: 442 });
    }
    return new Response("invalid request", { status: 400 });
  }
}
