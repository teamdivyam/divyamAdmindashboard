import React, { useEffect, useState } from "react";
import SuperVisorCard from "./SuperVisorCard";
import { Search } from "lucide-react";

const ViewSuperVisorLists = ({ ManagerID }) => {
  const [responseData, setResponseData] = useState();

  const getToken = localStorage.getItem("AppID") || undefined;

  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await fetch(
          `http://localhost:3004/api/admin/get-all-unassigned-supervisor`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${getToken}`,
            },
          }
        );

        const results = await res.json();
        if (results) {
          setResponseData(results);
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchDATA();
  }, []);

  return (
    <div className="superVisorListsWrapper flex flex-col gap-4 ">
      <form className=" flex">
        <input
          type="text"
          name=""
          placeholder="Search supervisors"
          className="w-full border rounded-sm p-2 outline-none rounded-r-none"
        />
        <button className="bg-orange-200 px-2 rounded-sm rounded-l-none text-neutral-500">
          <Search />
        </button>
      </form>
      {responseData &&
        responseData.map((item, idx) => {
          return (
            <SuperVisorCard
              key={idx}
              TextContent={item}
              ManagerInfo={ManagerID}
            />
          );
        })}
    </div>
  );
};

export default ViewSuperVisorLists;
