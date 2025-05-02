import React, { useEffect, useState } from "react";
import SuperVisorCard from "./SuperVisorCard";
import { Search } from "lucide-react";
import { config } from "../../../../../config.js";

const ViewSuperVisorLists = ({ ManagerID }) => {
  const [responseData, setResponseData] = useState();
  const [inputValue, setInputValue] = useState();
  const getToken = localStorage.getItem("AppID") || undefined;

  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/get-all-unassigned-supervisor`,
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
    <>
      <div className="superVisorListsWrapper flex flex-col gap-4 ">
        <form className=" flex">
          <input
            type="text"
            placeholder="Search supervisors"
            className="w-full border rounded-sm p-2 outline-none rounded-r-none"
            onChange={(e) => {
              setInputValue(() => {
                return e.target.value;
              });
            }}
          />
          <button className="bg-orange-200 px-2 rounded-sm rounded-l-none text-neutral-500">
            <Search />
          </button>
        </form>
        <div className="h-96 overflow-y-auto border p-4 rounded-sm">
          {responseData && responseData.length ? (
            responseData.map((item, idx) => {
              return (
                <SuperVisorCard
                  key={idx}
                  TextContent={item}
                  ManagerInfo={ManagerID}
                />
              );
            })
          ) : (
            <p className="text-center text-slate-400">No records founds..</p>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(ViewSuperVisorLists);
