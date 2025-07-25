import { config } from "../../config.js";
import React, { useState } from "react";
import { Button } from "@components/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/components/ui/card";

import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";
import { Navigate, NavLink, useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import isTokenExpired from "../utils/isTokenExpired.js";

const LogInFormValidationSchema = yup
  .object({
    email: yup.string().email().required("Email address is required"),
    password: yup.string().min(6).required("Password is required").max(100),
  })
  .required("Please confirm the password");

const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state?.Auth?.isAuthenticate);
  const [recaptchaRef, setRecaptchaRef] = useState();
  // Redirect user on dashboard if user is logged in;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(LogInFormValidationSchema),
  });

  const [error, setError] = useState(null);

  const helpDeskApiCall = async () => {
    try {
      const res = await fetch(
        `https://www.divyam.com/api/admin-main/me/route`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        console.warn("Something went wrong, during helpdesk api call");
        throw new Error("Something went wrong, Internal error.");
      }
      const result = await res.json();
    } catch (error) {
      throw new Error("Something went wrong, Internal error.");
    }
  };

  const onSubmit = async (data) => {
    const token =
      config.PRODUCTION_MODE === true
        ? await recaptchaRef.executeAsync()
        : "undefined";

    const payload = { ...data, recaptchaToken: token };

    const setLogIn = async () => {
      const response = await fetch(`${config.BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success == false) {
        if (localStorage.getItem("AppID")) {
          localStorage.removeItem("AppID");
        }
        if (
          result.statusCode == 404 &&
          result?.msg ===
            "MongooseError: Operation `admins.findOne()` buffering timed out after 10000ms"
        ) {
          setError("Something went wrong, Internal error");
          return;
        }
        setError(result?.msg);
      }

      if (result.success === true) {
        const localData = localStorage.setItem("AppID", result.token);

        setError(result?.msg);
        navigate("/dashboard");

        // call helpdesk api
        helpDeskApiCall();
      }
    };
    setLogIn();
  };

  const token = localStorage.getItem("AppID");

  const ShowRecaptcha = () => {
    const isProductionModeEnable =
      config.PRODUCTION_MODE == "true" ? true : false;

    if (!isProductionModeEnable) return null;
    return (
      <ReCAPTCHA
        className=""
        size="invisible"
        sitekey={config.REACPTCAH_KEY}
        ref={(ref) => setRecaptchaRef(ref)}
      />
    );
  };

  if (!isTokenExpired(token)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="bg-neutral-50 h-screen flex items-center">
      <Card className="mx-auto max-w-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and Password below to login in your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@divyam.in"
                  required
                  {...register("email")}
                />
                <div
                  className={`${
                    errors?.email
                      ? "block text-red-400 text-sm errMsgStyle"
                      : "text-red-400 text-sm errMsgStyle hidden"
                  } `}
                >
                  {errors?.email ? errors.email?.message : "."}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <NavLink
                    to="/forget-password"
                    className="ml-auto inline-block text-xs  text-neutral-500 hover:text-neutral-600  hover:underline ease-in-out"
                  >
                    Forgot password
                  </NavLink>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  required
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

              {ShowRecaptcha()}
              <Button type="submit" className="w-full bg-theme-color">
                Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account Register and wait for Approval{" "}
            <NavLink to="/register" className="underline">
              Register Now..
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
