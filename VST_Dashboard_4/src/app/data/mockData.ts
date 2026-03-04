// Mock data for VST Tractors Dashboard

export interface KPIData {
  label: string;
  value: string;
  change?: string;
  status?: 'success' | 'warning' | 'danger';
}

export interface TrendData {
  date: string;
  planned: number;
  actual: number;
}

export interface VarianceData {
  id: string;
  supplier: string;
  plannedAllocation: number;
  plannedQuantity: number;
  plannedPrice: number;
  actualAllocation: number;
  actualQuantity: number;
  actualPrice: number;
  variance: number;
  status: 'high' | 'medium' | 'low';
  isEditing?: boolean;
}

export interface EmailData {
  id: string;
  subject: string;
  recipient: string;
  date: string;
  status: 'sent' | 'pending' | 'failed';
  item: string;
}

export interface NotificationData {
  id: '1' | '2' | '3' | '4' | '5';
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
}

export interface SupplierDetailData {
  name: string;
  stockoutDays: number;
  onTimeDelivery: number;
  averageDelay: number;
  currentStock: number;
  supplierPerformance: number;
  allocationCompliance: number;
  status: 'high' | 'medium' | 'low';
  contactPerson: string;
  email: string;
  phone: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  date: string;
  quantityReceived: number;
  expectedQuantity: number;
  plannedPrice: number;
  actualPrice: number;
  status: 'received' | 'pending' | 'partial' | 'error';
  batchNumber: string;
  receivedBy: string;
  notes?: string;
}

export const kpiDataItem1: KPIData[] = [
  { label: 'Actual SOB %', value: '78%', change: '-7%', status: 'warning' },
  { label: 'Variance %', value: '-7%', status: 'danger' },
  { label: 'Alerts Active', value: '3', status: 'warning' },
];

export const kpiDataItem2: KPIData[] = [
  { label: 'Actual SOB %', value: '92%', change: '+2%', status: 'success' },
  { label: 'Variance %', value: '+2%', status: 'success' },
  { label: 'Alerts Active', value: '0', status: 'success' },
];

export const trendDataItem1: TrendData[] = [
  { date: '2026-02-16', planned: 85, actual: 72 },
  { date: '2026-02-17', planned: 85, actual: 74 },
  { date: '2026-02-18', planned: 85, actual: 76 },
  { date: '2026-02-19', planned: 85, actual: 75 },
  { date: '2026-02-20', planned: 85, actual: 77 },
  { date: '2026-02-21', planned: 85, actual: 78 },
  { date: '2026-02-22', planned: 85, actual: 78 },
  { date: '2026-02-23', planned: 85, actual: 78 },
];

export const trendDataItem2: TrendData[] = [
  { date: '2026-02-16', planned: 90, actual: 88 },
  { date: '2026-02-17', planned: 90, actual: 89 },
  { date: '2026-02-18', planned: 90, actual: 90 },
  { date: '2026-02-19', planned: 90, actual: 91 },
  { date: '2026-02-20', planned: 90, actual: 92 },
  { date: '2026-02-21', planned: 90, actual: 92 },
  { date: '2026-02-22', planned: 90, actual: 92 },
  { date: '2026-02-23', planned: 90, actual: 92 },
];

export const varianceDataItem1: VarianceData[] = [
  {
    id: '1',
    supplier: 'SANGKAJ TECHNOLOGIES PRIVATE L',
    plannedAllocation: 60,
    plannedQuantity: 144,
    plannedPrice: 614.29,
    actualAllocation: 58,
    actualQuantity: 150,
    actualPrice: 614.29,
    variance: -2,
    status: 'low',
  },
  {
    id: '2',
    supplier: 'Synnova Gears & Transmissions',
    plannedAllocation: 15,
    plannedQuantity: 36,
    plannedPrice: 602.93,
    actualAllocation: 18,
    actualQuantity: 43,
    actualPrice: 602.93,
    variance: 3,
    status: 'low',
  },
  {
    id: '3',
    supplier: 'Sree Ganesh Gears Private Ltd',
    plannedAllocation: 15,
    plannedQuantity: 36,
    plannedPrice: 620.00,
    actualAllocation: 14,
    actualQuantity: 34,
    actualPrice: 620.00,
    variance: -1,
    status: 'low',
  },
  {
    id: '4',
    supplier: 'JAL PRECISION PRODUCTS LIMITED',
    plannedAllocation: 10,
    plannedQuantity: 24,
    plannedPrice: 623.76,
    actualAllocation: 10,
    actualQuantity: 24,
    actualPrice: 623.76,
    variance: 0,
    status: 'low',
  },
];

