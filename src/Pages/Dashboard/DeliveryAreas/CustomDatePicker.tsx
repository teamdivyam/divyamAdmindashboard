import React, { useState } from "react";
import { CalendarDatePicker } from "@components/components/ui/calendar-date-picker";

function DatePickerWithYear() {
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    // to: new Date(),
  });

  return (
    <div className="p-4 max-w-xl">
      <CalendarDatePicker
        date="1/2/2023"
        numberOfMonths={1}
        onDateSelect={(from, to) => {
          console.log(from, to);
        }}
      />
      <div className="mt-4">
        <h2 className="text-md font-semibold">Selected Date Range:</h2>
        <p className="text-sm">
          {selectedDateRange.from.toDateString()} -{" "}
          {/* {selectedDateRange.to.toDateString()} */}
        </p>
      </div>
    </div>
  );
}

export default DatePickerWithYear;
