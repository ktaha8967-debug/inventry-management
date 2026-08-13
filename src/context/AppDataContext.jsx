import React, { createContext, useContext, useState, useEffect } from 'react';
import * as InitialData from '../data/initialData';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  // Load state from localStorage or initialData
  const getStoredOrInitial = (key, initial) => {
    const val = localStorage.getItem(`erp_${key}`);
    return val ? JSON.parse(val) : initial;
  };

  // State Declarations
  const [companies, setCompanies] = useState(() => getStoredOrInitial('companies', InitialData.INITIAL_COMPANIES));
  const [branches, setBranches] = useState(() => getStoredOrInitial('branches', InitialData.INITIAL_BRANCHES));
  const [warehouses, setWarehouses] = useState(() => getStoredOrInitial('warehouses', InitialData.INITIAL_WAREHOUSES));
  const [roles, setRoles] = useState(() => getStoredOrInitial('roles', InitialData.INITIAL_ROLES));
  const [users, setUsers] = useState(() => getStoredOrInitial('users', InitialData.INITIAL_USERS));
  const [categories, setCategories] = useState(() => getStoredOrInitial('categories', InitialData.INITIAL_CATEGORIES));
  const [brands, setBrands] = useState(() => getStoredOrInitial('brands', InitialData.INITIAL_BRANDS));
  const [products, setProducts] = useState(() => getStoredOrInitial('products', InitialData.INITIAL_PRODUCTS));
  const [stockMovements, setStockMovements] = useState(() => getStoredOrInitial('stockMovements', InitialData.INITIAL_STOCK_MOVEMENTS));
  const [customers, setCustomers] = useState(() => getStoredOrInitial('customers', InitialData.INITIAL_CUSTOMERS));
  const [leads, setLeads] = useState(() => getStoredOrInitial('leads', InitialData.INITIAL_LEADS));
  const [commLogs, setCommLogs] = useState(() => getStoredOrInitial('commLogs', InitialData.INITIAL_CRM_COMM_LOGS));
  const [suppliers, setSuppliers] = useState(() => getStoredOrInitial('suppliers', InitialData.INITIAL_SUPPLIERS));
  const [purchaseOrders, setPurchaseOrders] = useState(() => getStoredOrInitial('purchaseOrders', InitialData.INITIAL_PURCHASE_ORDERS));
  const [salesOrders, setSalesOrders] = useState(() => getStoredOrInitial('salesOrders', InitialData.INITIAL_SALES_ORDERS));
  const [employees, setEmployees] = useState(() => getStoredOrInitial('employees', InitialData.INITIAL_EMPLOYEES));
  const [attendance, setAttendance] = useState(() => getStoredOrInitial('attendance', InitialData.INITIAL_HRM_ATTENDANCE));
  const [leaves, setLeaves] = useState(() => getStoredOrInitial('leaves', InitialData.INITIAL_HRM_LEAVES));
  const [chartOfAccounts, setChartOfAccounts] = useState(() => getStoredOrInitial('chartOfAccounts', InitialData.INITIAL_CHART_OF_ACCOUNTS));
  const [journalEntries, setJournalEntries] = useState(() => getStoredOrInitial('journalEntries', InitialData.INITIAL_JOURNAL_ENTRIES));
  const [bom, setBom] = useState(() => getStoredOrInitial('bom', InitialData.INITIAL_MANUFACTURING_BOM));
  const [assets, setAssets] = useState(() => getStoredOrInitial('assets', InitialData.INITIAL_ASSETS));
  const [warranties, setWarranties] = useState(() => getStoredOrInitial('warranties', InitialData.INITIAL_WARRANTIES));
  const [serviceTickets, setServiceTickets] = useState(() => getStoredOrInitial('serviceTickets', InitialData.INITIAL_SERVICE_TICKETS));
  const [tasks, setTasks] = useState(() => getStoredOrInitial('tasks', InitialData.INITIAL_TASKS));
  const [documents, setDocuments] = useState(() => getStoredOrInitial('documents', InitialData.INITIAL_DOCUMENTS));
  const [auditLogs, setAuditLogs] = useState(() => getStoredOrInitial('auditLogs', InitialData.INITIAL_AUDIT_LOGS));

  // Current session config
  const [currentCompany, setCurrentCompany] = useState(() => getStoredOrInitial('currentCompany', InitialData.INITIAL_COMPANIES[0]));
  const [currentUser, setCurrentUser] = useState(() => getStoredOrInitial('currentUser', InitialData.INITIAL_USERS[0]));
  const [currentLanguage, setCurrentLanguage] = useState(() => getStoredOrInitial('currentLanguage', 'en'));
  const [theme, setTheme] = useState(() => getStoredOrInitial('theme', 'dark'));

  // Sync to local storage
  useEffect(() => {
    const data = {
      companies, branches, warehouses, roles, users, categories, brands, products,
      stockMovements, customers, leads, commLogs, suppliers, purchaseOrders, salesOrders,
      employees, attendance, leaves, chartOfAccounts, journalEntries, bom, assets,
      warranties, serviceTickets, tasks, documents, auditLogs, currentCompany, currentUser,
      currentLanguage, theme
    };
    Object.keys(data).forEach(key => {
      localStorage.setItem(`erp_${key}`, JSON.stringify(data[key]));
    });
  }, [
    companies, branches, warehouses, roles, users, categories, brands, products,
    stockMovements, customers, leads, commLogs, suppliers, purchaseOrders, salesOrders,
    employees, attendance, leaves, chartOfAccounts, journalEntries, bom, assets,
    warranties, serviceTickets, tasks, documents, auditLogs, currentCompany, currentUser,
    currentLanguage, theme
  ]);

  // Apply dark mode theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Logging utility
  const addAuditLog = (action, entity, details) => {
    const newLog = {
      id: `aud_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      action,
      entity,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 1. INVENTORY ACTIONS
  const addProduct = (p) => {
    const newP = { id: `p_${Date.now()}`, ...p, lifecycleStatus: 'Active' };
    setProducts(prev => [newP, ...prev]);
    addAuditLog('Create', 'Product', `Added new product ${newP.name} [SKU: ${newP.sku}]`);
  };

  const updateProduct = (id, updated) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    addAuditLog('Update', 'Product', `Updated product details for ID: ${id}`);
  };

  const deleteProduct = (id) => {
    const p = products.find(prod => prod.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addAuditLog('Delete', 'Product', `Deleted product ${p ? p.name : id}`);
  };

  const addStockMovement = (m) => {
    const newMove = { id: `m_${Date.now()}`, date: new Date().toISOString(), ...m };
    setStockMovements(prev => [newMove, ...prev]);

    // Update the local product variant stock level
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        let isUpdated = false;
        const nextVariants = p.variants.map(v => {
          if (v.id === m.variantId) {
            isUpdated = true;
            let stockDiff = m.qty;
            if (m.type === 'OUT') stockDiff = -m.qty;
            if (m.type === 'ADJ') stockDiff = m.qty; // m.qty can be positive or negative
            if (m.type === 'TRANSFER' && m.warehouseFromId && !m.warehouseToId) stockDiff = -m.qty; // out transfer
            if (m.type === 'TRANSFER' && !m.warehouseFromId && m.warehouseToId) stockDiff = m.qty; // in transfer
            // if transferring between warehouses locally tracked in variants, total stock doesn't change, only warehouse stocks
            return { ...v, stock: Math.max(0, v.stock + stockDiff) };
          }
          return v;
        });
        return isUpdated ? { ...p, variants: nextVariants } : p;
      });
    });

    addAuditLog('Stock Movement', 'Inventory', `${m.type} of qty ${Math.abs(m.qty)} for variant ID: ${m.variantId}`);
  };

  const executeInventoryTransfer = (variantId, fromWhId, toWhId, qty, reference) => {
    const notes = `Transfer from ${warehouses.find(w => w.id === fromWhId)?.name} to ${warehouses.find(w => w.id === toWhId)?.name}`;
    addStockMovement({
      variantId,
      warehouseId: fromWhId,
      type: 'TRANSFER',
      qty: qty,
      reference,
      warehouseFromId: fromWhId,
      warehouseToId: toWhId,
      notes: `${notes} - Source Outflow`
    });
    addAuditLog('Transfer', 'Inventory', `Transferred qty ${qty} of variant ${variantId} from ${fromWhId} to ${toWhId}`);
  };

  // 2. SALES & POS ACTIONS
  const createSalesOrder = (order) => {
    const newOrder = {
      id: `SO-${new Date().getFullYear()}-${String(salesOrders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      ...order
    };
    setSalesOrders(prev => [newOrder, ...prev]);

    // Deduct stock for all items
    order.items.forEach(item => {
      addStockMovement({
        variantId: item.variantId,
        warehouseId: order.warehouseId || warehouses[0].id,
        type: 'OUT',
        qty: item.qty,
        reference: newOrder.id,
        notes: 'Sales Order Fulfillment'
      });
    });

    // Update Customer loyalty & wallet & CLV
    setCustomers(prev => prev.map(c => {
      if (c.id === order.customerId) {
        const addedPoints = Math.floor(order.total / 10);
        return {
          ...c,
          loyaltyPoints: c.loyaltyPoints + addedPoints,
          clv: c.clv + order.total,
          walletBalance: order.paymentMethod === 'Wallet' ? Math.max(0, c.walletBalance - order.total) : c.walletBalance
        };
      }
      return c;
    }));

    // Record accounting entry
    // Dr. Accounts Receivable or Cash / Bank (Asset Increase)
    // Cr. Sales Revenue (Revenue Increase)
    const bankAccount = chartOfAccounts.find(a => a.code === '1020');
    const salesRevenue = chartOfAccounts.find(a => a.code === '4010');
    
    if (bankAccount && salesRevenue) {
      const journalLines = [
        { accountCode: order.paymentStatus === 'Paid' ? '1020' : '1050', debit: order.total, credit: 0 },
        { accountCode: '4010', debit: 0, credit: order.total }
      ];
      createJournalEntry({
        description: `Revenue from Sales Order ${newOrder.id}`,
        lines: journalLines
      });
    }

    addAuditLog('Create', 'Sales Order', `Created ${newOrder.id} for Total: $${order.total}`);
    return newOrder;
  };

  // 3. PURCHASE & PROCUREMENT ACTIONS
  const createPurchaseOrder = (po) => {
    const newPO = {
      id: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      ...po
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    addAuditLog('Create', 'Purchase Order', `Created Purchase Order ${newPO.id} to Supplier: ${po.supplierId}`);
    return newPO;
  };

  const receiveGoods = (poId, receivedItems, warehouseId) => {
    // Set PO as Received
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        return { ...po, status: 'Received', paymentStatus: 'Paid' };
      }
      return po;
    }));

    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    // Add Stock IN
    receivedItems.forEach(item => {
      addStockMovement({
        variantId: item.variantId,
        warehouseId: warehouseId || po.warehouseId || warehouses[0].id,
        type: 'IN',
        qty: item.qty,
        reference: poId,
        notes: 'Goods Received from PO',
        batchNo: item.batchNo,
        expiryDate: item.expiryDate
      });
    });

    // Accounting Entries:
    // Dr. Inventory Asset Value (Asset Increase)
    // Cr. Main Checking Bank or Accounts Payable
    const costTotal = receivedItems.reduce((acc, curr) => acc + (curr.cost * curr.qty), 0);
    createJournalEntry({
      description: `Stock receipt from PO ${poId}`,
      lines: [
        { accountCode: '1100', debit: costTotal, credit: 0 },
        { accountCode: '1020', debit: 0, credit: costTotal }
      ]
    });

    addAuditLog('Receive', 'Purchase Order', `Received goods for PO ${poId} into Warehouse ${warehouseId}`);
  };

  // 4. CRM ACTIONS
  const addCustomer = (c) => {
    const newC = { id: `c_${Date.now()}`, loyaltyPoints: 0, walletBalance: 0, clv: 0, ...c };
    setCustomers(prev => [...prev, newC]);
    addAuditLog('Create', 'Customer', `Added customer ${newC.name}`);
  };

  const updateCustomer = (id, updated) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    addAuditLog('Update', 'Customer', `Updated customer profile ${id}`);
  };

  const addLead = (l) => {
    const newL = { id: `l_${Date.now()}`, pipelineStage: 'Discovery', status: 'Contacted', ...l };
    setLeads(prev => [...prev, newL]);
    addAuditLog('Create', 'Lead', `Added sales lead ${newL.name}`);
  };

  const updateLeadStage = (id, stage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, pipelineStage: stage } : l));
    addAuditLog('Update', 'Lead', `Moved lead ${id} to stage ${stage}`);
  };

  const addCommLog = (log) => {
    const newLog = { id: `comm_${Date.now()}`, date: new Date().toISOString(), operator: currentUser.id, ...log };
    setCommLogs(prev => [newLog, ...prev]);
  };

  // 5. ACCOUNTING & EXPENSES ACTIONS
  const createJournalEntry = (je) => {
    const newJE = {
      id: je.id || `JE-${new Date().getFullYear()}-${String(journalEntries.length + 1).padStart(3, '0')}`,
      date: je.date || new Date().toISOString().split('T')[0],
      status: 'Posted',
      ...je
    };

    setJournalEntries(prev => [newJE, ...prev]);

    // Recalculate Chart of Accounts balances based on Debits & Credits
    setChartOfAccounts(prevAccounts => {
      return prevAccounts.map(acc => {
        let balanceChange = 0;
        newJE.lines.forEach(line => {
          if (line.accountCode === acc.code) {
            // Asset & Expense increase on Debit, decrease on Credit
            // Liability, Equity & Revenue increase on Credit, decrease on Debit
            const isDebitIncrease = acc.type === 'Asset' || acc.type === 'Expense';
            if (isDebitIncrease) {
              balanceChange += (line.debit - line.credit);
            } else {
              balanceChange += (line.credit - line.debit);
            }
          }
        });
        return balanceChange !== 0 ? { ...acc, balance: parseFloat((acc.balance + balanceChange).toFixed(2)) } : acc;
      });
    });

    addAuditLog('Create', 'Journal Entry', `Posted journal transaction: ${newJE.description}`);
  };

  const recordExpense = (exp) => {
    // exp: { category, amount, paymentAccountCode, description }
    // Dr. Expenses account
    // Cr. Cash/Bank account
    const expenseAccountCode = exp.category === 'Salaries' ? '5100' :
                           exp.category === 'Utilities' ? '5200' :
                           exp.category === 'Marketing' ? '5300' : '5200'; // fallback to rent/utility

    createJournalEntry({
      description: `Expense: ${exp.description || exp.category}`,
      lines: [
        { accountCode: expenseAccountCode, debit: exp.amount, credit: 0 },
        { accountCode: exp.paymentAccountCode || '1020', debit: 0, credit: exp.amount }
      ]
    });
  };

  // 6. HRM ACTIONS
  const addEmployee = (emp) => {
    const newEmp = { id: `emp_${Date.now()}`, status: 'Active', ...emp };
    setEmployees(prev => [...prev, newEmp]);
    addAuditLog('Create', 'Employee', `Registered employee ${newEmp.name}`);
  };

  const markAttendance = (empId, details) => {
    const date = new Date().toISOString().split('T')[0];
    const newAtt = {
      id: `att_${Date.now()}`,
      employeeId: empId,
      date,
      clockIn: details.clockIn || '09:00 AM',
      clockOut: details.clockOut || '05:00 PM',
      status: details.status || 'Present'
    };
    setAttendance(prev => [newAtt, ...prev]);
  };

  // 7. MANUFACTURING ACTIONS
  const createProductionOrder = (prodOrder) => {
    // prodOrder: { bomId, qtyToProduce, notes }
    const selectedBom = bom.find(b => b.id === prodOrder.bomId);
    if (!selectedBom) return;

    const targetProduct = products.find(p => p.id === selectedBom.productId);
    if (!targetProduct) return;

    // Deduct raw materials from warehouse
    selectedBom.rawMaterials.forEach(rm => {
      const rmQty = rm.qtyNeeded * prodOrder.qtyToProduce;
      addStockMovement({
        variantId: rm.variantId,
        warehouseId: warehouses[0].id,
        type: 'OUT',
        qty: rmQty,
        reference: `PROD-${selectedBom.id}`,
        notes: `Production Consumption for BOM ${selectedBom.name}`
      });
    });

    // Add finished goods to warehouse (take first variant of finished good for simplicity)
    const finishedVariantId = targetProduct.variants[0].id;
    addStockMovement({
      variantId: finishedVariantId,
      warehouseId: warehouses[0].id,
      type: 'IN',
      qty: prodOrder.qtyToProduce,
      reference: `PROD-${selectedBom.id}`,
      notes: `Finished Goods production from BOM ${selectedBom.name}`
    });

    // Journal Entry for COGS adjustment
    // Dr. Inventory Asset Value (Add finished product cost)
    // Cr. Raw Materials / Cash for labour ops
    const totalMaterialsCost = selectedBom.rawMaterials.reduce((sum, item) => {
      const rawProd = products.find(rp => rp.variants.some(v => v.id === item.variantId));
      const rawVariant = rawProd?.variants.find(v => v.id === item.variantId);
      return sum + (rawVariant ? rawVariant.cost * item.qtyNeeded : 0);
    }, 0);

    const totalProdCost = (totalMaterialsCost + selectedBom.operationsCost) * prodOrder.qtyToProduce;
    createJournalEntry({
      description: `Production Cost Allocation for BOM: ${selectedBom.name}`,
      lines: [
        { accountCode: '1100', debit: totalProdCost, credit: 0 },
        { accountCode: '1010', debit: 0, credit: totalProdCost } // draw cash
      ]
    });

    addAuditLog('Manufacture', 'Production', `Produced ${prodOrder.qtyToProduce} units of ${targetProduct.name}`);
  };

  // 8. ASSETS & DEPRECIATION
  const runMonthlyDepreciation = () => {
    // Calculates depreciation for all assets and logs journal entries
    assets.forEach(asset => {
      if (asset.status !== 'In Service') return;
      const monthlyDepr = parseFloat((asset.value / asset.usefulLifeMonths).toFixed(2));

      // Update asset accumulated depreciation
      setAssets(prev => prev.map(a => {
        if (a.id === asset.id) {
          return { ...a, accumulatedDepreciation: Math.min(a.value, a.accumulatedDepreciation + monthlyDepr) };
        }
        return a;
      }));

      // Dr. Depreciation Expense (5400)
      // Cr. Accumulated Depreciation (1550)
      createJournalEntry({
        description: `Monthly Depreciation for Asset: ${asset.name}`,
        lines: [
          { accountCode: '5400', debit: monthlyDepr, credit: 0 },
          { accountCode: '1550', debit: 0, credit: monthlyDepr }
        ]
      });
    });

    addAuditLog('Depreciate', 'Assets', 'Executed monthly asset depreciation updates across all registered capital items.');
  };

  // 9. SERVICE & WARRANTY ACTIONS
  const registerWarranty = (w) => {
    const newW = { id: `warr_${Date.now()}`, status: 'Active', ...w };
    setWarranties(prev => [...prev, newW]);
    addAuditLog('Create', 'Warranty', `Registered serial warranty SN: ${w.serialNo}`);
  };

  const createServiceTicket = (t) => {
    const newT = { id: `tix_${Date.now()}`, date: new Date().toISOString().split('T')[0], status: 'In Progress', ...t };
    setServiceTickets(prev => [newT, ...prev]);
    addAuditLog('Create', 'Service Ticket', `Opened service ticket for Customer: ${t.customerId}`);
  };

  const updateTicketStatus = (id, status) => {
    setServiceTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    addAuditLog('Update', 'Service Ticket', `Updated ticket ${id} to ${status}`);
  };

  // 10. TASK & CALENDAR ACTIONS
  const addTask = (t) => {
    const newT = { id: `tsk_${Date.now()}`, status: 'Pending', ...t };
    setTasks(prev => [newT, ...prev]);
    addAuditLog('Create', 'Task', `Assigned task: ${t.title}`);
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
  };

  // 11. DOCUMENTS ACTIONS
  const uploadDocument = (doc) => {
    const newDoc = {
      id: `doc_${Date.now()}`,
      version: '1.0',
      uploadedBy: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      ...doc
    };
    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog('Upload', 'Document', `Uploaded document: ${doc.name}`);
  };

  return (
    <AppDataContext.Provider value={{
      companies, setCompanies,
      branches, setBranches,
      warehouses, setWarehouses,
      roles, setRoles,
      users, setUsers,
      categories, setCategories,
      brands, setBrands,
      products, setProducts, addProduct, updateProduct, deleteProduct,
      stockMovements, setStockMovements, addStockMovement, executeInventoryTransfer,
      customers, setCustomers, addCustomer, updateCustomer,
      leads, setLeads, addLead, updateLeadStage,
      commLogs, setCommLogs, addCommLog,
      suppliers, setSuppliers,
      purchaseOrders, setPurchaseOrders, createPurchaseOrder, receiveGoods,
      salesOrders, setSalesOrders, createSalesOrder,
      employees, setEmployees, addEmployee,
      attendance, setAttendance, markAttendance,
      leaves, setLeaves,
      chartOfAccounts, setChartOfAccounts,
      journalEntries, setJournalEntries, createJournalEntry, recordExpense,
      bom, setBom, createProductionOrder,
      assets, setAssets, runMonthlyDepreciation,
      warranties, setWarranties, registerWarranty,
      serviceTickets, setServiceTickets, createServiceTicket, updateTicketStatus,
      tasks, setTasks, addTask, toggleTaskStatus,
      documents, setDocuments, uploadDocument,
      auditLogs, setAuditLogs, addAuditLog,
      currentCompany, setCurrentCompany,
      currentUser, setCurrentUser,
      currentLanguage, setCurrentLanguage,
      theme, setTheme
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
