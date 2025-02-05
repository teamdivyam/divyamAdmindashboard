import React, { useEffect, useRef, useState } from "react";
import { Input } from "@components/components/ui/input";
import { Button } from "@components/components/ui/button";
import { Label } from "@components/components/ui/label";
import ComboboxDemo from "../../../components/components/comboBox_select";

import { districts_up, IND_state } from "./address_data.js";
import { Search, CircleCheck, MapPin } from "lucide-react";
import { CalendarDatePicker } from "@components/components/ui/calendar-date-picker";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";
import APP from "../../../../dataCred.js";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/components/ui/dialog";

import DatePickerWithYear from "./CustomDatePicker.tsx";
import { Switch } from "@components/components/ui/switch";

import Loader from "../../../components/components/Loader";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setAreaPinCode,
  setEndDate,
  setStartDate,
  toggleIsAvailable,
} from "../../../store/AreaZone/SetNewAreaZoneSlice.js";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const areaPinRegex = /^[1-9]{1}[0-9]{5}$/;

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

const VALIDATE_NEW_AREA_ZONE_FORM = yup.object({
  state: yup.string().trim().min(3).required(),
  district: yup.string().trim().min(3).required(),
  areaPinCode: yup
    .string()
    .required()
    .matches(areaPinRegex, "Invalid Pin code"),

  startDate: yup.string().trim().required(),
  endDate: yup.string().trim().required(),
  isAvailable: yup.boolean().required(),
});

