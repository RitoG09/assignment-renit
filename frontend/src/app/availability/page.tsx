"use client";

import React, { useState, useRef, useEffect } from "react";
import Calendar from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface DateRange {
  startDate: Date;
  endDate: Date;
}

function Availability() {
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<DateRange | null>(
    null
  );
  const calendarRef = useRef<{ addCurrentSelection: () => boolean } | null>(
    null
  );

  useEffect(() => {
    const savedRanges = localStorage.getItem("dateRanges");
    if (savedRanges) {
      try {
        const parsedRanges = JSON.parse(savedRanges).map(
          (range: DateRange) => ({
            startDate: new Date(range.startDate),
            endDate: new Date(range.endDate),
          })
        );
        setDateRanges(parsedRanges);
      } catch (error) {
        console.error("Error parsing saved date ranges:", error);
      }
    }
  }, []);

  const handleDateSelect = (ranges: DateRange[]) => {
    setDateRanges(ranges);
    // Save to localStorage whenever dates are updated
    localStorage.setItem("dateRanges", JSON.stringify(ranges));
    console.log("Selected date ranges:", ranges);
  };

  const handleRangeSelect = (range: DateRange | null) => {
    setCurrentSelection(range);
  };

  const handleAddDateLog = () => {
    if (calendarRef.current) {
      const added = calendarRef.current.addCurrentSelection();
      if (!added) {
        toast.error("Please select a date range first");
      } else {
        setCurrentSelection(null);
      }
    }
  };

  const handleSave = async () => {
    if (dateRanges.length === 0) {
      // toast.error("Add date log first");
      return;
    }

    try {
      setLoading(true);
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
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Suavbar height */}
      <div className="flex-1">
        <div className="w-full max-w-2xl mx-auto py-2 sm:py-8 px-4">
          {/* {Header Section} */}
          <div>
            <Link href="https://assignment-renit.onrender.com/post">
              <ArrowLeft className="size-5 cursor-pointer " />
            </Link>

            <h1
              className={`text-xl sm:text-2xl font-[600] mb-3 sm:mb-5 text-center ${poppins.className}`}
            >
              Product Availability
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex gap-1 sm:gap-2 w-full max-w-xs sm:max-w-sm">
              <div className="h-1 bg-indigo-500 rounded-2xl flex-1"></div>
              <div className="h-1 bg-indigo-500 rounded-2xl flex-1"></div>
              <div className="h-1 bg-indigo-500 rounded-2xl flex-1"></div>
              <div className="h-1 flex-1 relative">
                <div className="absolute left-0 top-0 rounded-2xl h-full w-1/2 bg-indigo-500"></div>
                <div className="absolute right-0 border rounded-2xl top-0 h-full w-1/2 bg-white"></div>
              </div>
              <div className="h-1 bg-white flex-1 border rounded-2xl border-gray-200"></div>
            </div>
          </div>

          {/* {Calender Section} */}
          <Calendar
            onDateSelect={handleDateSelect}
            onRangeSelect={handleRangeSelect}
            ref={calendarRef}
            initialDateRanges={dateRanges}
          />
        </div>
      </div>
      {/* {Button section}*/}
      <div className="flex flex-row justify-center gap-4 sm:gap-5 px-4 max-w-2xl mx-auto">
        <Button
          variant="outline"
          className={`py-1 sm:py-7 px-25 sm:px-15 text-xs sm:text-lg font-medium sm:font-semibold rounded-xl sm:rounded-2xl flex-1 sm:w-auto cursor-pointer ${poppins.className}`}
          onClick={handleAddDateLog}
          disabled={!currentSelection}
        >
          Add date log
        </Button>
        <Button
          className={`py-1 sm:py-7 px-25 sm:px-15 text-xs sm:text-lg font-medium sm:font-semibold bg-indigo-500 hover:bg-indigo-600 rounded-xl sm:rounded-2xl flex-1 sm:w-auto cursor-pointer ${poppins.className}`}
          onClick={handleSave}
          disabled={loading || dateRanges.length === 0}
        >
          <div className="flex justify-center items-center gap-1 sm:gap-3">
            {loading ? (
              <Loader2 className="animate-spin sm:size-6" />
            ) : (
              <>
                <span>Next</span>
                <ArrowRight size={14} className="sm:size-6" />
              </>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}

export default Availability;
