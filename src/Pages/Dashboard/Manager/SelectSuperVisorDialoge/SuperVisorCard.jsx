import React from "react";
import { Button } from "@components/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../../../config.js";

const SuperVisorCard = ({ TextContent, ManagerInfo }) => {
  const managerObjId = ManagerInfo._id; //manager-objet-id
  const superVisorId = TextContent?._id; //supervisor object id-
  if (!TextContent) return;

  const navigate = useNavigate();

  const getToken = localStorage.getItem("AppID");

  const postData = async () => {
    const payload = {
      managerObjId: managerObjId,
      superVisorObjId: superVisorId,
    };

    try {
      const res = await fetch(
        `${config.BACKEND_URL}/api/admin/set-supervisor`,
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
      if (results) {
        navigate(0);
      }
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
          <h2 className="font-semibold capitalize">{TextContent?.fullName}</h2>
          <p>{TextContent?.address}</p>
        </div>
      </div>
      <Button variant="outline" onClick={handleSetNewSuperVisor}>
        Select Supervisor <Check />
      </Button>
    </div>
  );
};

export default React.memo(SuperVisorCard);
