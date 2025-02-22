import React, { useEffect, useRef, useState } from "react";
import DeliveryAgentCard from "./DeliveryAgentCard";
import Loader from "../../../components/components/Loader";

const AgentSearchResults = ({ SearchValue }) => {
  const [response, setResponse] = useState();

  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/admin/search?s=${SearchValue}`,
          {
            method: "GET",
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