export const varianceDataItem2: VarianceData[] = [
  {
    id: '1',
    supplier: 'Damodar Engineering Works',
    plannedAllocation: 55,
    plannedQuantity: 110,
    plannedPrice: 2550.92,
    actualAllocation: 52,
    actualQuantity: 104,
    actualPrice: 2550.92,
    variance: -3,
    status: 'low',
  },
  {
    id: '2',
    supplier: 'V.R. Foundries',
    plannedAllocation: 35,
    plannedQuantity: 70,
    plannedPrice: 2515.77,
    actualAllocation: 38,
    actualQuantity: 76,
    actualPrice: 2515.77,
    variance: 3,
    status: 'low',
  },
  {
    id: '3',
    supplier: 'Shimpukade Metallguss Pvt Ltd.',
    plannedAllocation: 10,
    plannedQuantity: 20,
    plannedPrice: 2594.55,
    actualAllocation: 10,
    actualQuantity: 20,
    actualPrice: 2594.55,
    variance: 0,
    status: 'low',
  },
];

export const varianceDataItem3: VarianceData[] = [
  {
    id: '1',
    supplier: 'SANGKAJ TECHNOLOGIES PRIVATE L',
    plannedAllocation: 60,
    plannedQuantity: 120,
    plannedPrice: 310.08,
    actualAllocation: 55,
    actualQuantity: 110,
    actualPrice: 310.08,
    variance: -5,
    status: 'medium',
  },
  {
    id: '2',
    supplier: 'Synnova Gears & Transmissions',
    plannedAllocation: 30,
    plannedQuantity: 60,
    plannedPrice: 304.30,
    actualAllocation: 32,
    actualQuantity: 64,
    actualPrice: 304.30,
    variance: 2,
    status: 'low',
  },
  {
    id: '3',
    supplier: 'Sree Ganesh Gears Private Ltd',
    plannedAllocation: 10,
    plannedQuantity: 20,
    plannedPrice: 342.82,
    actualAllocation: 13,
    actualQuantity: 26,
    actualPrice: 342.82,
    variance: 3,
    status: 'low',
  },
];

export const varianceDataItem4: VarianceData[] = [
  {
    id: '1',
    supplier: 'K.K.R.Metal Components',
    plannedAllocation: 60,
    plannedQuantity: 120,
    plannedPrice: 1165.90,
    actualAllocation: 62,
    actualQuantity: 124,
    actualPrice: 1165.90,
    variance: 2,
    status: 'low',
  },
  {
    id: '2',
    supplier: 'RANE (MADRAS) LIMITED',
    plannedAllocation: 40,
    plannedQuantity: 80,
    plannedPrice: 1205.37,
    actualAllocation: 38,
    actualQuantity: 76,
    actualPrice: 1205.37,
    variance: -2,
    status: 'low',
  },
];

export const varianceDataItem5: VarianceData[] = [
  {
    id: '1',
    supplier: 'GNA AXLES LIMITED',
    plannedAllocation: 70,
    plannedQuantity: 140,
    plannedPrice: 997.18,
    actualAllocation: 72,
    actualQuantity: 144,
    actualPrice: 997.18,
    variance: 2,
    status: 'low',
  },
  {
    id: '2',
    supplier: 'Shareen Auto Pvt Ltd',
    plannedAllocation: 20,
    plannedQuantity: 40,
    plannedPrice: 1012.20,
    actualAllocation: 18,
    actualQuantity: 36,
    actualPrice: 1012.20,
    variance: -2,
    status: 'low',
  },
  {
    id: '3',
    supplier: 'Happy Steels Limited',
    plannedAllocation: 10,
    plannedQuantity: 20,
    plannedPrice: 1062.68,
    actualAllocation: 10,
    actualQuantity: 20,
    actualPrice: 1062.68,
    variance: 0,
    status: 'low',
  },
];

