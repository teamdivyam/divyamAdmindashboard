import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

import APP from "../../../../dataCred.js";
import Loader from "../../../components/components/Loader.jsx";
import { NavLink } from "react-router-dom";

const ManagerLists = () => {
  const [resDATA, setResData] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const getTOKEN = localStorage.getItem("AppID");

  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await fetch(`${APP.BACKEND_URL}/api/admin/manager/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getTOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json, application/xml",
            "Accept-Language": "en_US",
          },
        });
        if (!res.ok) {
          setErr(true);
        }

        const data = await res.json();
        if (data) {
          setResData(data);
        }
      } catch (error) {
        setErr(true);
        setLoading(true);
      }
    };
    fetchDATA();
  }, []);

  return (
    <div className="EmployeeLists max-w-[1200px] mx-auto">
      {resDATA && !resDATA.length ? (
        <div className="text-center block mt-12 font-medium text-neutral-400">
          Oops! There are no employees yet. Try adding one
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Manager Name</TableHead>
              <TableHead>Mobile number</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="text-right">Joined date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resDATA && resDATA.length > 0
              ? resDATA.map((employee) => {
                  const date = new Date(employee.createdAt);
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();

                  // Format the date as dd/mm/yyyy
                  const formattedDate = `${day}/${month}/${year}`;

                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        <NavLink to={`${employee.id}`}>
                          <span> {employee.fullName}</span>
                        </NavLink>
                      </TableCell>
                      <TableCell>
                        <span>{employee.mobileNum}</span>
                      </TableCell>
                      <TableCell className="text-left">
                        <span>{employee.gender}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span> {formattedDate}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <NavLink to={employee.id}>View More</NavLink>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="text-red-400 hover:text-red-800 cursor-pointer">
                          Delete
                        </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ManagerLists;
