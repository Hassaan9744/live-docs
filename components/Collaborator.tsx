import { Divide } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import { removeUser, updateDocumentAccess } from "@/lib/actions/room.actions";

const Collaborator = ({
  roomId,
  user,
  collaborator,
  creatorId,
  email,
}: CollaboratorProps) => {
  const [userType, setUserType] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const shareDocumentHandler = async (type: string) => {
    setLoading(true);
    await updateDocumentAccess({
      roomId,
      email,
      userType: type as UserType,
      updatedBy: user,
    });
    setLoading(false);
  };
  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);
    await removeUser({
      roomId,
      email,
    });
    setLoading(false);
  };
  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2 ">
        <Image
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-none rounded-full"
        />
        <div>
          <p className="line-clamp-1 leading-4 text-sm font-semibold text-white">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && "updating..."}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
      </div>
      {creatorId === collaborator.id ? (
        <p className="text-sm text-blue-100 ">Owner</p>
      ) : (
        <div className="flex items-center">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setUserType || "viewer"}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            type="button"
            onClick={() => removeCollaboratorHandler(email)}
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
};

export default Collaborator;
