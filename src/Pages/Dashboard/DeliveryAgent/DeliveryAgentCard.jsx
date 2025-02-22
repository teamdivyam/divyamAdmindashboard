import React from "react";
import { NavLink } from "react-router-dom";

const DeliveryAgentCard = ({ TextContent }) => {
  return (
    <div className="flex justify-between items-center px-4 py-1 border-b">
      <div className="flex gap-4">
        <img src="https://i.pravatar.cc/300" className="size-12 rounded-full" />
        <div>
          <h2 className="font-medium text-gray-600 ">
            {TextContent?.fullName}
          </h2>
          <p className="text-xs text-gray-400">
            {`${TextContent.city} - ${TextContent.address}`}
          </p>
        </div>
      </div>

      <NavLink to="" className="text-gray-500">
        View profile
      </NavLink>
    </div>
  );
};

export default DeliveryAgentCard;
