"use client";

import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  isSameDay,
  differenceInDays,
} from "date-fns";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import toast from "react-hot-toast";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface CalendarProps {
  onDateSelect?: (dateRanges: DateRange[]) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFirstDate, setSelectedFirstDate] = useState<Date | null>(null);
  const [selectedLastDate, setSelectedLastDate] = useState<Date | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);

  // Dates blocking mech
  const isRangeOverlap = (
    startA: Date,
    endA: Date,
    startB: Date,
    endB: Date
  ) => {
    return (
      isSameDay(startA, startB) ||
      isSameDay(endA, endB) ||
      (isBefore(startA, endB) && isAfter(endA, startB)) ||
      (isBefore(startB, endA) && isAfter(endB, startA)) ||
      isSameDay(startA, endB) ||
      isSameDay(endA, startB) ||
      isSameDay(startA, endB) ||
      isSameDay(endA, startB)
    );
  };

  const handleDateClick = (day: Date) => {
    if (!isSelectingRange) {
      setSelectedFirstDate(day);
      setSelectedLastDate(null);
      setIsSelectingRange(true);
    } else {
      let start = selectedFirstDate!;
      let end = day;
      if (isBefore(day, selectedFirstDate!)) {
        end = selectedFirstDate!;
        start = day;
      }

      const overlap = dateRanges.some((range) =>
        isRangeOverlap(start, end, range.startDate, range.endDate)
      );
      if (overlap) {
        toast.error("Product is unavailable for these dates");
        setIsSelectingRange(false);
        setSelectedFirstDate(null);
        setSelectedLastDate(null);
        return;
      }

      setSelectedLastDate(end);
      setIsSelectingRange(false);
      const newRange = { startDate: start, endDate: end };
      const updatedRanges = [...dateRanges, newRange];
      setDateRanges(updatedRanges);
      if (onDateSelect) {
        onDateSelect(updatedRanges);
      }
    }
  };

  const removeRange = (index: number) => {
    const updatedRanges = dateRanges.filter((_, i) => i !== index);
    setDateRanges(updatedRanges);

    setSelectedFirstDate(null);
    setSelectedLastDate(null);
    setIsSelectingRange(false);

    if (onDateSelect) {
      onDateSelect(updatedRanges);
    }
  };

  // Check if a date is an intermediate date (not first or last)
  const isIntermediateDate = (day: Date) => {
    if (selectedFirstDate && selectedLastDate) {
      if (isAfter(day, selectedFirstDate) && isBefore(day, selectedLastDate)) {
        return true;
      }
    }

    // Check saved ranges
    return dateRanges.some(
      (range) => isAfter(day, range.startDate) && isBefore(day, range.endDate)
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-2 sm:mb-4 border-b-2">
        <Button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          variant="ghost"
          size="sm"
          className="
            py-5 px-8 text-lg
            md:py-3 md:px-6 md:text-base
            cursor-pointer sm:size-lg
          "
        >
          <ArrowLeft size={18} className="sm:size-5" />
        </Button>
        <h2 className="text-lg sm:text-2xl font-medium text-gray-500">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          variant="ghost"
          size="sm"
          className="
            py-5 px-8 text-lg
            md:py-3 md:px-6 md:text-base
            cursor-pointer sm:size-lg
          "
        >
          <ArrowRight size={18} className="sm:size-5" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const shortDays = ["M", "T", "W", "T", "F", "S", "S"];

    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
        {days.map((day, index) => (
          <div
            key={day}
            className="text-center font-medium text-xs sm:text-sm py-1 sm:py-2 text-gray-700"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{shortDays[index]}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateRange = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {dateRange.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isStartDate =
            (selectedFirstDate && isSameDay(day, selectedFirstDate)) ||
            dateRanges.some((range) => isSameDay(day, range.startDate));
          const isEndDate =
            (selectedLastDate && isSameDay(day, selectedLastDate)) ||
            dateRanges.some((range) => isSameDay(day, range.endDate));

          let bgColorClass = "";
          if (isStartDate || isEndDate) {
            bgColorClass = "bg-red-500 text-white";
          } else if (isIntermediateDate(day)) {
            bgColorClass = "bg-red-200";
          }

          return (
            <div
              key={idx}
              className={`
                flex items-center justify-center
                cursor-pointer rounded-full
                min-w-8 min-h-8 w-full pb-[100%] relative
                ${!isCurrentMonth ? "text-gray-400" : ""}
                ${bgColorClass}
                ${!bgColorClass ? "hover:bg-gray-100" : ""}
              `}
              onClick={() => handleDateClick(day)}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm">
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const calculateTotalUnavailableDays = (): number => {
    return dateRanges.reduce((total, range) => {
      const daysInRange = differenceInDays(range.endDate, range.startDate) + 1;
      return total + daysInRange;
    }, 0);
  };

  const totalDays = calculateTotalUnavailableDays();

  const renderUnavailabilityList = () => {
    if (dateRanges.length === 0) {
      return (
        <div className="text-gray-500 text-center mt-2 sm:mt-4 text-sm sm:text-base">
          No unavailable dates selected yet
        </div>
      );
    }

    return (
      <div className="mt-2 sm:mt-4">
        <h2 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-center">
          The product will be unavailable for {totalDays} Days
        </h2>
        <ul className="space-y-1 sm:space-y-2">
          {dateRanges.map((range, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-1 sm:p-2 bg-gray-100 rounded-lg text-xs sm:text-sm"
            >
              <span>
                {format(range.startDate, "MMM d")} -{" "}
                {format(range.endDate, "MMM d")},{" "}
                {format(range.startDate, "yyyy")}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="py-5 px-8 text-lg md:py-3 md:px-6 md:text-base h-6 w-6 p-0 min-w-6 min-h-6"
                onClick={() => removeRange(index)}
              >
                <X className="w-5 h-5 sm:w-10 sm:h-10" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="w-full px-2 sm:px-0 sm:max-w-md mx-auto">
      <div className="border-2 rounded-xl sm:rounded-3xl p-3 sm:p-6 md:pt-6 md:pb-6 md:pr-10 md:pl-10">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      <div className="px-2 sm:container mx-auto py-4 sm:py-8">
        {isSelectingRange && selectedFirstDate ? (
          <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-center text-blue-500">
            Select end date to complete the range
          </div>
        ) : null}
        {renderUnavailabilityList()}
      </div>
    </div>
  );
};

export default Calendar;
