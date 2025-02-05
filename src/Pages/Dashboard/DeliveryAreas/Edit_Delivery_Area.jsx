import React, { useEffect, useReducer, useRef, useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";
import { Input } from "@components/components/ui/input";
import { Button } from "@components/components/ui/button";
import { Label } from "@components/components/ui/label";
import ComboboxDemo from "../../../components/components/comboBox_select";
import { Search, CircleCheck, MapPin } from "lucide-react";
import { IND_state, districts_up } from "./address_data.js";
import { CalendarDatePicker } from "@components/components/ui/calendar-date-picker";
import { Switch } from "@components/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";

import {
  setAreaPinCode,
  setEndDate,
  setIsAvailable,
  setStartDate,
  toggleIsAvailable,
} from "../../../store/AreaZone/SetNewAreaZoneSlice";

import * as yup from "yup";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import APP from "../../../../dataCred";

const DATE_REGEX =
  /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/;

const areaPinRegex = /^[1-9]{1}[0-9]{5}$/;

const parseDateFromDDMMYYYY = (dateString) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};
const initialDateState = {
  clientStartDate: "01/01/2023",
  clientEndDate: "01/01/2023",
};

const DateReducers = (state, action) => {
  switch (action.type) {
    case "SET_START_DATE": {
      return { ...state, clientStartDate: action?.payload };
    }
    case "SET_END_DATE": {
      return { ...state, clientStartDate: action?.payload };
    }
    default: {
      return state;
    }
  }
};

/**
 * Converts a date string in DD/MM/YYYY format to ISO 8601 format (YYYY-MM-DD).
 * - The date string in DD/MM/YYYY format.
 *  The date in ISO 8601 format.
 */
function toISO8601(dateStr) {
  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) {
    throw new Error(
      "Invalid date format. Please provide a date in DD/MM/YYYY format."
    );
  }

  const paddedDay = String(day).padStart(2, "0");
  const paddedMonth = String(month).padStart(2, "0");

  return `${year}-${paddedMonth}-${paddedDay}`;
}

const formatDateInDDMMYYYY = (dateSTR) => {
  try {
    const date = new Date(dateSTR);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.log(error);
  }
};

