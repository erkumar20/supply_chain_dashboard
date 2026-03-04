import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { BOMItem } from "../data/bomData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface BillOfMaterialProps {
  data: BOMItem[];
  itemName: string;
  onDataUpdate?: (data: BOMItem[]) => void;
}

export default function BillOfMaterial({ data, itemName }: BillOfMaterialProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            Available
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
            Low Stock
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            Critical
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Calculate total cost
  const totalBOMCost = data.reduce((sum, item) => sum + item.totalCost, 0);

  // Prepare data for cost breakdown chart
  const costBreakdownData = data.map((item) => ({
    name: item.componentName,
    cost: item.totalCost,
    percentage: ((item.totalCost / totalBOMCost) * 100).toFixed(1),
  }));

  // Prepare data for pie chart
  const COLORS = ["#006847", "#FFB800", "#00A86B", "#FF6B6B", "#4ECDC4"];

  return (
    null
  );
}