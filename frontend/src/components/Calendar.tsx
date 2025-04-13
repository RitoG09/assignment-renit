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
  isToday,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  isSameDay,
  differenceInDays,
} from "date-fns";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

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

  const handleDateClick = (day: Date) => {
    if (!isSelectingRange) {
      // Start selecting range
      setSelectedFirstDate(day);
      setSelectedLastDate(null);
      setIsSelectingRange(true);
    } else {
      // Complete range selection
      let start = selectedFirstDate!;
      let end = day;

      // Ensure first date is before last date
      if (isBefore(day, selectedFirstDate!)) {
        end = selectedFirstDate!;
        start = day;
      }

      setSelectedLastDate(end);
      setIsSelectingRange(false);

      // Add the new date range
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

  // Check if a date is within any of the selected ranges
  // const isDateInRange = (day: Date) => {
  //   if (isSelectingRange && selectedFirstDate) {
  //     if (isSameDay(day, selectedFirstDate)) return true;
  //   }

  //   // Check temporary complete selection
  //   if (selectedFirstDate && selectedLastDate) {
  //     if (
  //       isSameDay(day, selectedFirstDate) ||
  //       isSameDay(day, selectedLastDate) ||
  //       (isAfter(day, selectedFirstDate) && isBefore(day, selectedLastDate))
  //     ) {
  //       return true;
  //     }
  //   }

  //   // Check saved ranges
  //   return dateRanges.some(
  //     (range) =>
  //       isSameDay(day, range.startDate) ||
  //       isSameDay(day, range.endDate) ||
  //       (isAfter(day, range.startDate) && isBefore(day, range.endDate))
  //   );
  // };

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
      <div className="flex justify-between items-center mb-4 border-b-2">
        <Button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          variant="ghost"
          size="lg"
          className="cursor-pointer"
        >
          <ArrowLeft />
        </Button>
        <h2 className="text-2xl font-medium text-gray-500">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          variant="ghost"
          size="lg"
          className="cursor-pointer"
        >
          <ArrowRight />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center font-medium text-sm py-2 text-gray-700"
          >
            {day}
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
      <div className="grid grid-cols-7 gap-2">
        {dateRange.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isStartDate =
            (selectedFirstDate && isSameDay(day, selectedFirstDate)) ||
            dateRanges.some((range) => isSameDay(day, range.startDate));
          const isEndDate =
            (selectedLastDate && isSameDay(day, selectedLastDate)) ||
            dateRanges.some((range) => isSameDay(day, range.endDate));

          // Styling part of calender date
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
                p-2 text-center cursor-pointer size-12 rounded-full
                ${!isCurrentMonth ? "text-gray-400" : ""}
                ${bgColorClass}
                ${!bgColorClass ? "hover:bg-gray-100" : ""}
              `}
              onClick={() => handleDateClick(day)}
            >
              <div>{format(day, "d")}</div>
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
        <div className="text-gray-500 text-center mt-4">
          No unavailable dates selected yet
        </div>
      );
    }

    return (
      <div className="mt-2">
        <h2 className="text-xl font-semibold mt-1 mb-1 text-center">
          The product will be unavailable for {totalDays} Days
        </h2>
        <ul className="space-y-2">
          {dateRanges.map((range, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
            >
              <span className="text-sm">
                {format(range.startDate, "MMM d")} -{" "}
                {format(range.endDate, "MMM d")},{" "}
                {format(range.startDate, "yyyy")}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => removeRange(index)}
              >
                <X size={20} />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 rounded-3xl pt-6 pb-6 pr-10 pl-10">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      <div className="container mx-auto py-8">
        {isSelectingRange && selectedFirstDate ? (
          <div className="mt-4 text-sm text-center text-blue-500">
            Select end date to complete the range
          </div>
        ) : null}
        {renderUnavailabilityList()}
      </div>
    </div>
  );
};

export default Calendar;
