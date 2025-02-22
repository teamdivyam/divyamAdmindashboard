import React from "react";
import { Button } from "@components/components/ui/Button";
import { Check } from "lucide-react";

const SuperVisorCard = ({ TextContent, ManagerInfo }) => {
  console.log("MANGER_INFO", ManagerInfo, "TEXT", TextContent);
  const managerObjId = ManagerInfo._id; //manager-objet-id
  const superVisorId = TextContent?._id; //supervisor object id-
  if (!TextContent) return;

  const getToken = localStorage.getItem("AppID");

  const postData = async () => {
    const payload = {
      managerObjId: managerObjId,
      superVisorObjId: superVisorId,
    };

    try {
      const res = await fetch(
        "http://localhost:3004/api/admin/set-supervisor",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${getToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const results = await res.json();
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleSetNewSuperVisor = () => {
    postData(); //set-super-visor
  };

  return (
    <div
      id="superVisorCardWrapper"
      className="flex border-b items-center  justify-between pb-3"
    >
      <div className="flex">
        <img src="https://i.pravatar.cc/300" className="size-10 rounded-full" />
        <div className="pl-4">
          <h2 className="font-semibold">{TextContent?.fullName}</h2>
          <p>{TextContent?.address}</p>
        </div>
      </div>
      <Button variant="outline" onClick={handleSetNewSuperVisor}>
        Select Supervisor <Check />
      </Button>
    </div>
  );
};

export default SuperVisorCard;
