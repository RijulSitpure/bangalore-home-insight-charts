
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: "blue" | "green" | "red" | "amber" | "indigo";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  color = "blue"
}) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700"
  };

  const trendColorMap = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div 
            className={cn(
              "p-2 rounded-md",
              colorMap[color]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div 
            className={cn(
              "flex items-center text-sm font-medium",
              trendColorMap[trend]
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4 mr-1" />
            ) : null}
            <span>{description}</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
