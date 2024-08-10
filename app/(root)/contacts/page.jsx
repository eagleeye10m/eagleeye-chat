import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Contacts from "@/components/Contacts";

export default async function ContactsPage() {
  const data = await getServerSession(authOptions);
  const session = JSON.parse(JSON.stringify(data));
  return (
    <div className="px-10 py-6 mb-20 ">
      <Contacts session={session} />
    </div>
  );
}
