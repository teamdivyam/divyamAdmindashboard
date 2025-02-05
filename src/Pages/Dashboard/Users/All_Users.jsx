import { Search } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { NavLink, useNavigate } from "react-router-dom";
import APP from "../../../../dataCred.js";

import UserCard from "./UserCard.jsx";
import { useForm } from "react-hook-form";
import { Button } from "@components/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import debounce from "lodash.debounce";

import { Toaster } from "@components/components/ui/sonner";

import { ChevronsRight, ChevronsLeft } from "lucide-react";
import Loader from "../../../components/components/Loader.jsx";

const SEARCH_USER_VALIDATE_SCHEMA = yup.object({
  searchKey: yup.string().trim().max(50).required("Searchbox can't be blank"),
});

const initialState = {
  page: 1,
  limit: 15,
  isPrevPageAvailable: false,
  isNextPageAvailable: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "NEXT_PAGE": {
      if (state.page >= 1) {
        state.isPrevPageAvailable = true;
      }
      return { ...state, page: state.page + 1 };
    }
    case "PREV_PAGE": {
      if (state.page <= 1) {
        return state;
      }
      return { ...state, page: state.page - 1 };
    }
  }
};

const All_Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [err, setErr] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const getToken = localStorage.getItem("AppID");
  const [state, dispatch] = useReducer(reducer, initialState);

  const [userSearchBarVal, setUserSearchBarVal] = useState();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { error },
    watch,
  } = useForm({
    mode: "all",
    resolver: yupResolver(SEARCH_USER_VALIDATE_SCHEMA),
  });

  function isObject(val) {
    const isObj =
      val !== null && typeof val === "object" && !Array.isArray(val);
    if (isObj) {
      return [...val];
    } else {
      return val;
    }
  }
  const getTOKEN = localStorage.getItem("AppID") || undefined;

  const onSubmit = (data) => {
    const searchUsers = async () => {
      try {
        const res = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/search-user?s=${
            data?.searchKey
          }`,
          {
            cache: "no-cache",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getTOKEN}`,
            },
          }
        );

        const results = await res.json();
        // console.log("Called", results);
        // update state
        setSearchResults(results);
      } catch (error) {
        console.log(error);
      }
    };

    searchUsers();
  };

  const debounceHandler = useCallback(
    debounce(handleSubmit(onSubmit), 1000),
    []
  );

  const handleNext = () => {
    dispatch({ type: "NEXT_PAGE" });
  };

  const handlePrev = () => {
    dispatch({ type: "PREV_PAGE" });
  };

  useEffect(() => {
    const { searchKey } = watch();
    const searchKeylength = searchKey?.length;

    // console.log(searchResults, searchKeylength);

    if (searchKeylength <= 3) {
      setSearchResults(null);
    }
  }, [userSearchBarVal, setUserSearchBarVal]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `${APP && APP.BACKEND_URL}/api/admin/users?page=${state.page}&limit=${
  //           state.limit
  //         }`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${getToken}`,
  //             "Content-Type": "application/json",
  //             Accept: "application/json, application/xml",
  //             "Accept-Language": "en_US",
  //           },
  //         }
  //       );
  //       if (!response.ok) {
  //         setErr(true);
  //         setUsers(() => {
  //           return [];
  //         });
  //       }
  //       const data = await response.json();
  //       console.log("ResponseData", data);

  //       setErr(false);
  //       setUsers(() => {
  //         return [...data];
  //       });
  //     } catch (error) {
  //       setErr(true);
  //     }
  //   };
  //   fetchData();
  // }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${APP?.BACKEND_URL}/api/admin/users?page=${state.page}&limit=${state.limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          // setErr(true);
          setUsers([]); // No need to use a function here, just directly set the empty array
          return; // Early return if the response is not okay
        }

        const data = await response.json();
        // console.log("ResponseData", data);

        setErr(false);
        setUsers(data); // Directly set the data
      } catch (error) {
        console.error("Error fetching data:", error); // Log the error for debugging
        setErr(true);
      }
    };

    fetchData();
  }, [state]);

  const showErrorMsgs = () => {
    if (!users.length) {
      return (
        <span className="text-center font-medium text-slate-400 flex justify-center items-center mt-8">
          Opps No data found
        </span>
      );
    }
  };

  return (
    <>
      {err ? (
        <Loader isFullScreen={true} />
      ) : (
        <>
          {/* http://localhost:3000/api/admin/search-user?name="d"&mobile=7267097201 */}
          <div
            id="userProfile_wrapper "
            className="bg-neutral-50 border p-12  w-1/2 rounded-md mx-auto relative
             dark:bg-slate-700"
          >
            <Toaster richColors />

            <form
              // onChange={handleSubmit(onSubmit)}
              onSubmit={handleSubmit(onSubmit)}
              onChange={debounceHandler}
              className=" w-full  flex justify-between items-center  gap-2 p-2"
            >
              <input
                type="search"
                name="userSearch"
                id="userSearch"
                className="bg-white rounded-full border w-full py-3 px-6  focus:outline-none focus:border-orange-200 focus:ring-1 focus:ring-sky-50 dark:bg-slate-600 dark:border dark:border-orange-100 dark:placeholder:text-gray-200"
                placeholder="Search users.."
                onKeyDown={(e) => {
                  handleSubmit();
                  setUserSearchBarVal(e.target.value);
                }}
                {...register("searchKey")}
              />
              <button className="text-neutral-400 dark:text-orange-200 ">
                <Search className="size-8" />
              </button>
            </form>

            {showErrorMsgs()}

            {
              <ul className="flex lg:flex-col gap-3 lg:mt-4">
                {searchResults && searchResults.length > 0 ? (
                  (() => {
                    return searchResults.map((User, id) => {
                      // const UserArray = isObject(User);
                      // console.log("Converted to Array ", UserArray);
                      return (
                        <UserCard
                          key={User._id}
                          User={User}
                          isSearchResults={true}
                        />
                      );
                    });
                  })()
                ) : (
                  <ul className="flex lg:flex-col gap-3 lg:mt-4">
                    {users && users.length
                      ? users.map((User, idx) => {
                          return (
                            <UserCard
                              key={User._id}
                              User={User}
                              isSearchResults={false}
                            />
                          );
                        })
                      : null}
                  </ul>
                )}
              </ul>
            }

            {users.length && users.length ? (
              <div className="flex gap-2 justify-end">
                {state && state.isPrevPageAvailable && (
                  <button
                    onClick={handlePrev}
                    role="button"
                    title="next"
                    className="bg-orange-300 transition-colors ease-in hover:bg-orange-400 text-white size-10 flex justify-center items-center mt-10 rounded-full"
                  >
                    <ChevronsLeft />
                  </button>
                )}

                <button
                  onClick={handleNext}
                  role="button"
                  title="next"
                  className="bg-orange-300 transition-colors ease-in hover:bg-orange-400 text-white size-10 flex justify-center items-center mt-10 rounded-full"
                >
                  <ChevronsRight />
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default All_Users;
