import { db } from "@/lib/db";

export default async function Home() {
  await db.set("hello", "hello");

  return <div>Root page</div>;
}
