import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { DashboardIcon, InfoIcon, NotificationIcon, SyncIcon } from '../components/Icons';

export default function Dashboard() {
  const {
    products,
    salesOrders,
    purchaseOrders,
    chartOfAccounts,
    auditLogs,
    currentCompany,
    theme
  } = useAppData();

  const [notificationOpen, setNotificationOpen] = useState(false);

  // 1. Calculations
  const totalRevenue = salesOrders
    .filter(so => so.status !== 'Cancelled')
    .reduce((sum, so) => sum + so.total, 0);

  const totalPurchases = purchaseOrders
    .filter(po => po.status !== 'Cancelled')
    .reduce((sum, po) => sum + po.total, 0);

  // Stock value = sum(stock * cost) for all variants
  const totalStockValue = products.reduce((acc, p) => {
    const productVal = p.variants.reduce((vAcc, v) => vAcc + (v.stock * v.cost), 0);
    return acc + productVal;
  }, 0);

  // Net Profit = Revenue - COGS - Expenses from accounting
  const salesRevenueBalance = chartOfAccounts.find(a => a.code === '4010')?.balance || 0;
  const cogsBalance = chartOfAccounts.find(a => a.code === '5010')?.balance || 0;
  const expenseSalaries = chartOfAccounts.find(a => a.code === '5100')?.balance || 0;
  const expenseRent = chartOfAccounts.find(a => a.code === '5200')?.balance || 0;
  const expenseMarketing = chartOfAccounts.find(a => a.code === '5300')?.balance || 0;
  const expenseDepreciation = chartOfAccounts.find(a => a.code === '5400')?.balance || 0;

  const totalExpenses = cogsBalance + expenseSalaries + expenseRent + expenseMarketing + expenseDepreciation;
  const calculatedProfit = salesRevenueBalance - totalExpenses;

  // 2. Identify under-stock items
  const lowStockItems = [];
  products.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock <= v.reorderLevel) {
        lowStockItems.push({
          productId: p.id,
          productName: p.name,
          variantName: v.name,
          sku: p.sku,
          stock: v.stock,
          reorderLevel: v.reorderLevel
        });
      }
    });
  });

  // 3. SVG Line Chart coordinates for 12 months (Mock historical sales & purchases trends)
  // Month labels: Jan - Dec
  const salesTrend = [12000, 15000, 18000, 14000, 22000, 26000, 31000, 28000, 35000, 42000, 39000, 48000];
  const purchaseTrend = [8000, 11000, 15000, 10000, 16000, 20000, 25000, 18000, 22000, 30000, 25000, 32000];

  const maxVal = Math.max(...salesTrend, ...purchaseTrend, 10000);
  const chartHeight = 150;
  const chartWidth = 500;

  // Convert trends to SVG points string
  const getSvgPoints = (data) => {
    return data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * chartWidth;
      const y = chartHeight - (val / maxVal) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>Executive Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to {currentCompany.name} central operating panel.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            <SyncIcon size={16} /> Sync Realtime
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <div className="card">
          <div className="card-title">
            <span>Total Sales Revenue</span>
            <span className="trend-up">+14.2%</span>
          </div>
          <div className="card-value">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="card-subtext">Cumulative from invoices and POS</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Procurement Expenses</span>
            <span className="trend-down">+8.4%</span>
          </div>
          <div className="card-value">${totalPurchases.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="card-subtext">Outbound supply chain spend</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Net Operating Profit</span>
            <span className="trend-up">+24.5%</span>
          </div>
          <div className="card-value" style={{ color: calculatedProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            ${calculatedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="card-subtext">Sales revenue minus COGS and SG&A</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>On-Hand Stock Asset</span>
            <span>Total Val</span>
          </div>
          <div className="card-value">${totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="card-subtext">FIFO valuation across warehouses</div>
        </div>
      </div>

      {/* Charts & Graphs Panel */}
      <div className="dashboard-layout">
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">
            <span>Revenue & Procurement Logistics Trends (12 Months)</span>
            <div style={{ display: 'flex', gap: '12px', fontSize: '10px' }}>
              <span style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#c084fc', borderRadius: '50%' }}></span> Revenue
              </span>
              <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></span> Purchases
              </span>
            </div>
          </div>

          <div style={{ flexGrow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: '220px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="purchaseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4" />
              <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4" />
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="var(--border-color)" strokeWidth="1" />

              {/* Sales Area & Line */}
              <polyline points={`0,${chartHeight} ${getSvgPoints(salesTrend)} ${chartWidth},${chartHeight}`} fill="url(#salesGrad)" />
              <polyline points={getSvgPoints(salesTrend)} fill="none" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />

              {/* Purchases Area & Line */}
              <polyline points={`0,${chartHeight} ${getSvgPoints(purchaseTrend)} ${chartWidth},${chartHeight}`} fill="url(#purchaseGrad)" />
              <polyline points={getSvgPoints(purchaseTrend)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />

              {/* Dots on nodes */}
              {salesTrend.map((val, idx) => {
                const x = (idx / (salesTrend.length - 1)) * chartWidth;
                const y = chartHeight - (val / maxVal) * chartHeight;
                return <circle key={`s-${idx}`} cx={x} cy={y} r="4" fill="var(--bg-secondary)" stroke="#c084fc" strokeWidth="2" />;
              })}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Alerts & Critical Stock Levels */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">
            <span>Low-Stock Operations Alerts</span>
            <span style={{ fontSize: '10px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
              {lowStockItems.length} Warnings
            </span>
          </div>

          <div style={{ flexGrow: '1', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px', maxHeight: '240px', overflowY: 'auto' }}>
            {lowStockItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                <p>All stock levels are currently healthy.</p>
              </div>
            ) : (
              lowStockItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--danger)' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{item.productName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.sku} - {item.variantName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--danger)', fontWeight: '700', fontSize: '13px' }}>{item.stock} left</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Min: {item.reorderLevel}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Business Recommendations */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(90deg, rgba(192, 132, 252, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(192, 132, 252, 0.25)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: 'var(--accent)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
            ✨
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>AI Logistics & Demand Forecast Insights</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.4' }}>
              We predict a <strong>15% surge</strong> in <strong>Apparel & Fashion</strong> demands over the next 3 weeks due to seasonal changes. Reordering <strong>EcoShield Eco Jacket (p3-v1)</strong> from supplier <strong>GreenTextiles Co.</strong> is highly advised to avoid out-of-stock scenarios. Barcode scanning logs indicate warehouse processing time is up by 4%—consider shifting rack layout in NYC Warehouse.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activities & Audit Trail */}
      <div className="card">
        <div className="card-title">
          <span>Security Audit Trail & Transaction Logs</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Latest system-wide events</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Action</th>
                <th>Entity Affected</th>
                <th>Log Description</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.slice(0, 5).map((log, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{log.username}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ID: {log.userId}</div>
                  </td>
                  <td>
                    <span className={`status-pill ${log.action.toLowerCase() === 'delete' ? 'cancelled' : 'active'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.entity}</td>
                  <td style={{ fontSize: '13px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={log.details}>
                    {log.details}
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
