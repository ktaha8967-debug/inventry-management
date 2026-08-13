import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PlusIcon, EditIcon } from '../components/Icons';

export default function AssetProduction() {
  const {
    bom,
    products,
    createProductionOrder,
    assets,
    runMonthlyDepreciation,
    warranties,
    registerWarranty,
    serviceTickets,
    createServiceTicket,
    updateTicketStatus,
    documents,
    uploadDocument,
    customers
  } = useAppData();

  const [activeTab, setActiveTab] = useState('mfg'); // 'mfg', 'assets', 'warranty', 'docs'

  // Manufacturing states
  const [selectedBOMId, setSelectedBOMId] = useState(bom[0]?.id || '');
  const [produceQty, setProduceQty] = useState('');

  // Warranty states
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || '');
  const [selectedVarId, setSelectedVarId] = useState(products[0]?.variants[0]?.id || '');
  const [serialNo, setSerialNo] = useState('');
  
  // Ticket states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSerial, setTicketSerial] = useState('');

  // Document states
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('Contracts');
  const [ocrText, setOcrText] = useState(`INVOICE: INV-88941\nSUPPLIER: s1\nDATE: 2026-07-23\nITEM: p1-v1 | QTY: 25 | PRICE: 450.00\nTOTAL: 11250.00`);
  const [ocrResult, setOcrResult] = useState(null);

  // 1. Manufacturing Work Order submit
  const handleProductionSubmit = (e) => {
    e.preventDefault();
    if (!produceQty || !selectedBOMId) return;
    
    createProductionOrder({
      bomId: selectedBOMId,
      qtyToProduce: parseInt(produceQty),
      notes: 'Manufacturing Work Order Direct Run'
    });

    alert(`Finished goods produced! Raw materials consumed from NYC Warehouse and capitalized to inventory ledger accounts.`);
    setProduceQty('');
  };

  // 2. run depreciation workflow trigger
  const runDepreciation = () => {
    runMonthlyDepreciation();
    alert('Depreciation schedules completed. Capital write-offs recorded in general ledgers.');
  };

  // 3. Warranty registration submit
  const submitWarrantyReg = (e) => {
    e.preventDefault();
    if (!serialNo) return;
    
    registerWarranty({
      customerId: selectedCustId,
      variantId: selectedVarId,
      serialNo,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: '2028-06-30'
    });

    alert(`Serial number ${serialNo} registered successfully.`);
    setSerialNo('');
  };

  // 4. Service Ticket submit
  const submitServiceTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    createServiceTicket({
      customerId: selectedCustId,
      serviceType: 'Maintenance Request',
      subject: ticketSubject,
      description: ticketDescription,
      serialNo: ticketSerial || undefined,
      priority: 'Medium'
    });

    alert('Service ticket registered and assigned to customer support.');
    setTicketSubject('');
    setTicketDescription('');
    setTicketSerial('');
  };

  // 5. OCR Simulator run
  const runOcrScan = () => {
    // Simulated parser
    const lines = ocrText.split('\n');
    let invNo = 'Unknown';
    let total = 0;
    let supplierId = 'Unknown';
    let parsedItems = [];

    lines.forEach(l => {
      if (l.startsWith('INVOICE:')) invNo = l.replace('INVOICE:', '').trim();
      if (l.startsWith('SUPPLIER:')) supplierId = l.replace('SUPPLIER:', '').trim();
      if (l.startsWith('TOTAL:')) total = parseFloat(l.replace('TOTAL:', '').trim()) || 0;
      if (l.startsWith('ITEM:')) {
        const parts = l.replace('ITEM:', '').split('|');
        const vId = parts[0]?.trim();
        const qty = parseInt(parts[1]?.replace('QTY:', '').trim()) || 0;
        const price = parseFloat(parts[2]?.replace('PRICE:', '').trim()) || 0;
        parsedItems.push({ vId, qty, price });
      }
    });

    setOcrResult({
      invNo,
      supplierId,
      total,
      items: parsedItems
    });
    alert('OCR analysis complete. Mapped text fields parsed into transaction structure.');
  };

  // Document upload
  const handleDocUpload = (e) => {
    e.preventDefault();
    if (!docName) return;

    uploadDocument({
      name: docName,
      category: docCategory,
      size: '1.2 MB'
    });

    alert('Document registered in digital archives.');
    setDocName('');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>Operations, Assets & Manufacturing</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Bill of Materials production, fixed asset depreciation, warranties, and OCR document registers.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'mfg' ? 'active' : ''}`} onClick={() => setActiveTab('mfg')}>Manufacturing (BOM)</button>
        <button className={`tab-btn ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => setActiveTab('assets')}>Fixed Capital Assets</button>
        <button className={`tab-btn ${activeTab === 'warranty' ? 'active' : ''}`} onClick={() => setActiveTab('warranty')}>Warranties & Repairs</button>
        <button className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>OCR & Archives</button>
      </div>

      {/* 1. MANUFACTURING WORK ORDERS */}
      {activeTab === 'mfg' && (
        <div className="grid-2">
          {/* Work Order dispatcher */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Dispatch Production Work Order</h3>
            <form onSubmit={handleProductionSubmit}>
              <div className="form-group">
                <label>Select BOM Recipe Formula</label>
                <select
                  className="form-control"
                  value={selectedBOMId}
                  onChange={e => setSelectedBOMId(e.target.value)}
                  required
                >
                  {bom.map(b => {
                    const targetProd = products.find(p => p.id === b.productId);
                    return <option key={b.id} value={b.id}>{b.name} (Produces: {targetProd?.name})</option>;
                  })}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity to Produce</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 50"
                  value={produceQty}
                  onChange={e => setProduceQty(e.target.value)}
                  required
                />
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
                <p><strong>BOM Material Check:</strong> Production consumes structural raw metal plates and applies custom operations costs ($15.00/unit) to general ledger capital accounts.</p>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Execute Production Work Order</button>
            </form>
          </div>

          {/* BOM Listing catalog */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Formulas (Bill of Materials) Registry</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bom.map(b => {
                const target = products.find(p => p.id === b.productId);
                return (
                  <div key={b.id} style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>{b.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Yields Finished Good: {target?.name}</div>
                    <div style={{ fontSize: '12px', marginTop: '8px' }}>
                      <strong>Consumes:</strong>
                      <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                        {b.rawMaterials.map((rm, idx) => {
                          const rmProd = products.find(rp => rp.variants.some(v => v.id === rm.variantId));
                          return <li key={idx}>{rm.qtyNeeded} {rm.unit} of {rmProd?.name}</li>;
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. FIXED CAPITAL ASSETS */}
      {activeTab === 'assets' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px' }}>Capital Asset Registry & Schedules</h3>
            <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={runDepreciation}>
              ⚡ Run Depreciation Schedules
            </button>
          </div>

          <div className="card" style={{ padding: '0' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Category</th>
                    <th>Useful Life</th>
                    <th>Purchase Date</th>
                    <th>Initial Cost</th>
                    <th>Acc. Depreciation</th>
                    <th style={{ textAlign: 'right' }}>Net Book Value</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.id}>
                      <td style={{ fontWeight: '700' }}>{asset.name}</td>
                      <td>{asset.category}</td>
                      <td>{asset.usefulLifeMonths} months ({asset.depreciationMethod})</td>
                      <td>{asset.purchaseDate}</td>
                      <td style={{ fontWeight: '600' }}>${asset.value.toLocaleString()}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: '600' }}>
                        -${asset.accumulatedDepreciation.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--success)' }}>
                        ${(asset.value - asset.accumulatedDepreciation).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. WARRANTIES & REPAIRS */}
      {activeTab === 'warranty' && (
        <div className="grid-2">
          {/* Left panel: registration and ticket forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Warranty Registry */}
            <div className="card">
              <h3 style={{ marginBottom: '12px', fontSize: '14px' }}>Register Product Serial Warranty</h3>
              <form onSubmit={submitWarrantyReg}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Select Customer</label>
                    <select className="form-control" value={selectedCustId} onChange={e => setSelectedCustId(e.target.value)}>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Product Variant</label>
                    <select className="form-control" value={selectedVarId} onChange={e => setSelectedVarId(e.target.value)}>
                      {products.map(p => p.variants.map(v => (
                        <option key={v.id} value={v.id}>{p.name} - {v.name}</option>
                      )))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Serial Number (SN)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. SN-APPH14-99850"
                    value={serialNo}
                    onChange={e => setSerialNo(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>Log Warranty Certificate</button>
              </form>
            </div>

            {/* Service Ticket Form */}
            <div className="card">
              <h3 style={{ marginBottom: '12px', fontSize: '14px' }}>File Support Service Ticket</h3>
              <form onSubmit={submitServiceTicket}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Client</label>
                    <select className="form-control" value={selectedCustId} onChange={e => setSelectedCustId(e.target.value)}>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Serial No (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="SN Reference"
                      value={ticketSerial}
                      onChange={e => setTicketSerial(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ticket Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fault / Repair Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={ticketDescription}
                    onChange={e => setTicketDescription(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>Open Ticket</button>
              </form>
            </div>
          </div>

          {/* Right panel: tickets status list */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Support Center Ticket Ledger</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {serviceTickets.map(ticket => {
                const cust = customers.find(c => c.id === ticket.customerId);
                return (
                  <div key={ticket.id} style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <div className="flex-between">
                      <span style={{ fontWeight: '700' }}>Ticket: {ticket.subject}</span>
                      <span className={`status-pill ${ticket.status === 'Completed' ? 'active' : 'pending'}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Client: {cust?.name} | SN Ref: {ticket.serialNo || 'None'}</div>
                    <p style={{ fontSize: '12px', marginTop: '6px' }}>"{ticket.description}"</p>
                    {ticket.status !== 'Completed' && (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={() => updateTicketStatus(ticket.id, 'Completed')}>
                          Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. OCR SCANNER & DIGITAL ARCHIVE */}
      {activeTab === 'docs' && (
        <div className="grid-2">
          {/* OCR scan box */}
          <div className="card">
            <h3 style={{ marginBottom: '12px', fontSize: '15px' }}>✨ AI-powered OCR Invoice Reader</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Paste scanning results of a supplier invoice below. Our OCR engine parses items and supplier targets.
            </p>
            <div className="form-group">
              <label>OCR Text Stream</label>
              <textarea
                className="form-control"
                rows="6"
                value={ocrText}
                onChange={e => setOcrText(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={runOcrScan}>
              Execute OCR Extraction
            </button>

            {ocrResult && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '12px' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '8px', color: 'var(--accent)' }}>Extracted Structures</h4>
                <div><strong>Invoice Reference:</strong> {ocrResult.invNo}</div>
                <div><strong>Mapped Supplier ID:</strong> {ocrResult.supplierId}</div>
                <div><strong>Total Billing Amount:</strong> ${ocrResult.total.toFixed(2)}</div>
                <div style={{ marginTop: '8px' }}>
                  <strong>Line Items:</strong>
                  {ocrResult.items.map((item, idx) => (
                    <div key={idx} style={{ paddingLeft: '8px' }}>
                      - Variant {item.vId} | Qty: {item.qty} | Price: ${item.price}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Document Archive */}
          <div className="card">
            <h3 style={{ marginBottom: '14px', fontSize: '15px' }}>Digital Contracts & Version Registry</h3>
            
            <form onSubmit={handleDocUpload} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Contract Name.pdf"
                className="form-control"
                value={docName}
                onChange={e => setDocName(e.target.value)}
                required
              />
              <select className="form-control" style={{ width: '120px' }} value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                <option value="Contracts">Contract</option>
                <option value="Financials">Financial</option>
                <option value="HR Docs">HR Doc</option>
              </select>
              <button type="submit" className="btn btn-secondary">Upload</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {documents.map(doc => (
                <div key={doc.id} style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <div className="flex-between">
                    <span style={{ fontWeight: '700', fontSize: '13px' }}>{doc.name}</span>
                    <span className="status-pill active" style={{ fontSize: '9px', backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
                      v{doc.version}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Uploaded: {doc.uploadDate} by {doc.uploadedBy}</span>
                    <span>Size: {doc.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
