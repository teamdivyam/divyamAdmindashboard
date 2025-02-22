import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import SearchResults from "./AgentSearchResults";
import AgentSearchResults from "./AgentSearchResults";
import APP from "../../../../dataCred";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";
import { useDetectClickOutside } from "react-detect-click-outside";

import { NavLink } from "react-router-dom";

const DeliveryAgentLists = () => {
  const Delivery_AGENT_SEARCH_RESULTS = useRef(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [data, setDAta] = useState();

  const hideSearchResultContainer = () => {
    setShowSearchResults(false);
  };
  const ref = useDetectClickOutside({ onTriggered: hideSearchResultContainer });

  const getTOKEN = localStorage.getItem("AppID") || undefined;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/agents?page=1&limit=2`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              "Accept-Language": "en_US",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Something went wrong..");
        }

        const data = await res.json();

        setShowSearchResults(true);
        setDAta(data);
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      ref={ref}
      className="agentListWrapper mx-auto mt-4 px-4 py-2 shadow-md  border border-neutral-200"
    >
      <div id="search-bar">
        <form className="flex">
          <input
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowSearchResults(true);
            }}
            type="search"
            placeholder="Search delivery agents.."
            className="bg-neutral-100 border p-2 rounded-sm w-full rounded-r-none
          transition-colors ease-in-out duration-200  text-neutral-500 focus:outline-none focus:border-orange-300
          "
          />
          <button className="bg-orange-300 text-white rounded-md px-3 rounded-l-none">
            <Search />
          </button>
        </form>

        <div id="show-search-results" className="mt-5 relative">
          {showSearchResults && inputVal && inputVal.length > 3 ? (
            <AgentSearchResults SearchValue={inputVal} />
          ) : null}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Pin code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((agent) => {
              return (
                <TableRow key={agent._id}>
                  <TableCell className="font-medium">
                    <NavLink to={`/dashboard/delivery-agent/${agent?._id}`}>
                      {agent?.fullName}
                    </NavLink>
                  </TableCell>
                  <TableCell className="capitalize">{agent?.city}</TableCell>
                  <TableCell>{agent?.address}</TableCell>
                  <TableCell className="text-right">{agent?.pinCode}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryAgentLists;
