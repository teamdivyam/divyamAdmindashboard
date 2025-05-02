import React from "react";
import { Button } from "@components/components/ui/button";

const Backup = () => {
  return (
    <>
      <div className="backup-container ">
        <h2 className="font-medium text-xl pb-2 border-b mb-8">Backup</h2>
        <Button className=" bg-theme-color"> Download Now</Button>
      </div>
    </>
  );
};

export default Backup;