const Add_Delivery_Area = () => {
  const inputPinCode = useRef(null);
  const [Err, setErr] = useState(false);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [openConfirm, setConfirmOpen] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.AreaZone);

  const handleAreaPinSearch = (e) => {
    e.preventDefault();
    const areaPinVal = inputPinCode.current.value;
    const areaPinRegex = /^[1-9]{1}[0-9]{5}$/;
    const isValidAreaPin = areaPinRegex.test(areaPinVal);

    const getAreaPinCodeData = async () => {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${areaPinVal}`,
          {
            cache: "force-cache",
            method: "GET",
            "Content-Type": "application/json",
            charset: "utf-8",
            Accept: "application/json, application/xml",
            "Accept-Language": "en_US",
          }
        );

        if (!res.ok) {
          setErr(true);
          return;
        }

        const results = await res.json();

        console.log(
          "Status",
          `${data && data.length > 0 ? data.Status : null}`
        );

        if (results) {
          setData(results?.[0]?.PostOffice);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!isValidAreaPin) {
      toast.error("Please enter valid pin code");
      return;
    }

    getAreaPinCodeData();
    setOpen(true);
  };

  // VALIDATE_ADD_NEW_AREA_ZONE_FORM

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    trigger,
    formState,
  } = useForm({
    mode: "all",
    resolver: yupResolver(VALIDATE_NEW_AREA_ZONE_FORM),
    defaultValues: {
      state: "",
      district: "",
      areaPinCode: "",
      startDate: "",
      endDate: "",
      isAvailable: "",
    },
  });

  const getToken = localStorage.getItem("AppID");

  // console.log("Watching...", watch());

  // Display all the error message via toast on the UI

  if (formState.errors) {
    // toast.error("please fill the form carefully");
    //
    // const formErrorsOBJ = [formState?.errors];
    // const result = Object.keys(formErrorsOBJ).map((key) => formErrorsOBJ[key]);
    // if (!result) return;
    // result?.forEach((err) => {
    //   toast.error(err?.areaPinCode?.message);
    //   toast.error(err?.district?.message);
    //   toast.error(err?.state?.message);
    //   toast.error(err?.endDate?.message);
    //   toast.error(err?.startDate?.message);
    // });
  }

  const handleSetNewAreaZone = async (e) => {
    e.preventDefault();
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Umm! please fill the form correctly..");
      return;
    }
  };

  const {
    state: areaState,
    district,
    areaPinCode,
    startDate,
    endDate,
    isAvailable,
  } = watch();

  const handleSubmitNewAreaZoneOnServer = async () => {
    const prettyDATA = {
      state: areaState,
      district,
      areaPinCode,
      startDate,
      endDate,
      isAvailable,
    };

    const SUBMIT_DATA_ON_SERVER = async () => {
      try {
        const res = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/areas-zone`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken}`,
              Accept: "application/json, application/xml",
              "Accept-Language": "en_US",
            },
            body: JSON.stringify(prettyDATA),
          }
        );

        const result = await res.json();

        if (!result.success) {
          toast.error(result?.msg);
        }

        if (result.success) {
          toast.success("New area zone created successfully.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    //  form data is valid Or not
    const isValidFormData = await trigger();
    if (!isValidFormData) {
      toast.error("Please fill the form Carefully.");
      return;
    }
    SUBMIT_DATA_ON_SERVER();
  };

  useEffect(() => {
    // set all VAL from redux state to react hook form
    setValue("state", state?.state);
    setValue("district", state?.district);
    setValue("areaPinCode", state?.areaPinCode);
    setValue("startDate", state?.startDate);
    setValue("endDate", state.endDate);
    setValue("isAvailable", state.isAvailable);
  }, [state]);

  useEffect(() => {
    console.log(formState?.errors);
  }, [formState]);

  return (
    <>
      {JSON.stringify(state)}
      <Toaster richColors />
      <Dialog open={openConfirm} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Location Availability</DialogTitle>
            <DialogDescription>
              <span className="mt-2">
                Please review the location details you've entered. If everything
                looks correct, click Save to confirm. If you need to make
                changes, you can go back and edit the information
              </span>
              <span className="border-t  border-slate-100 mt-3  flex  gap-2 justify-end">
                <Button
                  variant="secondary"
                  className="mt-4 "
                  onClick={() => {
                    setConfirmOpen((prev) => !prev);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="secondary"
                  className="mt-4 bg-orange-300 text-white w-20 hover:bg-orange-400"
                  onClick={() => {
                    handleSubmitNewAreaZoneOnServer();
                  }}
                >
                  Save
                </Button>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="border-b pb-4">Area by Pincode</DialogTitle>
            <DialogDescription>
              <span>
                <ul>
                  {data && data.length > 0 ? (
                    data.map((itemText, id) => {
                      return (
                        <li className="flex items-center" key={itemText?.Name}>
                          <span className="bg-white rounded-full p-2 text-green-600">
                            <CircleCheck className="size-4" />
                          </span>
                          {itemText?.Name}
                        </li>
                      );
                    })
                  ) : (
                    <span></span>
                  )}
                </ul>
              </span>

              <NavLink
                target="_blank"
                to={`https://www.google.com/maps/search/${inputPinCode?.current?.value}
`}
                className="w-full block h-10 mt-4 p-2 rounded-md border  bg-gray-300"
              >
                <span className="flex justify-center items-center gap-2">
                  <span className="animate-pulse ">View area On Map</span>
                  <span className="animate-pulse">
                    <MapPin className="text-green-600 animate-pulse " />
                  </span>
                </span>
              </NavLink>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="mx-auto">
        <div className=" mx-4 rounded-sm p-2 py-4">
          <h1 className="capitalize text-2xl border-b font-normal pb-3">
            Add new area zone
          </h1>

          <div
            className="border  mx-auto max-w-2xl rounded-md bg-slate-50 p-4 mt-6"
            id="form_wrapper"
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => handleSetNewAreaZone(e)}
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
                    }}
                  />

                  <button onClick={(e) => handleAreaPinSearch(e)}>
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
                <CalendarDatePicker
                  date="09/02/2021"
                  onDateSelect={({ from, to }) => {
                    const selectedDATE = formatDateInCustomTimeZone(from);
                    dispatch(setStartDate(selectedDATE));
                  }}
                  variant="outline"
                  numberOfMonths={1}
                  className="min-w-[150px]  "
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="firstDate" className="text-neutral-400 ">
                  End Date
                </Label>
                <CalendarDatePicker
                  date="01/09/2021"
                  onDateSelect={({ from, to }) => {
                    const selectedDATE = formatDateInCustomTimeZone(from);
                    dispatch(setEndDate(selectedDATE));
                  }}
                  variant="outline"
                  numberOfMonths={1}
                  className="min-w-[150px] "
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
                  // checked={field.value}
                  onCheckedChange={(e) => {
                    dispatch(toggleIsAvailable());
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="bg-[#ffa94e] uppercase font-semibold hover:bg-orange-300 mt-5 h-12"
                  onClick={() => {
                    setConfirmOpen(true);
                  }}
                >
                  Add New area zone
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_Delivery_Area;
