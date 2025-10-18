"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import SearchDrawer from "@/shared-components/SearchDrawer";
import { ChevronDown, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { logout } = useAuth();
  const { email } = useSelector((state) => state.auth);

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return (
    <nav>
      <div className="border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <span className="text-primary text-sm font-medium">
            Just launched the product managment app.{" "}
            <span className="underline">Learn more</span>
          </span>
          <div>
            <ul className="flex items-center gap-5">
              <li>
                <span className="text-sm font-medium cursor-pointer inline-block">
                  Sign up
                </span>
              </li>
              <li>
                <span className="text-sm font-medium cursor-pointer inline-block">
                  Join us
                </span>
              </li>
              <li>
                <span className="text-sm font-medium cursor-pointer inline-flex items-center gap-1">
                  Help <ChevronDown size={10} />{" "}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* logo */}
            <div className="border-x px-3">
              <div className="size-10">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={1000}
                  height={1000}
                  className="size-10 cursor-pointer w-max"
                />
              </div>
            </div>
            {/* category */}
            <div>
              <ul className="flex items-center">
                {categories?.map((category) => (
                  <li key={category.id}>
                    <Button variant="link" className="cursor-pointer">
                      {category.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            {/* search and user */}
            <div className="border-x flex items-center gap-4 px-4">
              <SearchDrawer />
              {/* divider */}
              <div className="w-px h-10 border-r" />

              <p className="cursor-pointer inline-block">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <User size={25} className="text-gray-700" />
                  </HoverCardTrigger>
                  <HoverCardContent className="min-w-96 w-max">
                    <div className="flex flex-col items-center justify-center">
                      <div className="border rounded-full mb-2">
                        <User size={80} className="m-3" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-gray-400 leading-4">
                          Email
                        </span>
                        <h4 className="text-lg font-semibold text-center mb-10 leading-5">
                          {email}
                        </h4>
                      </div>
                      <Button
                        className="w-full"
                        onClick={logout}
                        variant="outline"
                      >
                        <LogOut />
                        Logout
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
