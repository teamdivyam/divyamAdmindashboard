import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";
import { Button } from "@components/components/ui/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import APP from "../../../../dataCred.js";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/components/ui/dialog";
import Loader from "../../../components/components/Loader";
import { useNavigate } from "react-router-dom";

const ChangePasswordValidationSchema = yup
  .object({
    password: yup
      .string()
      .min(6, "Password must be minimum 6 character Long")
      .required("Password  is required"),
    newPassword: yup
      .string()
      .min(6, "Password must be minimum 6 character Long")
      .required("Enter your new password"),
  })
  .required("Please confirm the password");

const Change_Password = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(ChangePasswordValidationSchema),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const handleRedirect = () => {
    setOpen(true);
    // remove token from Localstorage
    localStorage.removeItem("AppID");
    // redirect admin on login page
    setTimeout(() => {
      navigate("/login");
    }, 5000);
  };

  const getToken = localStorage.getItem("AppID");
  // http://localhost:3000/api/admin/change-password

  const onSubmit = (data) => {
    const postDataOnServer = async () => {
      try {
        const res = await fetch(
          `${APP.BACKEND_URL}/api/admin/change-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken}`,
            },
            body: JSON.stringify(data),
          }
        );
        const results = await res.json();
        if (results.success === true) {
          toast("Password changed successfully..");
          handleRedirect();
        }
        if (results.success === false) {
          toast(results?.msg);
        }
        reset();
      } catch (error) {
        console.log(error.message);
        reset();
      }
    };

    postDataOnServer();
  };

  return (
    <div className="change_password_wrapper ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password changed successfully</DialogTitle>
            <DialogDescription>
              <span className="flex gap-4">
                <Loader />
                <span>
                  Password has been changed successfully. You are being
                  redirected to the login page
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Toaster />
      <h2 className="font-medium text-xl pb-2 border-b mb-8">
        Change Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your old Password"
              required
              className="h-12"
              {...register("password")}
            />
            <div
              className={`${
                errors?.password
                  ? "block text-red-400 text-sm errMsgStyle"
                  : "text-red-400 text-sm errMsgStyle hidden"
              } `}
            >
              {errors?.password ? errors.password?.message : "."}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              required
              className="h-12"
              {...register("newPassword")}
            />
            <div
              className={`${
                errors?.newPassword
                  ? "block text-red-400 text-sm errMsgStyle"
                  : "text-red-400 text-sm errMsgStyle hidden"
              } `}
            >
              {errors?.newPassword ? errors.newPassword?.message : "."}
            </div>
          </div>
        </div>
        <div className="change-password-action flex justify-end">
          <Button className="mt-4 bg-theme-color w-32 dark:text-white">
            Change Now
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Change_Password;
