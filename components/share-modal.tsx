"use client";
import { useSelf } from "@liveblocks/react/suspense";
import React, { useState } from "react";

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emial, setEmial] = useState("");
  const [userType, setuserType] = useState("viewer");
  return <div>ShareModal</div>;
};

export default ShareModal;
