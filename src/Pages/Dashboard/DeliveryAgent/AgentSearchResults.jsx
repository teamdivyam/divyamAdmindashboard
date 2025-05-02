import React, { useEffect, useRef, useState } from "react";
import DeliveryAgentCard from "./DeliveryAgentCard";
import Loader from "../../../components/components/Loader";
import { config } from "../../../../config.js";

const AgentSearchResults = ({ SearchValue }) => {
  const [response, setResponse] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/search?s=${SearchValue}`,
          {
            method: "GET",
            Authorization: `Bearer ${token}`,
          }
        );
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        setResponse([]);
        throw new Error(error);
      }
    };

    fetchDATA();
  }, []);

  return (
    <>
      <div className="searchResultsContainer border  w-1/2 flex flex-col gap-3 h-[600px] overflow-y-auto rounded-sm bg-neutral-100 py-4 absolute z-30 shadow-md">
        {response && response.length ? (
          response.map((item, idx) => (
            <DeliveryAgentCard key={idx} TextContent={item} />
          ))
        ) : (
          <p className="p-4">No records founds..</p>
        )}
        {/* <Loader /> */}
      </div>
    </>
  );
};

export default AgentSearchResults;
