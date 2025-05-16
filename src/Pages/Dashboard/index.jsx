import { AppSidebar } from "@components/components/app-sidebar";
import { NavLink, Outlet } from "react-router-dom";
import { UserRound, Settings, LogOut } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@components/components/ui/breadcrumb";
import { Separator } from "@components/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@components/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui//dropdown-menu";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";

export default function DashBoardLayout() {
  const theme = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            {/* icon for Sidebar Toggel.. */}
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                {/* <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="adminProfile pr-8 cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className="bg-neutral-200 p-2 rounded-full text-gray-500 focus-within
                dark:bg-slate-800 dark:text-white
                "
                >
                  <UserRound />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <NavLink to={"/dashboard/admin"} className="w-full">
                    <span className="flex items-center justify-start gap-2">
                      <UserRound className="size-4 " />
                      <span className="">Profile</span>
                    </span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to="setting/general" className="w-full">
                    <span className="flex items-center justify-start gap-2">
                      <Settings className="size-4 " />
                      <span className="">Setting</span>
                    </span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to="/dashboard/logout" className="w-full">
                    <span className="flex items-center justify-start gap-2">
                      <LogOut className="size-4 " />
                      <span className="">Logout</span>
                    </span>
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
