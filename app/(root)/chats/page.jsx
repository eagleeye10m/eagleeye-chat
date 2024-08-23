// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ChatList from "@/components/ChatList";
import Contacts from "@/components/Contacts";

//this approch is for server components
export default async function Page() {
  // const data = await getServerSession(authOptions);
  // const session = JSON.parse(JSON.stringify(data));

  return (
    <section className="main-container">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        {/* <ChatList session={session} /> */}
        <ChatList />
      </div>
      <div className="w-2/3 max-lg:w-1/2 max-md:hidden">
        {/* <Contacts session={session} /> */}
        <Contacts />
      </div>
    </section>
  );
}
