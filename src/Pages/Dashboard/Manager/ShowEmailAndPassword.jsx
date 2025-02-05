import React, { useEffect } from "react";
import { Label } from "@components/components/ui/label";
import copy from "copy-to-clipboard";
import { Button } from "@components/components/ui/Button";
import { Calendar as CalendarIcon, Copy, BadgeCheck } from "lucide-react";
import { Toaster } from "@components/components/ui/toaster";
import { useToast } from "@components/hooks/use-toast";

const ShowEmailAndPassword = ({ ResponseData }) => {
  if (!ResponseData.responseData) {
    return;
  }

  const { toast } = useToast();

  const { email, password } = ResponseData?.responseData;

  const handleTextCopy = (text) => {
    copy(text);
    toast({
      description: "Copied",
    });
  };

  return (
    <>
      <Toaster />
      <div className="w-full">
        <div className="flex items-center justify-center gap-1 text-green-400 text-3xl border-b rounded-md p-2  mb-4">
          <span className="bg-white rounded-full text-green-400">
            <BadgeCheck />
          </span>
          <span className="success_msg font-light text-sm">
            New Employee Created
          </span>
        </div>
        <div className="flex  w-full box_1">
          <div className="w-full">
            <Label htmlFor="emailCred">Email address</Label>
            <div
              id="emailText"
              className="bg-white h-12 rounded-md rounded-r-none flex items-center pl-4"
            >
              {email}
            </div>
          </div>
          <Button
            className="h-12 rounded-l-none bg-orange-300  bg-theme-color self-end"
            onClick={() =>
              handleTextCopy(document.querySelector("#emailText").textContent)
            }
          >
            <Copy />
          </Button>
        </div>

        <div className="flex  w-full box_1">
          <div className="w-full">
            <Label htmlFor="password">Password</Label>
            <div
              id="passwordText"
              className="bg-white h-12 rounded-md rounded-r-none flex items-center pl-4"
            >
              {password}
            </div>
          </div>
          <Button
            className=" h-12 rounded-l-none bg-orange-300  bg-theme-color self-end"
            onClick={() =>
              handleTextCopy(
                document.querySelector("#passwordText").textContent
              )
            }
          >
            <Copy />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ShowEmailAndPassword;
