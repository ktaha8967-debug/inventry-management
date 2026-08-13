import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PlusIcon } from '../components/Icons';

export default function Accounting() {
  const {
    chartOfAccounts,
    journalEntries,
    createJournalEntry
  } = useAppData();

  const [activeTab, setActiveTab] = useState('chart'); // 'chart', 'journal', 'reports'
  const [reportTab, setReportTab] = useState('pl'); // 'pl', 'balance', 'trial'

  // Journal Poster State
  const [jeModalOpen, setJeModalOpen] = useState(false);
  const [jeDescription, setJeDescription] = useState('');
  const [jeDate, setJeDate] = useState(new Date().toISOString().split('T')[0]);
  const [jeLines, setJeLines] = useState([
    { accountCode: '', debit: 0, credit: 0 },
    { accountCode: '', debit: 0, credit: 0 }
  ]);

  // 1. Journal Entry Line handlers
  const handleAddJeLine = () => {
    setJeLines([...jeLines, { accountCode: '', debit: 0, credit: 0 }]);
  };

  const handleUpdateJeLine = (idx, field, value) => {
    const nextLines = jeLines.map((line, i) => {
      if (i === idx) {
        let val = value;
        if (field === 'debit' || field === 'credit') {
          val = parseFloat(value) || 0;
        }
        return { ...line, [field]: val };
      }
      return line;
    });
    setJeLines(nextLines);
  };

  const submitJournalPost = (e) => {
    e.preventDefault();

    // Sum checking
    const totalDebit = jeLines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = jeLines.reduce((sum, l) => sum + l.credit, 0);

    if (parseFloat(totalDebit.toFixed(2)) !== parseFloat(totalCredit.toFixed(2))) {
      alert(`Accounting Validation Error: Debits ($${totalDebit}) must equal Credits ($${totalCredit}). Variance: $${Math.abs(totalDebit - totalCredit)}`);
      return;
    }

    createJournalEntry({
      date: jeDate,
      description: jeDescription,
      lines: jeLines.filter(l => l.accountCode && (l.debit > 0 || l.credit > 0))
    });

    alert('General Journal Entry posted. Sub-ledgers reconciled.');
    setJeModalOpen(false);
    setJeDescription('');
    setJeLines([
      { accountCode: '', debit: 0, credit: 0 },
      { accountCode: '', debit: 0, credit: 0 }
    ]);
  };

  // 2. Financial Calculations
  const assetTotal = chartOfAccounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const liabilityTotal = chartOfAccounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0);
  const equityTotal = chartOfAccounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0);
  
  // Profit & Loss variables
  const revenueTotal = chartOfAccounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
  const cogsTotal = chartOfAccounts.find(a => a.code === '5010')?.balance || 0;
  const expenseTotal = chartOfAccounts.filter(a => a.type === 'Expense' && a.code !== '5010').reduce((sum, a) => sum + a.balance, 0);
  
  const grossProfit = revenueTotal - cogsTotal;
  const netOperatingIncome = grossProfit - expenseTotal;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>Double-Entry Accounting & Ledgers</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Audit chart of accounts, post journal adjustments, and generate real-time statements.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setJeModalOpen(true)}>
            <PlusIcon size={16} /> New Journal Entry
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'chart' ? 'active' : ''}`} onClick={() => setActiveTab('chart')}>Chart of Accounts (COA)</button>
        <button className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>General Journal Register</button>
        <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Financial Statements</button>
      </div>

      {/* 1. CHART OF ACCOUNTS */}
      {activeTab === 'chart' && (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Name</th>
                  <th>Primary Class</th>
                  <th>Sub-Class Type</th>
                  <th style={{ textAlign: 'right' }}>Current Balance</th>
                </tr>
              </thead>
              <tbody>
                {chartOfAccounts.map(account => (
                  <tr key={account.code}>
                    <td style={{ fontWeight: '700' }}>{account.code}</td>
                    <td style={{ fontWeight: '600' }}>{account.name}</td>
                    <td>
                      <span className={`status-pill ${account.type === 'Asset' || account.type === 'Revenue' ? 'active' : account.type === 'Expense' ? 'damaged' : 'pending'}`} style={{ fontSize: '9px' }}>
                        {account.type}
                      </span>
                    </td>
                    <td>{account.subType}</td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: account.balance < 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                      ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. GENERAL JOURNAL REGISTER */}
      {activeTab === 'journal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {journalEntries.map(entry => (
            <div key={entry.id} className="card" style={{ padding: '16px' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--accent)' }}>{entry.id}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '12px' }}>Date: {entry.date}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{entry.description}</span>
              </div>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textTransform: 'uppercase', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <th style={{ textAlign: 'left', paddingBottom: '6px' }}>Account</th>
                    <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Debit ($)</th>
                    <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Credit ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.lines.map((line, idx) => {
                    const accName = chartOfAccounts.find(a => a.code === line.accountCode)?.name || 'Unknown Account';
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--bg-primary)' }}>
                        <td style={{ padding: '6px 0', paddingLeft: line.credit > 0 ? '20px' : '0', color: line.credit > 0 ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: line.debit > 0 ? 'bold' : 'normal' }}>
                          {line.accountCode} - {accName}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: '600' }}>
                          {line.debit > 0 ? `$${line.debit.toFixed(2)}` : '-'}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--accent)', fontWeight: '600' }}>
                          {line.credit > 0 ? `$${line.credit.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* 3. REPORT TAB */}
      {activeTab === 'reports' && (
        <div>
          {/* Sub Navigation */}
          <div className="tabs-container" style={{ marginBottom: '16px' }}>
            <button className={`tab-btn ${reportTab === 'pl' ? 'active' : ''}`} onClick={() => setReportTab('pl')}>Income Statement (Profit & Loss)</button>
            <button className={`tab-btn ${reportTab === 'balance' ? 'active' : ''}`} onClick={() => setReportTab('balance')}>Balance Sheet</button>
            <button className={`tab-btn ${reportTab === 'trial' ? 'active' : ''}`} onClick={() => setReportTab('trial')}>Trial Balance Reconciled</button>
          </div>

          {/* INCOME STATEMENT P&L */}
          {reportTab === 'pl' && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800' }}>CONSOLIDATED INCOME STATEMENT</h2>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Apex Global Operating Income | Audited Realtime</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  <span style={{ fontWeight: '700' }}>Operating Revenues (Sales 4010)</span>
                  <span style={{ fontWeight: '700' }}>${revenueTotal.toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', paddingLeft: '16px' }}>
                  <span>Cost of Goods Sold (COGS 5010)</span>
                  <span>-${cogsTotal.toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ fontWeight: '700', fontSize: '15px', color: 'var(--accent)', borderBottom: '2px solid var(--border-color)', paddingBottom: '6px' }}>
                  <span>Gross Operating Profit</span>
                  <span>${grossProfit.toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ fontWeight: '700', marginTop: '10px' }}>
                  <span>Selling, General & Administrative Expenses</span>
                  <span>-${expenseTotal.toFixed(2)}</span>
                </div>
                {chartOfAccounts.filter(a => a.type === 'Expense' && a.code !== '5010').map(acc => (
                  <div key={acc.code} className="flex-between" style={{ color: 'var(--text-secondary)', paddingLeft: '16px', fontSize: '12px' }}>
                    <span>{acc.name}</span>
                    <span>${acc.balance.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex-between" style={{ fontWeight: '800', fontSize: '16px', color: netOperatingIncome >= 0 ? 'var(--success)' : 'var(--danger)', borderTop: '2px double var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                  <span>NET OPERATING INCOME</span>
                  <span>${netOperatingIncome.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* BALANCE SHEET */}
          {reportTab === 'balance' && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800' }}>CONSOLIDATED BALANCE SHEET STATEMENT</h2>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Accounting Equation check: Assets = Liabilities + Equity</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)' }}>ASSETS</div>
                {chartOfAccounts.filter(a => a.type === 'Asset').map(acc => (
                  <div key={acc.code} className="flex-between" style={{ paddingLeft: '12px' }}>
                    <span>{acc.name} ({acc.code})</span>
                    <span>${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex-between" style={{ fontWeight: '700', borderBottom: '2px solid var(--border-color)', paddingBottom: '6px', fontSize: '14px' }}>
                  <span>TOTAL ASSETS VALUE</span>
                  <span>${assetTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div style={{ fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)', marginTop: '16px' }}>LIABILITIES</div>
                {chartOfAccounts.filter(a => a.type === 'Liability').map(acc => (
                  <div key={acc.code} className="flex-between" style={{ paddingLeft: '12px' }}>
                    <span>{acc.name} ({acc.code})</span>
                    <span>${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex-between" style={{ fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  <span>TOTAL LIABILITIES</span>
                  <span>${liabilityTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div style={{ fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)', marginTop: '16px' }}>OWNERS' EQUITY</div>
                {chartOfAccounts.filter(a => a.type === 'Equity').map(acc => (
                  <div key={acc.code} className="flex-between" style={{ paddingLeft: '12px' }}>
                    <span>{acc.name} ({acc.code})</span>
                    <span>${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex-between" style={{ paddingLeft: '12px', color: 'var(--success)' }}>
                  <span>Retained Net income (P&L Reconciled)</span>
                  <span>${netOperatingIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex-between" style={{ fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  <span>TOTAL EQUITY VALUE</span>
                  <span> ${(equityTotal + netOperatingIncome).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex-between" style={{ fontWeight: '800', fontSize: '15px', borderTop: '2px double var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                  <span>TOTAL LIABILITIES & EQUITY</span>
                  <span>${(liabilityTotal + equityTotal + netOperatingIncome).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          {/* TRIAL BALANCE */}
          {reportTab === 'trial' && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ textTransform: 'uppercase', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px' }}>
                    <th style={{ textAlign: 'left', paddingBottom: '6px' }}>Account description</th>
                    <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Debit Balance ($)</th>
                    <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Credit Balance ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartOfAccounts.map(account => {
                    const isDebit = account.type === 'Asset' || account.type === 'Expense';
                    const amount = account.balance;
                    return (
                      <tr key={account.code} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px 0' }}>{account.code} - {account.name}</td>
                        <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: '600' }}>
                          {isDebit && amount !== 0 ? `$${Math.abs(amount).toFixed(2)}` : '-'}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--accent)', fontWeight: '600' }}>
                          {!isDebit && amount !== 0 ? `$${Math.abs(amount).toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* JOURNAL POSTER MODAL */}
      {jeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <h3 style={{ marginBottom: '16px' }}>Post New General Ledger Journal Adjustment</h3>
            <form onSubmit={submitJournalPost}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Transaction Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={jeDate}
                    onChange={e => setJeDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Auditor Reference Notes</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Month-end tax reconciliation, inventory write-off..."
                    value={jeDescription}
                    onChange={e => setJeDescription(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px', maxHeight: '250px', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  <span>DEBIT / CREDIT ACCOUNT CODE</span>
                  <span style={{ textAlign: 'right' }}>DEBIT ($)</span>
                  <span style={{ textAlign: 'right' }}>CREDIT ($)</span>
                </div>
                {jeLines.map((line, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
                    <select
                      className="form-control"
                      value={line.accountCode}
                      onChange={e => handleUpdateJeLine(idx, 'accountCode', e.target.value)}
                      required
                    >
                      <option value="">-- Choose Account --</option>
                      {chartOfAccounts.map(a => <option key={a.code} value={a.code}>{a.code} - {a.name} ({a.type})</option>)}
                    </select>

                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      style={{ textAlign: 'right' }}
                      placeholder="0.00"
                      value={line.debit || ''}
                      onChange={e => handleUpdateJeLine(idx, 'debit', e.target.value)}
                    />

                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      style={{ textAlign: 'right' }}
                      placeholder="0.00"
                      value={line.credit || ''}
                      onChange={e => handleUpdateJeLine(idx, 'credit', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <button type="button" className="btn btn-secondary" style={{ width: '100%', marginBottom: '14px' }} onClick={handleAddJeLine}>
                + Add Accounting Ledger Line
              </button>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setJeModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Commit Bookkeeping Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
