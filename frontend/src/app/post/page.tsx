"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate navigation delay
    setTimeout(() => {
      router.push("/availability");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/availability">
        <Button
          className="py-6 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center gap-2"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Loading...
            </>
          ) : (
            "Update Availability"
          )}
        </Button>
      </Link>
    </div>
  );
}
