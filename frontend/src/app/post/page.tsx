"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function PostPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/availability">
        <Button className="py-6 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
          Update Availability
        </Button>
      </Link>
    </div>
  );
}
