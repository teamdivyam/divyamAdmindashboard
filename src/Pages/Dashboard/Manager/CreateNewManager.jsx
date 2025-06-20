import React, { useEffect, useState } from "react";
import { Button } from "@components/components/ui/button";
import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";
import { Textarea } from "@components/components/ui/textarea";
import { Info } from "lucide-react";
import { UserRoundPlus } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/components/ui/select";

import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import ShowEmailAndPassword from "./ShowEmailAndPassword.jsx";

import { config } from "../../../../config.js";
import { MultiSelect } from "../../../components/components/multiSelect";

const CREATE_NEW_EMPLOYEE_SCHEMA_VALIDATION = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(3, "fullName must be minimum 3 character long")
    .required("name is Required."),
  gender: yup.string().required("gender is required."),
  mobileNum: yup
    .string()
    .trim()
    .length(10)
    .required("Phone number is required.."),
  role: yup.string().min(3).max(20).required("role is required field"),
  email: yup.string().email().required("email address is required"),
  dob: yup.string().required("date of birth is required"),
  pinCode: yup.string().length(6).required("area pin code is required"),
  assignedPinCodesLists: yup.array(),
  address: yup.string().max(100).required("employee address is required"),
  profile: yup
    .mixed()
    .required("profile image is required")
    .test("type", "we only support jpeg or png", (value) => {
      return (
        value &&
        (value[0]?.type === "image/jpeg" || value[0]?.type === "image/png")
      );
    })
    .test("fileSize", "oops file is to large.", (value) => {
      return value && value[0]?.size <= 5000000;
    }),
});

