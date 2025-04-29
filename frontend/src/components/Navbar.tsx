"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusSquare,
  User,
  Heart,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when escape key is pressed
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const navItems = [
    { name: "Home", icon: <Home size={24} />, href: "/" },
    { name: "Saved", icon: <Heart size={24} />, href: "/saved" },
    { name: "Post", icon: <PlusSquare size={24} />, href: "/post" },
    { name: "Chat", icon: <MessageSquare size={24} />, href: "/chat" },
    { name: "Profile", icon: <User size={24} />, href: "/profile" },
  ];

  // Prevent content flash before hydration
  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-md shadow-md text-indigo-600 hover:text-indigo-800 transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm h-14 flex items-center justify-center md:hidden z-20">
        <Link href="/">
          <h1 className="text-xl font-bold text-indigo-600">Calendar</h1>
        </Link>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar for both mobile and desktop */}
      <div
        className={`fixed h-screen bg-white shadow-md z-20 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "left-0" : "-left-full md:left-0"
        } top-0 w-64`}
      >
        <div className="p-6">
          <Link href="/">
            <h1 className="text-2xl font-bold text-indigo-600 mb-8 text-center border-b-2">
              Calendar
            </h1>
          </Link>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center px-6 py-3 cursor-pointer transition-colors ${
                        isActive
                          ? "bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
