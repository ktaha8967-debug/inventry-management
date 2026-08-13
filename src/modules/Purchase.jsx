import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PlusIcon, EditIcon, PurchaseIcon } from '../components/Icons';

export default function Purchase() {
  const {
    suppliers,
    purchaseOrders,
    products,
    createPurchaseOrder,
    receiveGoods
  } = useAppData();

  const [activeTab, setActiveTab] = useState('pos'); // 'pos' represents purchase orders here, 'suppliers' represents vendor logs

  // Re-use variable naming or use local name
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [grnModalOpen, setGrnModalOpen] = useState(false);
  const [activePOId, setActivePOId] = useState('');

  // Purchase Order Wizard State
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]?.id || '');
  const [poItems, setPoItems] = useState([{ variantId: '', qty: 1, cost: 0 }]);

  // Goods Receiving Note State
  const [grnItems, setGrnItems] = useState([]);

  // 1. PO Wizard item updates
  const addPoItemField = () => {
    setPoItems([...poItems, { variantId: '', qty: 1, cost: 0 }]);
  };

  const updatePoItemField = (idx, field, value) => {
    const updated = poItems.map((item, i) => {
      if (i === idx) {
        let val = value;
        if (field === 'variantId') {
          // Look up default product variant cost
          const prod = products.find(p => p.variants.some(v => v.id === value));
          const variant = prod?.variants.find(v => v.id === value);
          return { ...item, variantId: value, cost: variant ? variant.cost : 0 };
        }
        return { ...item, [field]: val };
      }
      return item;
    });
    setPoItems(updated);
  };

  const submitPO = (e) => {
    e.preventDefault();
    const cleanItems = poItems.filter(item => item.variantId && item.qty > 0);
    if (cleanItems.length === 0) {
      alert('Add at least one product variant item.');
      return;
    }

    const totalPOVal = cleanItems.reduce((sum, item) => sum + (item.cost * item.qty), 0);

    createPurchaseOrder({
      supplierId: selectedSupplier,
      items: cleanItems,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      total: totalPOVal
    });

    alert('Purchase Requisition PO issued to supplier. Status set to Pending.');
    setPoModalOpen(false);
    setPoItems([{ variantId: '', qty: 1, cost: 0 }]);
  };

  // 2. Goods Receiving Note modal activation
  const handleOpenGRN = (po) => {
    setActivePOId(po.id);
    // Prep list of received items with optional batch tracking details
    const prepItems = po.items.map(item => {
      const prod = products.find(p => p.variants.some(v => v.id === item.variantId));
      return {
        variantId: item.variantId,
        productName: prod?.name || 'Unknown',
        qty: item.qty,
        cost: item.cost,
        batchNo: prod?.batchTracking ? 'BT-' + Date.now().toString().slice(-4) : '',
        expiryDate: prod?.batchTracking ? '2027-12-31' : ''
      };
    });
    setGrnItems(prepItems);
    setGrnModalOpen(true);
  };

  const submitGRN = (e) => {
    e.preventDefault();
    receiveGoods(activePOId, grnItems);
    alert(`Inventory successfully received for PO ${activePOId}. Warehouse stock refreshed.`);
    setGrnModalOpen(false);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>Procurement & Purchase Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage supplier relationships, issue RFQs / POs, and audit incoming shipments.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setPoModalOpen(true)}>
            <PlusIcon size={16} /> New PO Requisition
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>Purchase Orders (PO)</button>
        <button className={`tab-btn ${activeTab === 'suppliers' ? 'active' : ''}`} onClick={() => setActiveTab('suppliers')}>Supplier Registry</button>
      </div>

      {/* 1. PURCHASE ORDERS LEDGER */}
      {activeTab === 'pos' && (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>PO Reference</th>
                  <th>Supplier / Vendor</th>
                  <th>Order Date</th>
                  <th>Purchased Items</th>
                  <th>Payment State</th>
                  <th>Logistics State</th>
                  <th style={{ textAlign: 'right' }}>Actions / GRN</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map(po => {
                  const supplier = suppliers.find(s => s.id === po.supplierId);
                  return (
                    <tr key={po.id}>
                      <td style={{ fontWeight: '700' }}>{po.id}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{supplier?.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Rating: {supplier?.rating} ⭐</div>
                      </td>
                      <td>{po.date}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                          {po.items.map((item, idx) => {
                            const prod = products.find(p => p.variants.some(v => v.id === item.variantId));
                            const variant = prod?.variants.find(v => v.id === item.variantId);
                            return (
                              <div key={idx} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>
                                {prod?.name} ({variant?.name}) x{item.qty}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${po.paymentStatus.toLowerCase()}`}>
                          {po.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${po.status.toLowerCase()}`}>
                          {po.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {po.status === 'Pending' ? (
                          <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleOpenGRN(po)}>
                            Receive Stock
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fulfillment Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUPPLIERS REGISTRY */}
      {activeTab === 'suppliers' && (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vendor details</th>
                  <th>Primary Representative</th>
                  <th>Category Coverage</th>
                  <th>Vendor Performance</th>
                  <th>Contract Status</th>
                  <th style={{ textAlign: 'right' }}>Contact Email</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.address}</div>
                    </td>
                    <td>{s.contact}</td>
                    <td>{s.category}</td>
                    <td>
                      <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                        {'★'.repeat(Math.floor(s.rating))}
                        {s.rating % 1 !== 0 ? '½' : ''}
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>({s.rating})</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${s.status === 'Active' ? 'active' : 'pending'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>{s.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PO REQUISITION WORKFLOW MODAL */}
      {poModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px' }}>Issue New Purchase Requisition PO</h3>
            <form onSubmit={submitPO}>
              <div className="form-group">
                <label>Select Target Supplier Vendor</label>
                <select
                  className="form-control"
                  value={selectedSupplier}
                  onChange={e => setSelectedSupplier(e.target.value)}
                  required
                >
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.category})</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Item List & Contract Cost Allocation</label>
                {poItems.map((item, idx) => (
                  <div key={idx} className="grid-3" style={{ marginTop: '8px', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <select
                      className="form-control"
                      value={item.variantId}
                      onChange={e => updatePoItemField(idx, 'variantId', e.target.value)}
                      required
                    >
                      <option value="">-- Product --</option>
                      {products.map(p =>
                        p.variants.map(v => (
                          <option key={v.id} value={v.id}>{p.name} - {v.name}</option>
                        ))
                      )}
                    </select>

                    <input
                      type="number"
                      className="form-control"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={e => updatePoItemField(idx, 'qty', parseInt(e.target.value) || 0)}
                      required
                    />

                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Unit Cost ($)"
                      value={item.cost}
                      onChange={e => updatePoItemField(idx, 'cost', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                ))}
              </div>

              <button type="button" className="btn btn-secondary" style={{ width: '100%', marginBottom: '14px' }} onClick={addPoItemField}>
                + Add Another Product Item
              </button>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setPoModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Dispatch PO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GOODS RECEIVING GRN WORKFLOW MODAL */}
      {grnModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px' }}>Goods Receiving Note (GRN) Verification</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Verify batch details, expiries, and serial tracking conditions before locking products into warehouse stock.
            </p>
            <form onSubmit={submitGRN}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                {grnItems.map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>{item.productName} (Qty: {item.qty})</div>
                    <div className="grid-2" style={{ marginTop: '8px' }}>
                      <div className="form-group" style={{ margin: '0' }}>
                        <label>Assigned Batch Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.batchNo}
                          onChange={e => {
                            const next = [...grnItems];
                            next[idx].batchNo = e.target.value;
                            setGrnItems(next);
                          }}
                          placeholder="e.g. BATCH-A4"
                        />
                      </div>
                      <div className="form-group" style={{ margin: '0' }}>
                        <label>Expiration Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={item.expiryDate}
                          onChange={e => {
                            const next = [...grnItems];
                            next[idx].expiryDate = e.target.value;
                            setGrnItems(next);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setGrnModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process GRN & Inward Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
