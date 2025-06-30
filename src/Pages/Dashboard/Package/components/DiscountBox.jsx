import React, { useState } from "react";
import { Input } from "@components/components/ui/input";
import { NumericFormat } from "react-number-format";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/components/ui/dialog";
import { Button } from "@components/components/ui/button";
import { useMemo } from "react";

const DiscountBox = ({ Open, ToggleDialoge, ProductPrice }) => {
  const [discountInputVal, setDiscountInputVal] = useState();

  const formattedProductPrice = ProductPrice.replace(/₹/g, "");

  const disCount = useMemo(() => {
    return (
      formattedProductPrice - (formattedProductPrice * discountInputVal) / 100
    );
  }, [discountInputVal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //
  };

  return (
    <Dialog open={Open} onOpenChange={ToggleDialoge}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Discount</DialogTitle>
          <DialogDescription>
            <span className="block text-neutral-400">
              Set how much discount users get when they come through a referral.
            </span>
            <span className="font-bold my-4">
              <NumericFormat
                value={disCount}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₹"}
              />
            </span>
            <form onSubmit={handleSubmit} className="mt-4">
              <Input
                placeholder="Discount percent, Eg 5%"
                onChange={(e) => setDiscountInputVal(e.target?.value)}
              />
              <span className="flex justify-end mt-4 ">
                <Button
                  className="bg-orange-400 hover:bg-orange-300 w-32"
                  onClick={ToggleDialoge}
                >
                  Done
                </Button>
              </span>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DiscountBox);
