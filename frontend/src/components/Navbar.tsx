"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, User, Heart, MessageSquare } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = [
    { name: "Home", icon: <Home size={24} />, href: "/" },
    { name: "Saved", icon: <Heart size={24} />, href: "/saved" },
    { name: "Post", icon: <PlusSquare size={24} />, href: "/post" },
    { name: "Chat", icon: <MessageSquare size={24} />, href: "/chat" },
    { name: "Profile", icon: <User size={24} />, href: "/profile" },
  ];

  if (!isMounted) return null;

  return (
    <nav className="flex justify-around items-center h-full">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href}>
            <div
              className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium mt-1">{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