export const supplierAllocationItem1 = [
  { name: 'Local', value: 45, fill: '#006847' },
  { name: 'Regional', value: 33, fill: '#f59e0b' },
  { name: 'Import', value: 22, fill: '#6b7280' },
];

export const supplierAllocationItem2 = [
  { name: 'Local', value: 62, fill: '#006847' },
  { name: 'Regional', value: 30, fill: '#f59e0b' },
  { name: 'Import', value: 8, fill: '#6b7280' },
];

export const supplierAllocationItem3 = [
  { name: 'Local', value: 50, fill: '#006847' },
  { name: 'Regional', value: 40, fill: '#f59e0b' },
  { name: 'Import', value: 10, fill: '#6b7280' },
];

export const supplierAllocationItem4 = [
  { name: 'Local', value: 70, fill: '#006847' },
  { name: 'Regional', value: 20, fill: '#f59e0b' },
  { name: 'Import', value: 10, fill: '#6b7280' },
];

export const supplierAllocationItem5 = [
  { name: 'Local', value: 40, fill: '#006847' },
  { name: 'Regional', value: 50, fill: '#f59e0b' },
  { name: 'Import', value: 10, fill: '#6b7280' },
];

export const emailData: EmailData[] = [
  {
    id: '1',
    subject: 'High Variance Alert - AXEL GEAR CT85 - Synnova Gears',
    recipient: 'procurement@vsttractors.com',
    date: '2026-02-23 09:15',
    status: 'sent',
    item: 'AXEL GEAR CT85',
  },
  {
    id: '2',
    subject: 'SOB Weekly Report - FLY WHEEL',
    recipient: 'management@vsttractors.com',
    date: '2026-02-23 08:00',
    status: 'sent',
    item: 'FLY WHEEL',
  },
  {
    id: '3',
    subject: 'Supplier Performance Update - Final Drive Gear',
    recipient: 'suppliers@vsttractors.com',
    date: '2026-02-22 17:30',
    status: 'sent',
    item: 'Final Drive Gear',
  },
  {
    id: '4',
    subject: 'Medium Variance Alert - GEAR CASE - K.K.R.Metal',
    recipient: 'procurement@vsttractors.com',
    date: '2026-02-22 14:20',
    status: 'sent',
    item: 'GEAR CASE',
  },
  {
    id: '5',
    subject: 'Daily SOB Summary - Shaft Final',
    recipient: 'operations@vsttractors.com',
    date: '2026-02-22 07:00',
    status: 'sent',
    item: 'Shaft Final',
  },
];

export const notificationData: NotificationData[] = [
  {
    id: '1',
    message: 'High variance detected for AXEL GEAR CT85 - Synnova Gears (+5%)',
    severity: 'high',
    timestamp: '2026-02-23 09:15',
    read: false,
  },
  {
    id: '2',
    message: 'FLY WHEEL - V.R. Foundries slight variance (+5%)',
    severity: 'low',
    timestamp: '2026-02-23 08:30',
    read: false,
  },
  {
    id: '3',
    message: 'Medium variance detected for Final Drive Gear - Sree Ganesh (+5%)',
    severity: 'medium',
    timestamp: '2026-02-22 14:20',
    read: true,
  },
  {
    id: '4',
    message: 'Weekly SOB report generated for Gear Case',
    severity: 'low',
    timestamp: '2026-02-22 08:00',
    read: true,
  },
  {
    id: '5',
    message: 'Data sync completed for GNA AXLES LIMITED',
    severity: 'low',
    timestamp: '2026-02-21 23:45',
    read: true,
  },
];