function formatDateInCustomTimeZone(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  const timezoneOffset = date.getTimezoneOffset();
  const absOffset = Math.abs(timezoneOffset);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetMinutes = String(absOffset % 60).padStart(2, "0");
  const timezoneSign = timezoneOffset <= 0 ? "+" : "-";
  const timezoneString = `${timezoneSign}${offsetHours}:${offsetMinutes}`;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneString}`;
}

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const UPDATE_AREA_ZONE_FORM = yup.object({
  state: yup.string().trim().min(3).required(),
  district: yup.string().trim().min(3).required(),
  areaPinCode: yup
    .string()
    .required()
    .matches(areaPinRegex, "Invalid Pin code"),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  isAvailable: yup.boolean().required(),
});

const Edit_Delivery_Area = () => {
  const { AREA_ZONE_ID } = useParams();

  const [data, setData] = useState([]);
  const [isAvailableArea, setIsAvailableArea] = useState();
  const [startDateValue, onChangeStartDateValue] = useState("01/01/2000");
  const [endDateValue, onChangeEndDateValue] = useState("01/01/2000");

  const [dateState, dateDispatch] = useReducer(DateReducers, initialDateState);
  const navigate = useNavigate();
  const inputPinCode = useRef(null);
  const dispatch = useDispatch();
  const globalState = useSelector((state) => state.AreaZone);

  const getToken = localStorage.getItem("AppID");
  const { register, setValue, reset, formState, trigger, watch } = useForm({
    resolver: yupResolver(UPDATE_AREA_ZONE_FORM),
    defaultValues: {
      state: "",
      district: "",
      areaPinCode: "",
      startDate: "",
      endDate: "",
      isAvailable: "",
    },
    mode: "All",
  });

  const handleUpdateForm = () => {
    const { areaPinCode, district, endDate, isAvailable, startDate, state } =
      watch();

    // console.log(startDate);
    // return;

    const prettyDATA = {
      state,
      district,
      areaPinCode,
      startDate: toISO8601(startDate),
      endDate: toISO8601(endDate),
      isAvailable,
    };

    const UPDATE_AREA_ZONE_ON_SERVER = async () => {
      try {
        const res = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/areas-zone/${AREA_ZONE_ID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken}`,
              Accept: "application/json, application/xml",
            },
            body: JSON.stringify(prettyDATA),
          }
        );

        const result = await res.json();
        console.log(result);
        if (!result.success) {
          toast.error(result.msg);
          return;
        }
        toast.success(result.msg);
        // setTimeout(() => {
        //   navigate(-1);
        // }, 1000);
      } catch (error) {
        console.log(error);
      }
    };
    UPDATE_AREA_ZONE_ON_SERVER();
  };

  // Get areaZone data from server

  useEffect(() => {
    const getDataFromServer = async () => {
      try {
        const res = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/areas-zone/${AREA_ZONE_ID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken}`,
              Accept: "application/json, application/xml",
            },
          }
        );

        const results = await res.json();

        if (results.success === false) {
          navigate(-1);
        }

        if (results.success === true) {
          setData(results?.responseData);
          // console.log(results?.responseData);x
        }
      } catch (error) {
        toast.error(`Internal error ${error.message}`);
        console.log(error);
      }
    };
    getDataFromServer();
  }, []);

  // SET_DATE_FROM_SERVER
  useEffect(() => {
    if (data.areaPinCode) {
      inputPinCode.current.value = data?.areaPinCode;
      dispatch(setAreaPinCode(data?.areaPinCode));
      const areaPinSTR = "" + data?.areaPinCode;
      setValue("areaPinCode", areaPinSTR);
    }
    if (data.isAvailable) {
      setIsAvailableArea((prev) => data.isAvailable);
      dispatch(setIsAvailable(data?.isAvailable));
    }
    // SET_DATE_FROM_SERVER
    dateDispatch({
      type: "SET_START_DATE",
      payload: formatDateInCustomTimeZone(data?.startDate),
    });

    dateDispatch({
      type: "SET_END_DATE",
      payload: formatDateInDDMMYYYY(data?.endDate),
    });
  }, [data, setData]);
  // const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;

  useEffect(() => {
    // SEt STart date
    if (data?.startDate) {
      const formattedStartDate = formatDateInDDMMYYYY(data?.startDate);

      // check date is in DD/MM/YYY format or not
      const isDateInDDMMYYY = DATE_REGEX.test(formattedStartDate);

      if (isDateInDDMMYYY) {
        const dateObject = parseDateFromDDMMYYYY(formattedStartDate);
        if (!isNaN(dateObject)) {
          // Set Start date in state
          onChangeStartDateValue(() => {
            return dateObject;
          });
          // set date on redux state

          dispatch(setStartDate(formattedStartDate));
          setValue("startDate", formattedStartDate);
        } else {
          console.error("Invalid Date object created from", formattedStartDate);
        }
      } else {
        console.error("Date format is incorrect:", formattedStartDate);
      }
    }

    // Set ENd date

    if (data?.endDate) {
      const formattedEndDate = formatDateInDDMMYYYY(data?.endDate);

      // check date is in DD/MM/YYY format or not
      const isDateInDDMMYYY = DATE_REGEX.test(formattedEndDate);

      if (isDateInDDMMYYY) {
        const dateObject = parseDateFromDDMMYYYY(formattedEndDate);
        if (!isNaN(dateObject)) {
          onChangeEndDateValue(() => {
            return dateObject;
          });

          // set End date on redux state
          dispatch(setEndDate(formattedEndDate));
          setValue("endDate", formattedEndDate);
        } else {
          console.error("Invalid Date object created from", formattedStartDate);
        }
      } else {
        console.error("Date format is incorrect:", formattedStartDate);
      }
    }
  }, [data, setData]);

  const handleStartDateInput = (selectedDate) => {
    const formateInputDate = formatDateInDDMMYYYY(selectedDate);
    // check date is in DD/MM/YYY format or not
    const isDateInDDMMYYY = DATE_REGEX.test(formateInputDate);

    if (isDateInDDMMYYY) {
      const dateObject = parseDateFromDDMMYYYY(formateInputDate);
      if (!isNaN(dateObject)) {
        onChangeStartDateValue(() => {
          return dateObject;
        });
        // set End date on redux state
        dispatch(setStartDate(formateInputDate));
        setValue("startDate", formateInputDate);
      } else {
        console.error("Invalid Date object created from", formateInputDate);
      }
    } else {
      console.error("Date format is incorrect:", formateInputDate);
    }
  };

  const handleEndDateInput = (selectedDate) => {
    const formateInputDate = formatDateInDDMMYYYY(selectedDate);
    // check date is in DD/MM/YYY format or not
    const isDateInDDMMYYY = DATE_REGEX.test(formateInputDate);

    if (isDateInDDMMYYY) {
      const dateObject = parseDateFromDDMMYYYY(formateInputDate);
      if (!isNaN(dateObject)) {
        onChangeEndDateValue(() => {
          return dateObject;
        });
        // set End date on redux state
        dispatch(setEndDate(formateInputDate));
        setValue("endDate", formateInputDate);
      } else {
        console.error("Invalid Date object created from", formateInputDate);
      }
    } else {
      console.error("Date format is incorrect:", formateInputDate);
    }
  };

  useEffect(() => {
    setValue("state", globalState?.state);
    setValue("district", globalState?.district);
    setValue("isAvailable", data?.isAvailable);
  }, [globalState]);

  useEffect(() => {
    setValue("isAvailable", isAvailableArea);
  }, [isAvailableArea, setIsAvailable]);

  return (
    <>
      <Toaster richColors />
      <div className="mx-auto">
        <div className=" mx-4 rounded-sm p-2 py-4">
          <h1 className="capitalize text-2xl border-b font-normal pb-3">
            Update Area Zone
          </h1>

          <div
            className="border  mx-auto max-w-2xl rounded-md bg-slate-50 p-4 mt-6"
            id="form_wrapper"
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="state" className="text-neutral-400">
                  State
                </Label>
                <span className="w-full ">
                  <ComboboxDemo
                    placeHolderText="Select State"
                    optionsText={IND_state}
                    inputType="STATE"
                    inputDefaultVal={data && data?.state}
                  />
                </span>
              </div>

              <div className="flex flex-col gap-2 ">
                <Label htmlFor="district" className="text-neutral-400">
                  District
                </Label>
                <ComboboxDemo
                  inputType="DISTRICT"
                  placeHolderText="Select district"
                  optionsText={districts_up}
                  inputDefaultVal={data && data?.district}
                />
              </div>

              <div className="flex flex-col gap-2 -mt-2">
                <Label htmlFor="areaPin" className="text-neutral-400 ">
                  Pin code
                </Label>
                <span className=" flex h-10">
                  <Input
                    className="
                border-r-0
               rounded-r-none
                h-12"
                    placeholder="Enter area pin code"
                    ref={inputPinCode}
                    onChange={(e) => {
                      inputPinCode.current.value = e?.target?.value;
                      dispatch(setAreaPinCode(e?.target?.value));
                      setValue("areaPinCode", e?.target?.value);
                    }}
                  />
                  <button>
                    <span className="bg-orange-300 rounded-sm h-12  w-12  text-white border-l-0 rounded-l-none flex justify-center items-center">
                      <Search className="size-4" />
                    </span>
                  </button>
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="firstDate" className="text-neutral-400 ">
                  Start Date
                </Label>
                <DatePicker
                  onChange={handleStartDateInput}
                  value={startDateValue}
                  // format="DD/MM/YYYY"
                  className="bg-slate-50 border p-1 rounded-md h-12"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="firstDate" className="text-neutral-400 ">
                  End Date
                </Label>
                <DatePicker
                  onChange={handleEndDateInput}
                  value={endDateValue}
                  className="bg-slate-50 border p-1 rounded-md h-12"
                />
              </div>

              <div className="border p-4 rounded-md shadow-sm flex justify-between items-center">
                <div className="toggleSwitchTextContent">
                  <h3 className="font-medium">Service Availability</h3>
                  <p className="text-neutral-500">
                    Set the status if the service is available or offline.
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-200"
                  checked={isAvailableArea}
                  onCheckedChange={(e) => {
                    setIsAvailableArea((prev) => !prev);
                    // setValue("isAvailable", isAvailableArea);
                    dispatch(toggleIsAvailable());
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="bg-[#ffa94e] uppercase font-semibold hover:bg-orange-300 mt-5 h-12"
                  onClick={() => {
                    // setConfirmOpen(true);
                    handleUpdateForm();
                  }}
                >
                  Update area zone
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit_Delivery_Area;
