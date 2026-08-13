// Initial Mock Data for Enterprise ERP System

export const INITIAL_COMPANIES = [
  { id: 'c1', name: 'Apex Global Enterprises', code: 'AGE', baseCurrency: 'USD', phone: '+1 (555) 019-2834', email: 'info@apexglobal.com', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80' },
  { id: 'c2', name: 'Apex Retail Solutions', code: 'ARS', baseCurrency: 'EUR', phone: '+31 (0) 20 555 0123', email: 'retail@apexglobal.com', logo: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=100&h=100&fit=crop&q=80' }
];

export const INITIAL_BRANCHES = [
  { id: 'b1', companyId: 'c1', name: 'Headquarters', city: 'New York', country: 'USA' },
  { id: 'b2', companyId: 'c1', name: 'West Coast Hub', city: 'San Francisco', country: 'USA' },
  { id: 'b3', companyId: 'c2', name: 'Amsterdam Main', city: 'Amsterdam', country: 'Netherlands' }
];

export const INITIAL_WAREHOUSES = [
  { id: 'w1', branchId: 'b1', name: 'Central Warehouse NYC', code: 'WH-NYC-01', location: 'Queens, NYC', capacity: 15000 },
  { id: 'w2', branchId: 'b1', name: 'Cold Storage NYC', code: 'WH-NYC-COLD', location: 'Brooklyn, NYC', capacity: 5000 },
  { id: 'w3', branchId: 'b2', name: 'San Francisco Depot', code: 'WH-SFO-01', location: 'Oakland, SFO', capacity: 10000 },
  { id: 'w4', branchId: 'b3', name: 'Euro Distribution Center', code: 'WH-AMS-01', location: 'Schiphol, AMS', capacity: 25000 }
];

export const INITIAL_ROLES = [
  { id: 'r1', name: 'Super Admin', permissions: { all: true } },
  {
    id: 'r2',
    name: 'Admin',
    permissions: {
      dashboard: ['read'],
      inventory: ['create', 'read', 'update', 'delete', 'approve', 'export'],
      sales: ['create', 'read', 'update', 'delete', 'approve', 'export'],
      purchase: ['create', 'read', 'update', 'delete', 'approve', 'export'],
      crm: ['create', 'read', 'update', 'delete', 'export'],
      supplier: ['create', 'read', 'update', 'delete', 'export'],
      hrm: ['create', 'read', 'update', 'delete', 'export'],
      accounting: ['create', 'read', 'update', 'delete', 'export'],
      manufacturing: ['create', 'read', 'update', 'delete', 'approve'],
      service: ['create', 'read', 'update', 'delete'],
      assets: ['create', 'read', 'update'],
      documents: ['create', 'read', 'update', 'delete'],
      settings: ['read', 'update']
    }
  },
  {
    id: 'r3',
    name: 'Manager',
    permissions: {
      dashboard: ['read'],
      inventory: ['create', 'read', 'update', 'approve', 'export'],
      sales: ['create', 'read', 'update', 'approve', 'export'],
      purchase: ['create', 'read', 'update', 'approve', 'export'],
      crm: ['create', 'read', 'update', 'export'],
      supplier: ['create', 'read', 'update'],
      hrm: ['read'],
      accounting: ['read'],
      manufacturing: ['create', 'read', 'update', 'approve'],
      service: ['create', 'read', 'update'],
      assets: ['read'],
      documents: ['create', 'read', 'update']
    }
  },
  {
    id: 'r4',
    name: 'Warehouse Staff',
    permissions: {
      dashboard: ['read'],
      inventory: ['create', 'read', 'update'],
      sales: ['read'],
      purchase: ['read'],
      manufacturing: ['read', 'update'],
      documents: ['create', 'read']
    }
  },
  {
    id: 'r5',
    name: 'Sales Agent',
    permissions: {
      dashboard: ['read'],
      inventory: ['read'],
      sales: ['create', 'read', 'update'],
      crm: ['create', 'read', 'update'],
      documents: ['create', 'read']
    }
  },
  {
    id: 'r6',
    name: 'Accountant',
    permissions: {
      dashboard: ['read'],
      sales: ['read'],
      purchase: ['read'],
      accounting: ['create', 'read', 'update', 'delete', 'approve', 'export'],
      hrm: ['read', 'update'],
      assets: ['create', 'read', 'update']
    }
  },
  {
    id: 'r7',
    name: 'Customer Support',
    permissions: {
      dashboard: ['read'],
      crm: ['create', 'read', 'update'],
      service: ['create', 'read', 'update', 'delete']
    }
  }
];

export const INITIAL_USERS = [
  { id: 'u1', username: 'superadmin', name: 'Sarah Jenkins', email: 'sarah.j@apex.com', roleId: 'r1', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80', status: 'Active', twoFaEnabled: true },
  { id: 'u2', username: 'warehouse_joe', name: 'Joe Miller', email: 'joe.m@apex.com', roleId: 'r4', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80', status: 'Active', twoFaEnabled: false },
  { id: 'u3', username: 'accountant_alice', name: 'Alice Vane', email: 'alice.v@apex.com', roleId: 'r6', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80', status: 'Active', twoFaEnabled: true },
  { id: 'u4', username: 'sales_bob', name: 'Bob Anderson', email: 'bob.a@apex.com', roleId: 'r5', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80', status: 'Active', twoFaEnabled: false }
];

export const INITIAL_CATEGORIES = [
  { id: 'cat1', name: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Accessories', 'IoT Devices'] },
  { id: 'cat2', name: 'Apparel & Fashion', subcategories: ['T-shirts', 'Jackets', 'Footwear', 'Caps'] },
  { id: 'cat3', name: 'Raw Materials', subcategories: ['Chemicals', 'Metals', 'Packaging', 'Components'] },
  { id: 'cat4', name: 'Pharmaceuticals', subcategories: ['Antibiotics', 'Vitamins', 'Analgesics', 'Vaccines'] }
];

export const INITIAL_BRANDS = ['ApexTech', 'GigaForce', 'EcoWear', 'BioCure', 'InnoPack', 'Generic'];

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Apex Pro Phone 14',
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'ApexTech',
    sku: 'AP-PH14-PRO',
    barcode: '880947230491',
    description: 'High-performance next-gen smartphone with AI processor.',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&q=80'],
    variants: [
      { id: 'p1-v1', name: 'Space Gray / 256GB', price: 999, cost: 450, stock: 120, reorderLevel: 20 },
      { id: 'p1-v2', name: 'Silver / 512GB', price: 1199, cost: 550, stock: 85, reorderLevel: 15 }
    ],
    taxRate: 8, // %
    serialTracking: true,
    batchTracking: false,
    warrantyMonths: 12,
    lifecycleStatus: 'Active'
  },
  {
    id: 'p2',
    name: 'GigaBook Pro 15',
    category: 'Electronics',
    subcategory: 'Laptops',
    brand: 'GigaForce',
    sku: 'GB-PRO-15',
    barcode: '400638133393',
    description: '15-inch powerhouse laptop for developer and editing workflows.',
    images: ['https://images.unsplash.com/photo-1496181130204-755241544e3f?w=300&h=300&fit=crop&q=80'],
    variants: [
      { id: 'p2-v1', name: 'Core i7 / 16GB RAM / 1TB SSD', price: 1499, cost: 800, stock: 45, reorderLevel: 10 },
      { id: 'p2-v2', name: 'Core i9 / 32GB RAM / 2TB SSD', price: 2199, cost: 1200, stock: 22, reorderLevel: 5 }
    ],
    taxRate: 8,
    serialTracking: true,
    batchTracking: false,
    warrantyMonths: 24,
    lifecycleStatus: 'Active'
  },
  {
    id: 'p3',
    name: 'EcoShield Eco Jacket',
    category: 'Apparel & Fashion',
    subcategory: 'Jackets',
    brand: 'EcoWear',
    sku: 'EC-JKT-01',
    barcode: '301140924901',
    description: 'Weatherproof organic cotton jacket, premium comfort and fit.',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&q=80'],
    variants: [
      { id: 'p3-v1', name: 'Olive Green / Large', price: 149, cost: 50, stock: 210, reorderLevel: 30 },
      { id: 'p3-v2', name: 'Charcoal Black / Medium', price: 149, cost: 50, stock: 155, reorderLevel: 30 }
    ],
    taxRate: 5,
    serialTracking: false,
    batchTracking: true,
    warrantyMonths: 0,
    lifecycleStatus: 'Active'
  },
  {
    id: 'p4',
    name: 'Vitaride Vitamin C 1000mg',
    category: 'Pharmaceuticals',
    subcategory: 'Vitamins',
    brand: 'BioCure',
    sku: 'BC-VITC-1000',
    barcode: '501234567890',
    description: 'Antioxidant and immunity boosters, 100 tablets pack.',
    images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&q=80'],
    variants: [
      { id: 'p4-v1', name: 'Standard / 100 Tabs', price: 19.99, cost: 4.5, stock: 840, reorderLevel: 100 }
    ],
    taxRate: 0,
    serialTracking: false,
    batchTracking: true,
    expiryMonths: 18,
    warrantyMonths: 0,
    lifecycleStatus: 'Active'
  },
  {
    id: 'p5',
    name: 'Aluminium Plate 6061-T6',
    category: 'Raw Materials',
    subcategory: 'Metals',
    brand: 'Generic',
    sku: 'RM-AL-6061',
    barcode: '600000120491',
    description: 'High strength structural raw metal plates.',
    images: ['https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&h=300&fit=crop&q=80'],
    variants: [
      { id: 'p5-v1', name: '10mm Thickness / 1x1m', price: 75, cost: 32, stock: 350, reorderLevel: 50 }
    ],
    taxRate: 8,
    serialTracking: false,
    batchTracking: true,
    warrantyMonths: 0,
    lifecycleStatus: 'Active'
  }
];

export const INITIAL_STOCK_MOVEMENTS = [
  { id: 'm1', variantId: 'p1-v1', warehouseId: 'w1', type: 'IN', qty: 150, reference: 'PO-2026-001', date: '2026-05-10T10:00:00Z', notes: 'Initial delivery' },
  { id: 'm2', variantId: 'p1-v1', warehouseId: 'w1', type: 'OUT', qty: 30, reference: 'SO-2026-001', date: '2026-06-12T14:30:00Z', notes: 'Customer sales order' },
  { id: 'm3', variantId: 'p4-v1', warehouseId: 'w2', type: 'IN', qty: 1000, reference: 'PO-2026-002', date: '2026-04-15T09:15:00Z', notes: 'Batch BC-9941 received', batchNo: 'BC-9941', expiryDate: '2027-10-15' },
  { id: 'm4', variantId: 'p4-v1', warehouseId: 'w2', type: 'ADJ', qty: -10, reference: 'ADJ-2026-001', date: '2026-06-20T11:00:00Z', notes: 'Damaged bottles removed' },
  { id: 'm5', variantId: 'p1-v2', warehouseId: 'w1', type: 'TRANSFER', qty: 15, reference: 'TRSF-2026-001', date: '2026-07-02T16:00:00Z', warehouseFromId: 'w1', warehouseToId: 'w3', notes: 'Rebalancing inventory to SF' }
];

export const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Acme Corporation', contactPerson: 'John Smith', email: 'john.smith@acme.com', phone: '+1 (555) 123-4567', segment: 'Enterprise', loyaltyPoints: 450, walletBalance: 1200.0, clv: 25000.0, birthday: '1984-06-12', address: '123 Business Rd, Chicago IL' },
  { id: 'c2', name: 'TechStart Inc.', contactPerson: 'Emily Davis', email: 'emily.d@techstart.io', phone: '+1 (555) 765-4321', segment: 'SME', loyaltyPoints: 120, walletBalance: 0.0, clv: 8400.0, birthday: '1992-09-24', address: '456 Innovation Blvd, San Francisco CA' },
  { id: 'c3', name: 'David Lee', contactPerson: 'David Lee', email: 'dlee@personal.net', phone: '+1 (555) 987-6543', segment: 'Retail', loyaltyPoints: 85, walletBalance: 45.5, clv: 1250.0, birthday: '1978-11-03', address: '789 Residential St, Brooklyn NY' }
];

export const INITIAL_LEADS = [
  { id: 'l1', name: 'Future Retail Group', contactPerson: 'Markus Vance', email: 'm.vance@futureretail.org', phone: '+1 (555) 345-6789', source: 'Web Form', status: 'Proposal Sent', pipelineStage: 'Negotiation', estimatedValue: 45000, assignedTo: 'u4', notes: 'Interested in buying bulk Apex Pro Phone' },
  { id: 'l2', name: 'Alpha Logistics', contactPerson: 'Helen Troy', email: 'h.troy@alphalog.com', phone: '+1 (555) 567-8901', source: 'Cold Call', status: 'Contacted', pipelineStage: 'Discovery', estimatedValue: 12000, assignedTo: 'u4', notes: 'Inquiring about stock tracking solutions' }
];

export const INITIAL_CRM_COMM_LOGS = [
  { id: 'comm1', customerId: 'c1', type: 'Email', subject: 'Quote Request - bulk order', body: 'Sent quotation for 50 Apex Phones with corporate pricing tier.', direction: 'Outgoing', date: '2026-07-20T10:00:00Z', operator: 'u4' },
  { id: 'comm2', customerId: 'c1', type: 'Call', subject: 'Follow-up Call', body: 'Spoke with John regarding payment terms. Requested net 30, approved by Finance.', direction: 'Outgoing', date: '2026-07-21T15:30:00Z', operator: 'u4' },
  { id: 'comm3', customerId: 'c2', type: 'WhatsApp', subject: 'Shipping query', body: 'Sent tracking link for order SO-2026-114.', direction: 'Outgoing', date: '2026-07-22T09:12:00Z', operator: 'u4' }
];

export const INITIAL_SUPPLIERS = [
  { id: 's1', name: 'Apex Electronics Manufacturing Ltd', contact: 'Kevin Woo', email: 'kevin.woo@apextech-mfg.com', phone: '+86 21 5555 1212', rating: 4.8, status: 'Active', category: 'Electronics', address: 'Pudong New Area, Shanghai, China' },
  { id: 's2', name: 'GreenTextiles Co.', contact: 'Claire Dupont', email: 'c.dupont@greentex.fr', phone: '+33 1 45 55 01 99', rating: 4.2, status: 'Active', category: 'Fashion', address: 'Rue de Rivoli, Paris, France' },
  { id: 's3', name: 'Pharmachem Bulk Labs', contact: 'Dr. Raj Patel', email: 'r.patel@pharmachem.in', phone: '+91 22 5555 9876', rating: 4.5, status: 'Active', category: 'Pharmaceuticals', address: 'Andheri East, Mumbai, India' }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'PO-2026-001',
    supplierId: 's1',
    date: '2026-05-01',
    expectedDate: '2026-05-15',
    items: [
      { variantId: 'p1-v1', qty: 150, cost: 450, taxRate: 8 },
      { variantId: 'p1-v2', qty: 50, cost: 550, taxRate: 8 }
    ],
    status: 'Received',
    paymentStatus: 'Paid',
    total: 95000,
    warehouseId: 'w1'
  },
  {
    id: 'PO-2026-002',
    supplierId: 's3',
    date: '2026-07-10',
    expectedDate: '2026-08-01',
    items: [
      { variantId: 'p4-v1', qty: 1000, cost: 4.5, taxRate: 0 }
    ],
    status: 'Pending',
    paymentStatus: 'Unpaid',
    total: 4500,
    warehouseId: 'w2'
  }
];

export const INITIAL_SALES_ORDERS = [
  {
    id: 'SO-2026-001',
    customerId: 'c1',
    date: '2026-06-12',
    items: [
      { variantId: 'p1-v1', qty: 30, price: 950, taxRate: 8 } // bulk discounted
    ],
    status: 'Delivered',
    paymentStatus: 'Paid',
    total: 30780, // (30 * 950) * 1.08
    branchId: 'b1'
  },
  {
    id: 'SO-2026-002',
    customerId: 'c2',
    date: '2026-07-22',
    items: [
      { variantId: 'p2-v1', qty: 2, price: 1499, taxRate: 8 },
      { variantId: 'p3-v1', qty: 5, price: 149, taxRate: 5 }
    ],
    status: 'Processing',
    paymentStatus: 'Partial',
    total: 4056.23,
    branchId: 'b1'
  }
];

export const INITIAL_EMPLOYEES = [
  { id: 'emp1', name: 'Sarah Jenkins', department: 'Executive', designation: 'CEO / Super Admin', salary: 15000, commissionRate: 0, shift: 'Day Shift (9am - 5pm)', joiningDate: '2022-01-15', phone: '+1 (555) 123-0001', email: 'sarah.j@apex.com', status: 'Active' },
  { id: 'emp2', name: 'Alice Vane', department: 'Finance & Accounting', designation: 'Chief Accountant', salary: 8500, commissionRate: 0, shift: 'Day Shift (9am - 5pm)', joiningDate: '2023-04-10', phone: '+1 (555) 123-0002', email: 'alice.v@apex.com', status: 'Active' },
  { id: 'emp3', name: 'Bob Anderson', department: 'Sales & Marketing', designation: 'Senior Account Manager', salary: 5000, commissionRate: 2, shift: 'Flexible Shift', joiningDate: '2024-02-01', phone: '+1 (555) 123-0003', email: 'bob.a@apex.com', status: 'Active' },
  { id: 'emp4', name: 'Joe Miller', department: 'Operations & Logistics', designation: 'Warehouse Lead', salary: 4500, commissionRate: 0, shift: 'Day Shift (9am - 5pm)', joiningDate: '2023-11-20', phone: '+1 (555) 123-0004', email: 'joe.m@apex.com', status: 'Active' }
];

export const INITIAL_HRM_ATTENDANCE = [
  { id: 'att1', employeeId: 'emp1', date: '2026-07-23', clockIn: '08:52 AM', clockOut: '05:15 PM', status: 'Present' },
  { id: 'att2', employeeId: 'emp2', date: '2026-07-23', clockIn: '09:02 AM', clockOut: '05:05 PM', status: 'Present' },
  { id: 'att3', employeeId: 'emp3', date: '2026-07-23', clockIn: '09:30 AM', clockOut: '04:45 PM', status: 'Present' },
  { id: 'att4', employeeId: 'emp4', date: '2026-07-23', clockIn: '08:45 AM', clockOut: '05:30 PM', status: 'Present' }
];

export const INITIAL_HRM_LEAVES = [
  { id: 'lv1', employeeId: 'emp3', leaveType: 'Sick Leave', startDate: '2026-07-10', endDate: '2026-07-11', reason: 'Flu symptoms', status: 'Approved' },
  { id: 'lv2', employeeId: 'emp4', leaveType: 'Annual Leave', startDate: '2026-08-15', endDate: '2026-08-22', reason: 'Summer holiday', status: 'Pending' }
];

// CHART OF ACCOUNTS (Unified Standard list for enterprise accounting)
export const INITIAL_CHART_OF_ACCOUNTS = [
  // Assets
  { code: '1010', name: 'Cash on Hand', type: 'Asset', subType: 'Current Asset', balance: 15450.0 },
  { code: '1020', name: 'Main Checking Bank (Stripe)', type: 'Asset', subType: 'Current Asset', balance: 245000.0 },
  { code: '1050', name: 'Accounts Receivable (Trade)', type: 'Asset', subType: 'Current Asset', balance: 35000.0 },
  { code: '1100', name: 'Inventory Asset Value', type: 'Asset', subType: 'Current Asset', balance: 275840.0 },
  { code: '1500', name: 'Property & Equipment', type: 'Asset', subType: 'Fixed Asset', balance: 95000.0 },
  { code: '1550', name: 'Accumulated Depreciation', type: 'Asset', subType: 'Fixed Asset', balance: -15000.0 },

  // Liabilities
  { code: '2010', name: 'Accounts Payable', type: 'Liability', subType: 'Current Liability', balance: 4500.0 },
  { code: '2200', name: 'Sales Tax Payable', type: 'Liability', subType: 'Current Liability', balance: 12500.0 },
  { code: '2500', name: 'Long-term Bank Loan', type: 'Liability', subType: 'Long-term Liability', balance: 50000.0 },

  // Equity
  { code: '3010', name: 'Share Capital', type: 'Equity', subType: 'Owner Equity', balance: 400000.0 },
  { code: '3500', name: 'Retained Earnings', type: 'Equity', subType: 'Owner Equity', balance: 145000.0 },

  // Income
  { code: '4010', name: 'Sales Revenue', type: 'Revenue', subType: 'Operating Revenue', balance: 84200.0 },
  { code: '4050', name: 'Services Income', type: 'Revenue', subType: 'Operating Revenue', balance: 12500.0 },

  // Expenses
  { code: '5010', name: 'Cost of Goods Sold (COGS)', type: 'Expense', subType: 'Operating Expense', balance: 41200.0 },
  { code: '5100', name: 'Employee Salaries', type: 'Expense', subType: 'Operating Expense', balance: 33000.0 },
  { code: '5200', name: 'Rent & Utilities', type: 'Expense', subType: 'Operating Expense', balance: 12000.0 },
  { code: '5300', name: 'Marketing & Advertising', type: 'Expense', subType: 'Operating Expense', balance: 8500.0 },
  { code: '5400', name: 'Depreciation Expense', type: 'Expense', subType: 'Operating Expense', balance: 1250.0 }
];

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: 'JE-2026-001',
    date: '2026-06-30',
    description: 'Record June Employee Salaries Payroll',
    lines: [
      { accountCode: '5100', debit: 33000, credit: 0 },
      { accountCode: '1020', debit: 0, credit: 33000 }
    ],
    status: 'Posted'
  },
  {
    id: 'JE-2026-002',
    date: '2026-07-01',
    description: 'Record Monthly Office Rent Expense',
    lines: [
      { accountCode: '5200', debit: 4500, credit: 0 },
      { accountCode: '1020', debit: 0, credit: 4500 }
    ],
    status: 'Posted'
  }
];

export const INITIAL_MANUFACTURING_BOM = [
  {
    id: 'bom1',
    productId: 'p3', // EcoShield Jacket
    name: 'Standard Eco Jacket BOM v1.2',
    rawMaterials: [
      { variantId: 'p5-v1', qtyNeeded: 0.1, unit: 'm2', notes: 'Aluminium eyelets support' },
      { variantId: 'p4-v1', qtyNeeded: 0, unit: 'unit', notes: 'Included for example' } // empty demo link
    ],
    operationsCost: 15.0, // labout cost per item
    wasteRate: 2, // %
    status: 'Active'
  }
];

export const INITIAL_ASSETS = [
  { id: 'as1', name: 'NY HQ Server Rack Complex', category: 'IT Hardware', value: 45000, purchaseDate: '2024-01-10', depreciationMethod: 'Straight Line', usefulLifeMonths: 60, accumulatedDepreciation: 18000, assignedTo: 'emp1', status: 'In Service' },
  { id: 'as2', name: 'SF Depot Forklift (CAT v3)', category: 'Logistics Equipment', value: 35000, purchaseDate: '2025-06-15', depreciationMethod: 'Double Declining', usefulLifeMonths: 84, accumulatedDepreciation: 5000, assignedTo: 'emp4', status: 'In Service' }
];

export const INITIAL_WARRANTIES = [
  { id: 'warr1', customerId: 'c1', variantId: 'p1-v1', serialNo: 'SN-APPH14-99801', purchaseDate: '2026-06-12', expiryDate: '2027-06-12', status: 'Active' },
  { id: 'warr2', customerId: 'c2', variantId: 'p2-v1', serialNo: 'SN-GIGABK-77402', purchaseDate: '2026-07-22', expiryDate: '2028-07-22', status: 'Active' }
];

export const INITIAL_SERVICE_TICKETS = [
  { id: 'tix1', customerId: 'c1', serviceType: 'Warranty Claim', subject: 'Apex Phone screen flickering', description: 'Screen flashes green occasionally during phone charge.', serialNo: 'SN-APPH14-99801', status: 'In Progress', assignedTo: 'u3', priority: 'High', date: '2026-07-15' },
  { id: 'tix2', customerId: 'c2', serviceType: 'Regular Maintenance', subject: 'GigaBook heat sink clean', description: 'Requesting thermal paste replacement and dust clean.', serialNo: 'SN-GIGABK-77402', status: 'Completed', assignedTo: 'u3', priority: 'Medium', date: '2026-07-18' }
];

export const INITIAL_TASKS = [
  { id: 'tsk1', title: 'Prepare Q3 Financial Audit', description: 'Compile ledgers, check COGS variance and sales tax liability.', dueDate: '2026-07-30', priority: 'High', status: 'Pending', assignedTo: 'u3' },
  { id: 'tsk2', title: 'Restock Olive Green Jacket', description: 'Check reorder level and submit supplier purchase order to s2.', dueDate: '2026-07-25', priority: 'Medium', status: 'Completed', assignedTo: 'u2' },
  { id: 'tsk3', title: 'Lead Call - Future Retail', description: 'Call Markus Vance regarding their bulk smartphone inquiry.', dueDate: '2026-07-24', priority: 'High', status: 'Pending', assignedTo: 'u4' }
];

export const INITIAL_DOCUMENTS = [
  { id: 'doc1', name: 'Apex Electronics Contract 2026.pdf', category: 'Contracts', size: '2.4 MB', version: '1.4', uploadedBy: 'Sarah Jenkins', uploadDate: '2026-01-10', path: '/docs/apex_elec_contract.pdf' },
  { id: 'doc2', name: 'Tax Audit Report Q2-2026.xlsx', category: 'Financials', size: '1.8 MB', version: '2.1', uploadedBy: 'Alice Vane', uploadDate: '2026-07-05', path: '/docs/tax_q2_2026.xlsx' }
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'aud1', userId: 'u1', username: 'superadmin', action: 'Login', entity: 'Session', details: 'Successful login with 2FA verification from IP: 192.168.1.45', timestamp: '2026-07-23T09:00:00Z' },
  { id: 'aud2', userId: 'u4', username: 'sales_bob', action: 'Create', entity: 'Sales Order', details: 'Created SO-2026-002 for TechStart Inc., Total: $4,056.23', timestamp: '2026-07-22T14:45:00Z' },
  { id: 'aud3', userId: 'u2', username: 'warehouse_joe', action: 'Adjust', entity: 'Inventory', details: 'Stock adjustment ADJ-2026-001 (loss -10 Vitaride C tabs)', timestamp: '2026-06-20T11:00:00Z' }
];
