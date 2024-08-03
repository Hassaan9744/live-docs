"use client";
import { createDocument } from "@/lib/actions/room.actions";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AddBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({ userId, email });
      if (room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Button
      className="gradient-blue flex gap-1 shadow-md"
      type="submit"
      onClick={addDocumentHandler}
    >
      <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
};

export default AddBtn;
