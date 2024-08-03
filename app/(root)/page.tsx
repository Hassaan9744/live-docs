import Header from "@/components/header/header";
import AddDocumentBtn from "@/components/add-btn";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";

import { getDocuments } from "@/lib/actions/room.actions";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import { DeleteModal } from "@/components/deleteModal";
import { Notifications } from "@/components/notificationModal";

export default async function Home() {
  const clerkUser = await currentUser();
  console.log("clerkUser", clerkUser);
  if (!clerkUser) {
    redirect("/message");
  }
  const roomDocumetns = await getDocuments(
    `${clerkUser?.emailAddresses[0].emailAddress}`
  );

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {roomDocumetns.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All document</h3>
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {roomDocumetns.Documents.data.map(
              ({ id, metaData, createdAt }: any) => (
                <li key={id} className="document-list-item">
                  <Link
                    href={`/document/${id}`}
                    className="flex-1 items-cener gap-4"
                  >
                    <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                      <Image
                        src="/assets/icons/doc.svg"
                        alt="file"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-lg">{metaData.title}</p>
                      <p className="text-sm font-light text-blue-100">
                        {" "}
                        Created abput {dateConverter(createdAt)}
                      </p>
                    </div>
                  </Link>
                  <DeleteModal roomId={id} />
                </li>
              )
            )}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="document"
            width={40}
            height={40}
            className="mx-auto"
          />
          {clerkUser && (
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          )}
        </div>
      )}
    </main>
  );
}