const CreateNewEmployee = () => {
  const [date, setDate] = useState();
  const [showUserCred, setUserCred] = useState(false);
  const [gender, setGender] = useState();
  const [ResponseData, setResponseData] = useState(null);

  const [pinCodesData, setPinCodesData] = useState();

  const {
    reset,
    resetField,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(CREATE_NEW_EMPLOYEE_SCHEMA_VALIDATION),
    defaultValues: {
      fullName: "",
      role: "",
      gender: "",
      mobileNum: "",
      email: "",
      dob: "",
      pinCode: "",
      address: "",
      assignedPinCodesLists: "",
    },
  });

  console.log(watch());
  console.log(errors);

  const getTOKEN = localStorage.getItem("AppID");

  const onsubmit = (data) => {
    console.log(data);
    //Prepare data to send on backend..
    const formData = new FormData();

    data.assignedPinCodesLists.map((pinCode) => {
      formData.append("assignedPinCode[]", pinCode);
    });

    formData.append("fullName", data.fullName);
    formData.append("role", data.role);
    formData.append("dob", data.dob);
    formData.append("gender", data.gender);
    formData.append("email", data.email);
    formData.append("mobileNum", data.mobileNum);
    formData.append("pinCode", data.pinCode);
    formData.append("avatar", data?.profile[0]);
    formData.append("address", data.address);

    // SEND DATA ON BACKEND

    const postDATA = async (data) => {
      console.log(data);
      try {
        const res = await fetch(`${config.BACKEND_URL}/api/admin/employee`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getTOKEN}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Oops Something went wrong");
        }

        const result = await res.json();

        if (result.success) {
          // show email and password
          setUserCred(true);
          reset();
          // Set API response data in the State to use in another components
          setResponseData(() => {
            return result;
          });
        }
        // console.log(result);
      } catch (error) {
        console.log(error);
      }
    };

    postDATA(data);
  };

  const handlePinCodeChange = (pinCodes) => {
    // return an array
    const pinCodesArr = pinCodes.map((item, idx) => {
      return [item.value];
    });
    // console.log("Available pin Array", pinCodesArr);
    setValue("assignedPinCodesLists", pinCodesArr);
    // setValue();
  };

  useEffect(() => {
    const fetchPinCodes = async () => {
      try {
        const res = await fetch(
          `${config && config.BACKEND_URL}/api/admin/areas`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch pin codes");
        }
        const data = await res.json();
        if (data) {
          const formattedData = data.map((item) => {
            return {
              value: item.areaPinCode,
              label: `${item.areaPinCode} ${item.district}`,
            };
          });

          setPinCodesData(formattedData);
        }
      } catch (error) {
        throw new Error(error?.message);
      }
    };

    fetchPinCodes();
  }, []);

  if (!pinCodesData) return;
  return (
    <>
      <div
        className="bg-neutral-100 dark:bg-gray-700 rounded-lg border p-6 mx-auto w-1/2"
        id="oderPreview"
      >
        <div className="cardHeader w-full ">
          <h1 className="border-b pb-2  font-medium">
            <span className="flex items-center  gap-2">
              <span className="bg-orange-300 rounded-md p-2">
                <UserRoundPlus className="bg-orange-300 text-white" />
              </span>
              <span className="text-3xl font-light uppercase opacity-40 text-slate-600">
                Create new Employee
              </span>
            </span>
          </h1>
        </div>

        {showUserCred && showUserCred ? (
          <div
            id="userLoginCredential"
            className="userLoginCredential_Wrapper mt-12 errMsgStyle"
          >
            <ShowEmailAndPassword ResponseData={ResponseData} />
          </div>
        ) : (
          <>
            <div className="cardBody bg-white dark:bg-slate-800 rounded-md border p-6 mt-6">
              <div className="newEmployee ">
                <form onSubmit={handleSubmit(onsubmit)} id="newPackageForm">
                  <div className="grid gap-2 w-full my-4">
                    <Label htmlFor="fullName">
                      <div className="labelText flex  ">
                        Employee name
                        <span className="text-red-400 mt-[3.5px] pl-1">*</span>
                      </div>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Employee Name"
                      required
                      className="h-12 focus-visible:ring-offset-0 focus-visible:ring-0"
                      {...register("fullName")}
                    />
                    <div
                      className={`${
                        errors?.fullName
                          ? "block text-red-400 text-sm errMsgStyle capitalize"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      {errors?.fullName ? errors.fullName?.message : "."}
                    </div>
                  </div>
                  <div className="grid gap-2 w-full my-4">
                    <Label htmlFor="mobileNum">
                      <div className="labelText flex  ">
                        Gender
                        <span className="text-red-400 mt-[3.5px] pl-1">*</span>
                      </div>
                    </Label>
                    <Select
                      name="gender"
                      className="h-12 focus-visible:ring-offset-0 focus-visible:ring-0"
                      onValueChange={(value) => {
                        setGender(value);
                        setValue("gender", value, { shouldValidate: true });
                      }}
                    >
                      <SelectTrigger className="h-12 focus-visible:ring-offset-0 focus-visible:ring-0">
                        {gender && gender ? gender : "Select your gender"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other.</SelectItem>
                      </SelectContent>
                    </Select>

                    <input
                      type="hidden"
                      {...register("gender", {
                        required: "Please select a gender",
                      })}
                    />

                    <div
                      className={`${
                        errors?.gender
                          ? "block text-red-400 text-sm errMsgStyle"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      {errors?.gender ? errors.gender?.message : "."}
                    </div>
                  </div>

                  <div className="grid gap-2 w-full my-4">
                    <Label>Choose role</Label>
                    <Select
                      onValueChange={(value) => {
                        setValue("role", value, { shouldValidate: true });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2 w-full my-4">
                    <Label htmlFor="mobileNum">
                      <div className="labelText flex  ">
                        Mobile number
                        <span className="text-red-400 mt-[3.5px] pl-1">*</span>
                      </div>
                    </Label>
                    <Input
                      id="mobileNum"
                      name="mobileNum"
                      type="number"
                      placeholder="Employee mobile number"
                      required
                      className="h-12 focus-visible:ring-offset-0 focus-visible:ring-0"
                      {...register("mobileNum")}
                    />

                    <div
                      className={`${
                        errors?.mobileNum
                          ? "block capitalize text-red-400 text-sm errMsgStyle"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      {errors?.mobileNum ? errors.mobileNum?.message : "."}
                    </div>
                  </div>

                  <div className="grid gap-2 w-full my-4">
                    <Label htmlFor="email">
                      <div className="labelText flex  ">
                        Email address
                        <span className="text-red-400 mt-[3.5px] pl-1">*</span>
                      </div>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email address."
                      className="h-12 focus-visible:ring-offset-0 focus-visible:ring-0"
                      required
                      {...register("email")}
                    />

                    <div
                      className={`${
                        errors?.email
                          ? "block capitalize text-red-400 text-sm errMsgStyle"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      <span className="capitalize">
                        {errors?.email ? errors.email?.message : "."}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2 w-full my-4">
                    <Label htmlFor="profile">
                      <div className="labelText flex  ">
                        Profile image
                        <span className="text-red-400 mt-[3.5px] pl-1">*</span>
                      </div>
                    </Label>
                    <input
                      type="file"
                      id="profile"
                      className="border p-2 w-full  rounded-md file:bg-orange-100 file:outline-none file:border-none file:rounded-md file:text-gray-700 file:font-medium text-gray-700"
                      {...register("profile")}
                    />
                    <div
                      className={`${
                        errors?.profile
                          ? "block capitalize text-red-400 text-sm errMsgStyle"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      {errors?.profile ? errors.profile?.message : "."}
                    </div>
                  </div>

                  <div className="grid gap-2  mt-4 w-full">
                    <Label htmlFor="address">
                      <div className="labelText flex  ">
                        Date of birth
                        <span className="text-red-400 mt-[3.5px] pl-1">*</span>
                      </div>
                    </Label>
                    <Input
                      name="dob"
                      id="dob"
                      type="date"
                      required
                      {...register("dob")}
                    />

                    <div
                      className={`${
                        errors?.dob
                          ? "block capitalize text-red-400 text-sm errMsgStyle"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      {errors?.dob ? errors.dob?.message : "."}
                    </div>
                  </div>

                  <div className="grid gap-2 w-full my-4">
                    <Label htmlFor="pinCode">
                      <div className="labelText flex items-center gap-1">
                        <span>
                          <span>Assign Pincode</span>
                          <span className="text-red-400 mt-[3.5px] pl-1">
                            *
                          </span>
                        </span>
                        <span title="info">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="size-3 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Enter the area pin code to assign a manager
                                  who will manage delivery partners in this area
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                      </div>
                    </Label>
                    <MultiSelect
                      OptionsValue={pinCodesData}
                      setPinCodes={handlePinCodeChange}
                    />
                    <div
                      className={`${
                        errors?.assignedPinCodesLists
                          ? "block capitalize text-red-400 text-sm errMsgStyle"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      {errors?.assignedPinCodesLists
                        ? errors.assignedPinCodesLists?.message
                        : "."}
                    </div>
                  </div>

                  <div className="grid gap-2 w-full my-4">
                    <Label htmlFor="pinCode">
                      <div className="labelText flex  ">
                        Pin code
                        <span className="text-red-400 mt-[3.5px] pl-1">*</span>
                      </div>
                    </Label>
                    <Input
                      id="pinCode"
                      type="number"
                      placeholder="Area pin code"
                      className="h-12 focus-visible:ring-offset-0 focus-visible:ring-0"
                      required
                      {...register("pinCode")}
                    />

                    <div
                      className={`${
                        errors?.pinCode
                          ? "block capitalize text-red-400 text-sm errMsgStyle"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      {errors?.pinCode ? errors.pinCode?.message : "."}
                    </div>
                  </div>
                  <div className="grid gap-2 w-full my-4">
                    <Label htmlFor="address">
                      <div className="labelText flex  ">
                        Address
                        <span className="text-red-400 mt-[3.5px] pl-1">*</span>
                      </div>
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Address."
                      className="h-18 focus-visible:ring-offset-0 focus-visible:ring-0"
                      {...register("address")}
                    />

                    <div
                      className={`${
                        errors?.address
                          ? "block capitalize text-red-400 text-sm errMsgStyle"
                          : "text-red-400 text-sm errMsgStyle hidden"
                      } `}
                    >
                      {errors?.address ? errors.address?.message : "."}
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-orange-300 h-12 bg-theme-color">
                    Create Now
                  </Button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CreateNewEmployee;
