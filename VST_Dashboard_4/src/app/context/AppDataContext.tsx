import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
    invoiceData,
    InvoiceData,
    varianceDataItem1,
    varianceDataItem2,
    VarianceData
} from "../data/mockData";
import { items as initialItems, Item } from "../data/items";
import { bomDataItem1, bomDataItem2, BOMItem } from "../data/bomData";
import {
    billOfMaterialsPriceItem1,
    billOfMaterialsPriceItem2,
    BillOfMaterialsPriceItem
} from "../data/billOfMaterialsData";
import { toast } from "sonner";

export interface Supplier {
    id: string;
    name: string;
    itemName: string;
    contact: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
}

const initialSuppliers: Supplier[] = [
    { id: "1", name: "ABC Components Ltd", itemName: "Item 1", contact: "John Smith", email: "john@abccomponents.com", phone: "+91 98765 43210", status: "active" },
    { id: "2", name: "XYZ Parts Co", itemName: "Item 1", contact: "Sarah Johnson", email: "sarah@xyzparts.com", phone: "+91 98765 43211", status: "active" },
    { id: "3", name: "DEF Manufacturing", itemName: "Item 1", contact: "Mike Wilson", email: "mike@defmfg.com", phone: "+91 98765 43212", status: "active" },
    { id: "4", name: "GHI Suppliers", itemName: "Item 2", contact: "Emily Brown", email: "emily@ghisuppliers.com", phone: "+91 98765 43213", status: "active" },
    { id: "5", name: "JKL Industries", itemName: "Item 2", contact: "David Lee", email: "david@jklindustries.com", phone: "+91 98765 43214", status: "inactive" },
];

interface AppDataContextType {
    invoices: InvoiceData[];
    setInvoices: (data: InvoiceData[]) => void;
    items: Item[];
    setItems: (data: Item[]) => void;
    suppliers: Supplier[];
    setSuppliers: (data: Supplier[]) => void;

    item1Variance: VarianceData[];
    setItem1Variance: (data: VarianceData[]) => void;
    item2Variance: VarianceData[];
    setItem2Variance: (data: VarianceData[]) => void;

    item1Bom: BOMItem[];
    setItem1Bom: (data: BOMItem[]) => void;
    item2Bom: BOMItem[];
    setItem2Bom: (data: BOMItem[]) => void;

    item1Price: BillOfMaterialsPriceItem[];
    setItem1Price: (data: BillOfMaterialsPriceItem[]) => void;
    item2Price: BillOfMaterialsPriceItem[];
    setItem2Price: (data: BillOfMaterialsPriceItem[]) => void;

