import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";
import { cn } from "../lib/utils";
import { Button } from "@components/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import {
  setDistrictName,
  setStateName,
} from "../../store/AreaZone/SetNewAreaZoneSlice.js";

const ComboboxDemo = ({
  inputType,
  placeHolderText,
  optionsText,
  inputDefaultVal,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const dispatch = useDispatch();
  const state = useSelector((state) => state?.AreaZone);

  React.useEffect(() => {
    if (!value) return;
    // if (inputType != "STATE" || inputType != "DISTRICT") return;

    if (inputType === "STATE" && value.length > 0) {
      dispatch(setStateName(value));
    }

    if (inputType === "DISTRICT" && value.length > 0) {
      dispatch(setDistrictName(value));
    }
  }, [value, setValue, inputType]);

  React.useEffect(() => {
    setValue(inputDefaultVal);
    // // if (setDefaultVal) {
    // //   setValue(setDefaultVal.state);
    // // }
    // console.log("TURE || FALSE", setDefaultVal?.district);

    // const isDistrict = setDefaultVal?.district;
    // console.log("DISTRICT", isDistrict);
    // setValue(isDistrict);

    // // if (isDistrict) {
    // //   setValue(isDistrict);
    // // }
    // console.log("DATA FROM PARENT=>", setDefaultVal);
  }, [inputDefaultVal]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12"
        >
          {value
            ? optionsText.find((option) => option.value === value)?.label
            : placeHolderText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] bg-red-300 p-0">
        <Command onValueChange={setValue}>
          <CommandInput placeholder="Utter Pradesh" />
          <CommandList>
            <CommandEmpty>Oops</CommandEmpty>
            <CommandGroup>
              {optionsText.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxDemo;
