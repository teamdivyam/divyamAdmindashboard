import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/components/ui/dialog";

import React, { useEffect, useState } from "react";
import ViewSuperVisorLists from "./ViewSuperVisorLists";

const SetSupervisorToManagerDialog = ({ IsDialogVisible, ManagerInfo }) => {
  const [showSuperVisorDialog, setShowSuperVisorDialog] = useState(false);

  useEffect(() => {
    setShowSuperVisorDialog(IsDialogVisible);
  }, [IsDialogVisible]);

  return (
    <>
      <Dialog
        open={showSuperVisorDialog}
        onOpenChange={setShowSuperVisorDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Supervisor</DialogTitle>
            <DialogDescription>
              <ViewSuperVisorLists ManagerID={ManagerInfo} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(SetSupervisorToManagerDialog);
