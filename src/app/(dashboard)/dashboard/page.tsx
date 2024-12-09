const page = async ({}) => {
  return (
    <div className="container py-12">
      <p className="text-5xl font-bold ">
        <span className="text-indigo-600 ">Messaging app</span> lets you text
        your friends.
      </p>
      <ul className="pt-12 flex flex-col text-zinc-500 text-sm font-medium">
        <li>- lets you connect with your friend who is logged in</li>
        <li>
          - lets you chat by recording message or texting and sending it in text
          form
        </li>
        <li>- Used audio to text LLM to transcribe</li>
        <li>- lets you accept and deny friend requests</li>
        <li>- sends friend requests to known email ids</li>
      </ul>
      <details className="pt-5 text-zinc-500 text-sm ">
        <summary className="font-semibold ">
          What&#39;s pending to implement
        </summary>
        <p>
          -Change db as the cloud is not interacting properly on Vercel.
          <br />
          -optimize pub/sub model
        </p>
      </details>
    </div>
  );
};

export default page;
