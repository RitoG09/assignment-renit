"use client";

import React, { useEffect, useState } from "react";

export default function SavedPage() {
  const [savedDates, setSavedDates] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedDates = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/availability");

        if (!res.ok) {
          throw new Error("Failed to fetch saved dates");
        }

        const data = await res.json();
        setSavedDates(data.availabilities.map((item: any) => item.dates));
      } catch (err) {
        console.error("Error fetching saved dates:", err);
        setError("Failed to load saved dates");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDates();
  }, []);

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-2xl w-full mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Saved Unavailability Dates
        </h1>

        {loading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading saved dates...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600 mb-6">
            {error}
          </div>
        ) : savedDates.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-md text-center">
            <p className="text-gray-500">
              No unavailability dates have been saved yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {savedDates.map((dateGroup, index) => (
              <div key={index} className="bg-white rounded-lg shadow-xl p-4">
                <h3 className="font-sans text-lg mb-3 text-center text-indigo-700">
                  Unavailability Set {savedDates.length - index}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 ">
                  {dateGroup.map((date, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 py-2 px-3 rounded-md text-sm"
                    >
                      {date}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