    resetAllData: () => void;
    syncVariancesFromInvoices: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const getStored = (key: string, fallback: any) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    };

    const [invoices, setInvoices] = useState<InvoiceData[]>(() => getStored("vst_invoices", invoiceData));
    const [items, setItems] = useState<Item[]>(() => getStored("vst_items", initialItems));
    const [suppliers, setSuppliers] = useState<Supplier[]>(() => getStored("vst_suppliers", initialSuppliers));

    const [item1Variance, setItem1Variance] = useState<VarianceData[]>(() => getStored("vst_item1_variance", varianceDataItem1));
    const [item2Variance, setItem2Variance] = useState<VarianceData[]>(() => getStored("vst_item2_variance", varianceDataItem2));

    const [item1Bom, setItem1Bom] = useState<BOMItem[]>(() => getStored("vst_item1_bom", bomDataItem1));
    const [item2Bom, setItem2Bom] = useState<BOMItem[]>(() => getStored("vst_item2_bom", bomDataItem2));

    const [item1Price, setItem1Price] = useState<BillOfMaterialsPriceItem[]>(() => getStored("vst_item1_price", billOfMaterialsPriceItem1));
    const [item2Price, setItem2Price] = useState<BillOfMaterialsPriceItem[]>(() => getStored("vst_item2_price", billOfMaterialsPriceItem2));

    useEffect(() => {
        localStorage.setItem("vst_invoices", JSON.stringify(invoices));
        localStorage.setItem("vst_items", JSON.stringify(items));
        localStorage.setItem("vst_suppliers", JSON.stringify(suppliers));
        localStorage.setItem("vst_item1_variance", JSON.stringify(item1Variance));
        localStorage.setItem("vst_item2_variance", JSON.stringify(item2Variance));
        localStorage.setItem("vst_item1_bom", JSON.stringify(item1Bom));
        localStorage.setItem("vst_item2_bom", JSON.stringify(item2Bom));
        localStorage.setItem("vst_item1_price", JSON.stringify(item1Price));
        localStorage.setItem("vst_item2_price", JSON.stringify(item2Price));
    }, [invoices, items, suppliers, item1Variance, item2Variance, item1Bom, item2Bom, item1Price, item2Price]);

    const syncVariancesFromInvoices = () => {
        const calculateVarianceForMaterial = (materialNo: string, baseVariances: VarianceData[]) => {
            const supplierStats: Record<string, { qty: number, price: number, count: number, plannedQty: number, plannedPrice: number }> = {};

            invoices.filter(inv => inv.materialNo === materialNo).forEach(inv => {
                const sName = inv.supplierName;
                if (!supplierStats[sName]) {
                    supplierStats[sName] = { qty: 0, price: 0, count: 0, plannedQty: 0, plannedPrice: 0 };
                }
                supplierStats[sName].qty += Number(inv.receivedQty || inv.quantityReceived || 0);
                supplierStats[sName].price += Number(inv.actualPrice || 0);
                supplierStats[sName].plannedQty += Number(inv.quantity || inv.expectedQuantity || 0);
                supplierStats[sName].plannedPrice += Number(inv.plannedPrice || inv.poPrice || 0);
                supplierStats[sName].count += 1;
            });

            const totalMaterialQty = Object.values(supplierStats).reduce((sum, s) => sum + s.qty, 0);

            const updatedVariances = baseVariances.map(v => {
                const stats = supplierStats[v.supplier];
                if (!stats) return v;

                const avgActualPrice = stats.price / stats.count;
                const avgPlannedPrice = stats.plannedPrice / stats.count;
                const actualAllocation = totalMaterialQty > 0 ? (stats.qty / totalMaterialQty) * 100 : 0;

                const varianceVal = actualAllocation - v.plannedAllocation;

                return {
                    ...v,
                    actualQuantity: stats.qty,
                    actualPrice: Math.round(avgActualPrice),
                    plannedPrice: Math.round(avgPlannedPrice),
                    actualAllocation: Math.round(actualAllocation),
                    variance: Number(varianceVal.toFixed(1)),
                    status: Math.abs(varianceVal) > 10 ? 'high' : Math.abs(varianceVal) > 5 ? 'medium' : 'low'
                } as VarianceData;
            });

            return updatedVariances;
        };

        const newItem1Variance = calculateVarianceForMaterial('MAT-ENG-001', item1Variance);
        const newItem2Variance = calculateVarianceForMaterial('MAT-HYD-002', item2Variance);

        setItem1Variance(newItem1Variance);
        setItem2Variance(newItem2Variance);
        toast.success("Mathematics synchronized with real Invoice data");
    };

    const resetAllData = () => {
        if (window.confirm("Are you sure you want to reset all data? This will clear all imports.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <AppDataContext.Provider value={{
            invoices, setInvoices,
            items, setItems,
            suppliers, setSuppliers,
            item1Variance, setItem1Variance,
            item2Variance, setItem2Variance,
            item1Bom, setItem1Bom,
            item2Bom, setItem2Bom,
            item1Price, setItem1Price,
            item2Price, setItem2Price,
            resetAllData,
            syncVariancesFromInvoices
        }}>
            {children}
        </AppDataContext.Provider>
    );
}

export function useData() {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
