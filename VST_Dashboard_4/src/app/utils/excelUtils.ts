import * as XLSX from 'xlsx';
import type { VarianceData } from '../data/mockData';

/**
 * Mapping configuration for SOB sheet
 */
export const SOB_MAPPING = {
    supplier: "Vendor's account number",
    plannedAllocation: "Quota",
    itemCode: "Material",
    itemName: "Material Number",
};

/**
 * Mapping configuration for GRN sheet
 */
export const GRN_MAPPING = {
    supplier: "SUPPLIER NAME",
    actualQuantity: "RECEIVED QTY",
    plannedPrice: "PO PRICE",
    itemCode: "MATERIAL NO",
    itemName: "MATERIAL DESC",
};

/**
 * Export data to Excel
 */
export const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Parse Excel file and map to internal data structure
 */
export const parseExcelAndMap = async (file: File): Promise<{
    sob: any[];
    grn: any[];
}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const result: any = { sob: [], grn: [] };

                workbook.SheetNames.forEach(name => {
                    const lowerName = name.toLowerCase().trim();
                    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[name]);

                    if (lowerName.includes('sob')) {
                        result.sob = sheetData;
                    } else if (lowerName.includes('grn')) {
                        result.grn = sheetData;
                    } else if (workbook.SheetNames.length === 1) {
                        // If it's a single sheet (like a CSV), try to detect if it's SOB or GRN by columns
                        const firstRow: any = sheetData[0];
                        if (firstRow && (firstRow[SOB_MAPPING.itemCode] || firstRow["Quota"])) {
                            result.sob = sheetData;
                        } else if (firstRow && (firstRow[GRN_MAPPING.itemCode] || firstRow["RECEIVED QTY"])) {
                            result.grn = sheetData;
                        } else {
                            // Fallback if autodetection fails for single sheet
                            result.sob = sheetData;
                        }
                    }
                });

                resolve(result);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Process raw sheet data into a map grouped by Material Code
 */
export const mapToVarianceDataGroups = (sobData: any[], grnData: any[]): Record<string, VarianceData[]> => {
    const result: Record<string, VarianceData[]> = {};

    // Find all unique material codes in the SOB sheet
    const materialCodes = Array.from(new Set(sobData.map(row => row[SOB_MAPPING.itemCode]?.toString().trim())));

    materialCodes.forEach(materialCode => {
        if (!materialCode) return;

        // Filter SOB rows for this specific material
        const materialSobRows = sobData.filter(row => row[SOB_MAPPING.itemCode]?.toString().trim() === materialCode);

        // Filter GRN rows for this specific material
        const materialGrnRows = grnData.filter(row => row[GRN_MAPPING.itemCode]?.toString().trim() === materialCode);

        // Group GRN data for this material by supplier
        const actualsMap = materialGrnRows.reduce((acc: any, row: any) => {
            const supplier = row[GRN_MAPPING.supplier];
            if (!acc[supplier]) {
                acc[supplier] = { quantity: 0, price: 0, count: 0 };
            }
            acc[supplier].quantity += Number(row[GRN_MAPPING.actualQuantity]) || 0;
            acc[supplier].price += Number(row[GRN_MAPPING.plannedPrice]) || 0;
            acc[supplier].count += 1;
            return acc;
        }, {});

        // Calculate total quantity received for this material to determine actual %
        const totalActualQuantity = Object.values(actualsMap).reduce((sum: number, s: any) => sum + s.quantity, 0);

        // Map SOB rows to VarianceData
        result[materialCode] = materialSobRows.map((row: any, index: number) => {
            const supplier = row[SOB_MAPPING.supplier];
            const plannedAllocation = Number(row[SOB_MAPPING.plannedAllocation]) || 0;
            const actual = actualsMap[supplier] || { quantity: 0, price: 0, count: 0 };

            const actualQuantity = actual.quantity;
            const actualAllocation = totalActualQuantity > 0
                ? Math.round((actualQuantity / totalActualQuantity) * 100)
                : 0;

            const avgPrice = actual.count > 0 ? (actual.price / actual.count) : (Number(row[GRN_MAPPING.plannedPrice]) || 0);

            return {
                id: `${materialCode}-${index + 1}`,
                supplier: supplier,
                plannedAllocation,
                plannedQuantity: 0, // Will be calculated by UI or total expectations
                plannedPrice: Number(avgPrice.toFixed(2)),
                actualAllocation,
                actualQuantity,
                actualPrice: Number(avgPrice.toFixed(2)),
                variance: plannedAllocation - actualAllocation,
                status: Math.abs(plannedAllocation - actualAllocation) > 10 ? 'high' : Math.abs(plannedAllocation - actualAllocation) > 5 ? 'medium' : 'low',
            };
        });
    });

    return result;
};
