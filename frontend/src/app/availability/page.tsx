"use client";

import React, { useState } from "react";
import Calendar from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

function Availability() {
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);

  const handleDateSelect = (ranges: DateRange[]) => {
    setDateRanges(ranges);
    console.log("Selected date ranges:", ranges);
  };

  const handleSave = async () => {
    try {
      // Create a copy of date ranges with timezone correction
      const DateRanges = dateRanges.map((range) => {
        // Create new Date objects with the date parts only
        const startDate = new Date(range.startDate);
        startDate.setHours(12, 0, 0, 0); 

        const endDate = new Date(range.endDate);
        endDate.setHours(12, 0, 0, 0); 

        return {
          startDate,
          endDate,
        };
      });

      const res = await fetch(
        "https://assignment-renit-backend.onrender.com/availability",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unavailableDates: DateRanges }),
        }
      );

      const data = await res.json();
      console.log("Response:", data);
      toast.success("Availability Stored in DB!", { duration: 5000 });

      // Navigate or show success message here
    } catch (error) {
      console.error("Error saving availability:", error);
      // Show error message to user
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        {/* {Header Section} */}
        <h1 className="text-2xl font-bold mb-5 text-center">
          Product Availability
        </h1>

        {/* Progress Bar */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 w-50">
            <div className="h-1 bg-indigo-500 rounded-2xl flex-1"></div>
            <div className="h-1 bg-indigo-500 rounded-2xl flex-1"></div>
            <div className="h-1 bg-indigo-500 rounded-2xl flex-1"></div>
            <div className="h-1 flex-1 relative">
              <div className="absolute left-0 top-0 rounded-2xl  h-full w-1/2 bg-indigo-500"></div>
              <div className="absolute right-0 border rounded-2xl top-0 h-full w-1/2 bg-white"></div>
            </div>
            <div className="h-1 bg-white flex-1 border rounded-2xl border-gray-200"></div>
          </div>
        </div>

        {/* {Calender Section} */}
        <Calendar onDateSelect={handleDateSelect} />
        {/* {Button section} */}
        <div className="flex justify-center gap-5 mt-1">
          <Button
            variant="outline"
            className="py-7 px-15 cursor-pointer text-lg font-semibold rounded-2xl"
          >
            Add date log
          </Button>
          <Button
            className="py-7 px-20 cursor-pointer text-lg font-semibold bg-indigo-500 hover:bg-indigo-600 rounded-2xl"
            onClick={handleSave}
          >
            <div className=" flex justify-center items-center gap-3">
              <span>Next</span>
              <ArrowRight />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Availability;