export const supplierDetailData: SupplierDetailData[] = [
  {
    name: 'Synnova Gears & Transmissions',
    stockoutDays: 2,
    onTimeDelivery: 98,
    averageDelay: 0.5,
    currentStock: 450,
    supplierPerformance: 96,
    allocationCompliance: 98,
    status: 'low',
    contactPerson: 'Rahul Maheshwari',
    email: 'sales@synnova.com',
    phone: '+91 91234 56789',
  },
  {
    name: 'SANGKAJ TECHNOLOGIES PRIVATE L',
    stockoutDays: 5,
    onTimeDelivery: 92,
    averageDelay: 1.5,
    currentStock: 320,
    supplierPerformance: 88,
    allocationCompliance: 90,
    status: 'medium',
    contactPerson: 'Amitabh S.',
    email: 'info@sangkaj.in',
    phone: '+91 99887 76655',
  },
  {
    name: 'JAL PRECISION PRODUCTS LIMITED',
    stockoutDays: 1,
    onTimeDelivery: 99,
    averageDelay: 0.2,
    currentStock: 500,
    supplierPerformance: 98,
    allocationCompliance: 99,
    status: 'low',
    contactPerson: 'Vikram Mehta',
    email: 'contact@jalprecision.com',
    phone: '+91 98220 12345',
  },
  {
    name: 'Shimpukade Metallguss Pvt Ltd.',
    stockoutDays: 8,
    onTimeDelivery: 85,
    averageDelay: 3.2,
    currentStock: 150,
    supplierPerformance: 78,
    allocationCompliance: 82,
    status: 'high',
    contactPerson: 'Sanjay Shimpukade',
    email: 'ops@shimpukade.com',
    phone: '+91 94220 54321',
  },
  {
    name: 'V.R. Foundries',
    stockoutDays: 4,
    onTimeDelivery: 94,
    averageDelay: 1.0,
    currentStock: 280,
    supplierPerformance: 92,
    allocationCompliance: 94,
    status: 'low',
    contactPerson: 'Rajesh V.',
    email: 'vr.foundries@gmail.com',
    phone: '+91 98888 11111',
  },
  {
    name: 'Damodar Engineering Works',
    stockoutDays: 6,
    onTimeDelivery: 88,
    averageDelay: 2.5,
    currentStock: 190,
    supplierPerformance: 84,
    allocationCompliance: 86,
    status: 'medium',
    contactPerson: 'Prakash D.',
    email: 'damodar.eng@vsnl.com',
    phone: '+91 98450 22334',
  },
  {
    name: 'Sree Ganesh Gears Private Ltd',
    stockoutDays: 3,
    onTimeDelivery: 95,
    averageDelay: 1.2,
    currentStock: 340,
    supplierPerformance: 91,
    allocationCompliance: 93,
    status: 'low',
    contactPerson: 'Ganesh Iyer',
    email: 'gears@sreeganesh.com',
    phone: '+91 97654 32109',
  },
  {
    name: 'K.K.R.Metal Components',
    stockoutDays: 7,
    onTimeDelivery: 86,
    averageDelay: 2.8,
    currentStock: 210,
    supplierPerformance: 81,
    allocationCompliance: 84,
    status: 'medium',
    contactPerson: 'Murugan K.',
    email: 'admin@kkrmetal.in',
    phone: '+91 98400 98765',
  },
  {
    name: 'RANE (MADRAS) LIMITED',
    stockoutDays: 2,
    onTimeDelivery: 97,
    averageDelay: 0.8,
    currentStock: 400,
    supplierPerformance: 95,
    allocationCompliance: 96,
    status: 'low',
    contactPerson: 'Sowmya R.',
    email: 'exports@rane.co.in',
    phone: '+91 99000 55667',
  },
  {
    name: 'GNA AXLES LIMITED',
    stockoutDays: 4,
    onTimeDelivery: 93,
    averageDelay: 1.4,
    currentStock: 300,
    supplierPerformance: 90,
    allocationCompliance: 92,
    status: 'low',
    contactPerson: 'Jagdish Singh',
    email: 'sales@gnaaxles.com',
    phone: '+91 98140 33445',
  },
  {
    name: 'Shareen Auto Pvt Ltd',
    stockoutDays: 9,
    onTimeDelivery: 82,
    averageDelay: 4.5,
    currentStock: 120,
    supplierPerformance: 75,
    allocationCompliance: 78,
    status: 'high',
    contactPerson: 'Aslam Sheikh',
    email: 'support@shareenauto.com',
    phone: '+91 98230 44556',
  },
  {
    name: 'Happy Steels Limited',
    stockoutDays: 5,
    onTimeDelivery: 91,
    averageDelay: 1.8,
    currentStock: 250,
    supplierPerformance: 87,
    allocationCompliance: 89,
    status: 'medium',
    contactPerson: 'Harpreet Singh',
    email: 'info@happysteels.com',
    phone: '+91 98111 22334',
  },
];

