import React, { createContext, useContext, useState, useRef } from 'react';
import { toast } from 'sonner';
import { type VarianceData } from '../data/mockData';
import { parseExcelAndMap, mapToVarianceDataGroups, exportToExcel } from '../utils/excelUtils';
import { format } from 'date-fns';

interface DataContextType {
    customDataMap: Record<string, VarianceData[]> | null;
    pendingDataMap: Record<string, VarianceData[]> | null;
    importFileName: string;
    isReviewOpen: boolean;
    setIsReviewOpen: (open: boolean) => void;
    handleImport: (file: File) => Promise<void>;
    confirmImport: () => void;
    clearData: () => void;
    exportData: (data: VarianceData[], name: string) => void;
    updateCustomDataMapForCategory: (category: string, data: VarianceData[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customDataMap, setCustomDataMap] = useState<Record<string, VarianceData[]> | null>(null);
    const [pendingDataMap, setPendingDataMap] = useState<Record<string, VarianceData[]> | null>(null);
    const [importFileName, setImportFileName] = useState("");
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const handleImport = async (file: File) => {
        try {
            toast.loading("Reading excel file...");
            const { sob, grn } = await parseExcelAndMap(file);
            const mappedGroups = mapToVarianceDataGroups(sob, grn);

            setPendingDataMap(mappedGroups);
            setImportFileName(file.name);
            setIsReviewOpen(true);

            // Also upload to backend to sync AI Assistant
            const formData = new FormData();
            formData.append('file', file);

            fetch('http://127.0.0.1:8001/api/upload-dataset', {
                method: 'POST',
                body: formData,
            }).then(res => {
                if (res.ok) console.log("Backend dataset synced");
            }).catch(err => console.error("Backend sync failed", err));

            toast.dismiss();
            toast.success("File parsed successfully. Review your data.");
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to parse excel file.");
            console.error(error);
        }
    };

    const confirmImport = () => {
        if (pendingDataMap) {
            setCustomDataMap(pendingDataMap);
            setIsReviewOpen(false);
            toast.success("Data applied successfully!");
        }
    };

    const clearData = () => {
        setCustomDataMap(null);
        setPendingDataMap(null);
        setImportFileName("");
        toast.success("Data reset to defaults.");
    };

    const exportData = (data: VarianceData[], name: string) => {
        exportToExcel(data, `SOB_Deviation_${name}_${format(new Date(), 'yyyy-MM-dd')}`);
        toast.success("Export started...");
    };

    const updateCustomDataMapForCategory = (category: string, data: VarianceData[]) => {
        if (customDataMap) {
            setCustomDataMap({ ...customDataMap, [category]: data });
        }
    };

    return (
        <DataContext.Provider value={{
            customDataMap,
            pendingDataMap,
            importFileName,
            isReviewOpen,
            setIsReviewOpen,
            handleImport,
            confirmImport,
            clearData,
            exportData,
            updateCustomDataMapForCategory
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
