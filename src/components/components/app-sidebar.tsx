import * as React from "react";
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
  UserCog,
  ShoppingBasket,
  Group,
  LocateFixed,
  Bike,
} from "lucide-react";
import { NavMain } from "@components/components/nav-main";
import { NavProjects } from "@components/components/nav-projects";
import { NavUser } from "@components/components/nav-user";
import { TeamSwitcher } from "@components/components/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@components/components/ui/sidebar";

import { config } from "../../../config.js";
console.log(config.APP_URL);

const data = {
  user: {
    name: "Divyam",
    email: "__",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Divyam",
      logo: GalleryVerticalEnd,
      plan: "Pvt Ltd",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Home",
          url: `${config?.APP_URL}/dashboard`,
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "All",
          url: `${config?.APP_URL}/dashboard/orders`,
        },
        {
          title: "New",
          url: `${config?.APP_URL}/dashboard/new-orders`,
        },
        {
          title: "Pending",
          url: `${config?.APP_URL}/dashboard/order-pending`,
        },
        {
          title: "Completed",
          url: `${config?.APP_URL}/dashboard/order-complete`,
        },
        {
          title: "Cancellation Request",
          url: `${config?.APP_URL}/dashboard/order-cancelled`,
        },
        {
          title: "Refunded",
          url: `${config?.APP_URL}/dashboard/order-refunded`,
        },
      ],
    },
    {
      title: "Packages",
      url: `${config?.APP_URL}/dashboard/package"`,
      icon: Group,
      items: [
        {
          title: "Packages",
          url: `${config?.APP_URL}/dashboard/package`,
        },
        {
          title: "Add New Packages",
          url: `${config?.APP_URL}/dashboard/add-new-package`,
        },
      ],
    },

    {
      title: "Delivery Areas",
      url: `${config?.APP_URL}/dashboard/delivery-areas`,
      icon: LocateFixed,
      items: [
        {
          title: "All Address List",
          url: `${config?.APP_URL}/dashboard/delivery-area-lists`,
        },
        {
          title: "Add New Address ",
          url: `${config?.APP_URL}/dashboard/add-new-area`,
        },
      ],
    },

    {
      title: "Users",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All",
          url: `${config?.APP_URL}/dashboard/users`,
        },
        {
          title: "Verified",
          url: `${config?.APP_URL}/dashboard/verified-users`,
        },
      ],
    },

    {
      title: "Employee",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "Employee",
          url: `${config?.APP_URL}/dashboard/employee`,
        },
        {
          title: "New Employee",
          url: `${config?.APP_URL}/dashboard/new-employee`,
        },
      ],
    },

    {
      title: "Delivery Agents",
      url: "#",
      icon: Bike,
      items: [
        {
          title: "Delivery Agents",
          url: `${config?.APP_URL}/dashboard/delivery-agents`,
        },
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: `${config?.APP_URL}/dashboard/setting/general`,
        },
      ],
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
