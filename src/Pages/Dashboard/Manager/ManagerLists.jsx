import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/components/ui/select";

import {
  Table,
  TableBody,
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

import { config } from "../../../../config.js";
import { NavLink } from "react-router-dom";
import { useReducer } from "react";

const initialState = {
  page: 1,
  limit: 18,
};

const Reducer = (state, action) => {
  switch (action.type) {
    case "FIRST_PAGE": {
      return { ...state, page: (state.page = 1) };
    }

    case "SET_PAGE_NUM": {
      return { ...state, page: action.payload };
    }

    case "INC_PAGE": {
      return { ...state, page: state.page + 1 };
    }

    case "DEC_PAGE": {
      return { ...state, page: state.page - 1 };
    }
    case "SET_PAGE_LIMIT": {
      return { ...state, limit: action.payload };
    }

    default: {
      return state;
    }
  }
};

const ManagerLists = () => {
  const [resDATA, setResData] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const getTOKEN = localStorage.getItem("AppID");
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [role, setSelectedRole] = useState("manager");

  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/employees?role=${role}&page=${state.page}&limit=${state.limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json, application/xml",
              "Accept-Language": "en_US",
            },
          }
        );
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
  }, [role, state.page]);

  return (
    <div className="EmployeeLists max-w-[1200px] mx-auto">
      <div className="flex gap-4 justify-end mb-4">
        <Select
          className="bg-yellow-300"
          value={role}
          onValueChange={(value) => {
            setSelectedRole(value);
          }}
        >
          <SelectTrigger className="w-[180px] bg-orange-100 border-none shadow-none text-gray-700">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {resDATA && !resDATA.length ? (
        <div className="text-center block mt-12 font-medium text-neutral-400">
          {`Oops! There are no ${role} yet. Try adding one`}
        </div>
      ) : (
        <>
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
                      <TableRow key={employee._id}>
                        <TableCell className="font-medium">
                          <NavLink to={`${employee._id}`}>
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
        </>
      )}

      {resDATA && resDATA.length > 10 ? (
        <>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() => {
                    {
                      state?.page == 1
                        ? null
                        : dispatch({ type: "FIRST_PAGE" });
                    }
                  }}
                ></PaginationPrevious>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer"
                  isActive
                  onClick={() => {
                    dispatch({ type: "SET_PAGE_NUM", payload: 1 });
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer"
                  isActive
                  onClick={() => {
                    dispatch({ type: "SET_PAGE_NUM", payload: 2 });
                  }}
                >
                  2
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer"
                  isActive
                  onClick={() => {
                    dispatch({ type: "SET_PAGE_NUM", payload: 3 });
                  }}
                >
                  3
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() => {
                    dispatch({ type: "INC_PAGE" });
                  }}
                ></PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : null}
    </div>
  );
};

export default ManagerLists;