export const invoiceData: InvoiceData[] = [
  {
    id: '1',
    invoiceNumber: 'SG25265250',
    supplierName: 'Shimpukade Metallguss Pvt Ltd.',
    date: '2026-01-07',
    quantityReceived: 20,
    expectedQuantity: 20,
    plannedPrice: 2594.55,
    actualPrice: 2594.55,
    status: 'received',
    batchNumber: '5001318808',
    receivedBy: 'Admin',
    notes: 'Full lot accepted',
  },
  {
    id: '2',
    invoiceNumber: 'U2-2526/205403',
    supplierName: 'Synnova Gears & Transmissions',
    date: '2025-12-21',
    quantityReceived: 96,
    expectedQuantity: 96,
    plannedPrice: 602.93,
    actualPrice: 602.93,
    status: 'received',
    batchNumber: '5001319846',
    receivedBy: 'Admin',
    notes: 'Full lot accepted',
  },
  {
    id: '3',
    invoiceNumber: 'CI2510094293',
    supplierName: 'SANGKAJ TECHNOLOGIES PRIVATE L',
    date: '2025-12-28',
    quantityReceived: 144,
    expectedQuantity: 144,
    plannedPrice: 310.08,
    actualPrice: 310.08,
    status: 'received',
    batchNumber: '5001320303',
    receivedBy: 'Admin',
    notes: 'Full lot accepted',
  },
  {
    id: '4',
    invoiceNumber: 'TI2225021416',
    supplierName: 'GNA AXLES LIMITED',
    date: '2025-12-24',
    quantityReceived: 150,
    expectedQuantity: 150,
    plannedPrice: 997.18,
    actualPrice: 997.18,
    status: 'received',
    batchNumber: '5001320304',
    receivedBy: 'Admin',
    notes: 'Full lot accepted',
  },
  {
    id: '5',
    invoiceNumber: 'GST/2996-2025/26',
    supplierName: 'K.K.R.Metal Components',
    date: '2026-01-13',
    quantityReceived: 120,
    expectedQuantity: 120,
    plannedPrice: 1165.90,
    actualPrice: 1165.90,
    status: 'received',
    batchNumber: '5001322216',
    receivedBy: 'Admin',
    notes: 'Full lot accepted',
  },
  {
    id: '6',
    invoiceNumber: 'DEW/804/25-26',
    supplierName: 'Damodar Engineering Works',
    date: '2026-01-10',
    quantityReceived: 166,
    expectedQuantity: 166,
    plannedPrice: 2550.92,
    actualPrice: 2550.92,
    status: 'received',
    batchNumber: '5001320104',
    receivedBy: 'Admin',
    notes: 'Full lot accepted',
  },
  {
    id: '7',
    invoiceNumber: '4592/25-26',
    supplierName: 'Shareen Auto Pvt Ltd',
    date: '2026-01-02',
    quantityReceived: 199,
    expectedQuantity: 200,
    plannedPrice: 1012.20,
    actualPrice: 1012.20,
    status: 'partial',
    batchNumber: '5001320809',
    receivedBy: 'Admin',
    notes: 'Cut Sample rejected',
  },
];