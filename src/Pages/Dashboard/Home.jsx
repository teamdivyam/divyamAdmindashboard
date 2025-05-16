import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/components/ui/chart";
import React from "react";

// Chart data
const chartData = [
  { month: "January", order: 186, user: 102 },
  { month: "February", order: 305, user: 99 },
  { month: "March", order: 237, user: 201 },
  { month: "April", order: 73, user: 71 },
  { month: "May", order: 209, user: 35 },
  { month: "June", order: 214, user: 47 },
];

// Chart configuration
const chartConfig = {
  order: {
    label: "order",
    color: "hsl(var(--chart-1))",
  },
  user: {
    label: "user",
    color: "hsl(var(--chart-2))",
  },
};

const DashBoardIndexPage = () => {
  // RESET_STORE

  return (
    <div className="homePage_Wrapper  mx-4">
      <Card className="">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} width={600} height={300}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)} // Shorten month names
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="order" fill={chartConfig.order.color} radius={4} />
              <Bar dataKey="user" fill={chartConfig.user.color} radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total Order and new users for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashBoardIndexPage;
