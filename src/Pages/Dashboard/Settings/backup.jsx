import React, { useState } from "react";
import { Button } from "@components/components/ui/button";

const Backup = () => {
  const [counter, setCounter] = useState(0);

  const handleBackupDownload = () => {
    if (counter >= 1) {
      console.log("BAS_KARO_LAG_RHA_TUMHE_BHI_INCREMENT_CHAHIYE");
      return;
    }

    console.log("ITNE_PAISE_ME_ITNA_HI_MILEGA");
    setCounter((prev) => prev + 1);
  };

  return (
    <>
      <div className="backup-container ">
        <h2 className="font-medium text-xl pb-2 border-b mb-8">Backup</h2>
        <Button className=" bg-theme-color" onClick={handleBackupDownload}>
          Download Now
        </Button>
      </div>
    </>
  );
};

export default Backup;
