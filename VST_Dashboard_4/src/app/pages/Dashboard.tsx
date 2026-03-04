import { useState } from "react";
import { Button } from "../components/ui/button";
import { Calendar, RefreshCw, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import VarianceTable from "../components/VarianceTable";
import BillOfMaterial from "../components/BillOfMaterial";
import BillOfMaterialsPrice from "../components/BillOfMaterialsPrice";
import {
  varianceDataItem1,
  varianceDataItem2,
  varianceDataItem3,
  varianceDataItem4,
  varianceDataItem5,
} from "../data/mockData";
import { bomDataItem1, bomDataItem2, bomDataItem3, bomDataItem4, bomDataItem5 } from "../data/bomData";
import {
  billOfMaterialsPriceItem1,
  billOfMaterialsPriceItem2,
} from "../data/billOfMaterialsData";
import { useCategory } from "../context/CategoryContext";
import { useData } from "../context/DataContext";
import { items } from "../data/items";

export default function Dashboard() {
  const { selectedCategory } = useCategory();
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 24)); // Feb 24, 2026
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    customDataMap,
    exportData,
    clearData,
    updateCustomDataMapForCategory
  } = useData();

  const currentItemCode = (() => {
    switch (selectedCategory) {
      case 'axel-gear': return "ACA11C00210A0";
      case 'fly-wheel': return "ACA01C00440A0";
      case 'final-drive': return "ACA11C00230A1";
      case 'gear-case': return "ACA01C00430A0";
      case 'shaft-final': return "TRA90C32520A1";
      default: return "ACA11C00210A0";
    }
  })();

  const getDashboardData = () => {
    if (customDataMap && customDataMap[currentItemCode]) {
      const itemInfo = items.find(i => i.itemCode === currentItemCode);
      return {
        name: itemInfo?.itemName || "Imported Item",
        variance: customDataMap[currentItemCode],
        bom: bomDataItem1,
        price: billOfMaterialsPriceItem1
      };
    }

    switch (selectedCategory) {
      case 'fly-wheel':
        return {
          name: "FLY WHEEL",
          variance: varianceDataItem2,
          bom: bomDataItem2,
          price: billOfMaterialsPriceItem2
        };
      case 'final-drive':
        return {
          name: "Final Drive Gear",
          variance: varianceDataItem3,
          bom: bomDataItem3,
          price: billOfMaterialsPriceItem1
        };
      case 'gear-case':
        return {
          name: "GEAR CASE",
          variance: varianceDataItem4,
          bom: bomDataItem4,
          price: billOfMaterialsPriceItem2
        };
      case 'shaft-final':
        return {
          name: "Shaft Final",
          variance: varianceDataItem5,
          bom: bomDataItem5,
          price: billOfMaterialsPriceItem1
        };
      case 'axel-gear':
      default:
        return {
          name: "AXEL GEAR CT85",
          variance: varianceDataItem1,
          bom: bomDataItem1,
          price: billOfMaterialsPriceItem1
        };
    }
  };

  const currentData = getDashboardData();

  const handleRefresh = () => {
    setIsRefreshing(true);
    clearData();
    toast.loading("Refreshing dashboard data...");

    setTimeout(() => {
      setIsRefreshing(false);
      toast.dismiss();
      toast.success("Dashboard refreshed successfully!");
    }, 1500);
  };

  const handleExport = () => {
    exportData(currentData.variance, currentData.name);
  };

  const formatDate = () => {
    if (!date) return "Select date";
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 uppercase text-xs tracking-widest font-bold">
            <span className="text-[#006847]">{currentData.name}</span> • SOB Metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 border-gray-200 hover:bg-gray-50 text-gray-700"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 text-blue-600" />
            Export
          </Button>

          <div className="w-px h-8 bg-gray-200 mx-1 hidden sm:block"></div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-start flex-1 sm:flex-none">
                <Calendar className="w-4 h-4 text-gray-500" />
                {formatDate()}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  if (date) {
                    toast.success(`Date updated: ${format(date, 'MMM d, yyyy')}`);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-500 hover:text-[#006847] hover:bg-green-50"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <VarianceTable
          data={currentData.variance}
          onDataUpdate={(updated) => {
            updateCustomDataMapForCategory(currentItemCode, updated);
          }}
          itemName={currentData.name}
        />
        <BillOfMaterial data={currentData.bom} onDataUpdate={() => { }} itemName={currentData.name} />
        <BillOfMaterialsPrice
          data={currentData.price}
          onDataUpdate={() => { }}
          itemName={currentData.name}
        />
      </div>
    </div>
  );
}