"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, User, Heart, MessageSquare } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: <Home size={24} />, href: "/" },
    { name: "Saved", icon: <Heart size={24} />, href: "/saved" },
    { name: "Post", icon: <PlusSquare size={24} />, href: "/post" },
    { name: "Chat", icon: <MessageSquare size={24} />, href: "/chat" },
    { name: "Profile", icon: <User size={24} />, href: "/profile" },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-md fixed left-0 top-0 z-10">
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
  );
};

export default Navbar;
