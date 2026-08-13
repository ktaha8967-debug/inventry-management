import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, BarcodeIcon } from '../components/Icons';

export default function Inventory() {
  const {
    products,
    categories,
    brands,
    warehouses,
    stockMovements,
    addProduct,
    updateProduct,
    deleteProduct,
    addStockMovement,
    executeInventoryTransfer
  } = useAppData();

  // Navigation states
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'adjust', 'transfer', 'ai'

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');

  // Form Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProdId, setCurrentProdId] = useState('');
  const [formData, setFormData] = useState({
    name: '', sku: '', barcode: '', description: '',
    category: 'Electronics', subcategory: 'Smartphones', brand: 'ApexTech',
    price1: '', price2: '', cost1: '', cost2: '', stock1: '', stock2: '',
    taxRate: 8, serialTracking: false, batchTracking: false, warrantyMonths: 12
  });

  // Stock Adjustment Form State
  const [adjustData, setAdjustData] = useState({
    variantId: '',
    warehouseId: warehouses[0]?.id || '',
    type: 'ADJ',
    qty: '',
    notes: '',
    batchNo: '',
    expiryDate: ''
  });

  // Stock Transfer Form State
  const [transferData, setTransferData] = useState({
    variantId: '',
    fromWhId: warehouses[0]?.id || '',
    toWhId: warehouses[1]?.id || '',
    qty: '',
    reference: ''
  });

  // 1. Simulate Barcode Scan
  const handleBarcodeScan = () => {
    // Pick a random product's barcode to simulate a scanning device input
    const validBarcodes = products.map(p => p.barcode);
    const randomBarcode = validBarcodes[Math.floor(Math.random() * validBarcodes.length)];
    setSearchQuery(randomBarcode);
    setActiveTab('products');
    alert(`[Simulated Barcode Scan] Device scanned: "${randomBarcode}". Matches found.`);
  };

  // 2. Add / Edit Product Submit
  const handleProductSubmit = (e) => {
    e.preventDefault();
    const formattedProduct = {
      name: formData.name,
      sku: formData.sku,
      barcode: formData.barcode,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      brand: formData.brand,
      taxRate: parseFloat(formData.taxRate) || 0,
      serialTracking: formData.serialTracking,
      batchTracking: formData.batchTracking,
      warrantyMonths: parseInt(formData.warrantyMonths) || 0,
      variants: [
        {
          id: isEditing ? `${currentProdId}-v1` : `v1_${Date.now()}`,
          name: 'Standard Variant A',
          price: parseFloat(formData.price1) || 0,
          cost: parseFloat(formData.cost1) || 0,
          stock: parseInt(formData.stock1) || 0,
          reorderLevel: 10
        },
        {
          id: isEditing ? `${currentProdId}-v2` : `v2_${Date.now()}`,
          name: 'Premium Variant B',
          price: parseFloat(formData.price2) || 0,
          cost: parseFloat(formData.cost2) || 0,
          stock: parseInt(formData.stock2) || 0,
          reorderLevel: 5
        }
      ]
    };

    if (isEditing) {
      updateProduct(currentProdId, formattedProduct);
    } else {
      addProduct(formattedProduct);
    }
    setProductModalOpen(false);
  };

  const handleEditClick = (p) => {
    setIsEditing(true);
    setCurrentProdId(p.id);
    setFormData({
      name: p.name,
      sku: p.sku,
      barcode: p.barcode,
      description: p.description || '',
      category: p.category,
      subcategory: p.subcategory || '',
      brand: p.brand,
      taxRate: p.taxRate,
      serialTracking: p.serialTracking || false,
      batchTracking: p.batchTracking || false,
      warrantyMonths: p.warrantyMonths || 0,
      price1: p.variants[0]?.price || '',
      price2: p.variants[1]?.price || '',
      cost1: p.variants[0]?.cost || '',
      cost2: p.variants[1]?.cost || '',
      stock1: p.variants[0]?.stock || '',
      stock2: p.variants[1]?.stock || ''
    });
    setProductModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({
      name: '', sku: '', barcode: '', description: '',
      category: 'Electronics', subcategory: 'Smartphones', brand: 'ApexTech',
      price1: '', price2: '', cost1: '', cost2: '', stock1: '', stock2: '',
      taxRate: 8, serialTracking: false, batchTracking: false, warrantyMonths: 12
    });
    setProductModalOpen(true);
  };

  // 3. Stock Adjustment Submission
  const handleStockAdjustmentSubmit = (e) => {
    e.preventDefault();
    if (!adjustData.variantId || !adjustData.qty) return;

    addStockMovement({
      variantId: adjustData.variantId,
      warehouseId: adjustData.warehouseId,
      type: 'ADJ',
      qty: parseInt(adjustData.qty),
      reference: 'ADJ-' + Date.now().toString().slice(-6),
      notes: adjustData.notes,
      batchNo: adjustData.batchNo || undefined,
      expiryDate: adjustData.expiryDate || undefined
    });

    alert('Stock adjustment recorded successfully.');
    setAdjustData({
      variantId: '',
      warehouseId: warehouses[0]?.id || '',
      type: 'ADJ',
      qty: '',
      notes: '',
      batchNo: '',
      expiryDate: ''
    });
  };

  // 4. Warehouse Transfer Submission
  const handleStockTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferData.variantId || !transferData.fromWhId || !transferData.toWhId || !transferData.qty) return;
    if (transferData.fromWhId === transferData.toWhId) {
      alert('Source and destination warehouse cannot be the same.');
      return;
    }

    executeInventoryTransfer(
      transferData.variantId,
      transferData.fromWhId,
      transferData.toWhId,
      parseInt(transferData.qty),
      transferData.reference || 'TRSF-' + Date.now().toString().slice(-6)
    );

    alert('Warehouse stock transfer executed successfully.');
    setTransferData({
      variantId: '',
      fromWhId: warehouses[0]?.id || '',
      toWhId: warehouses[1]?.id || '',
      qty: '',
      reference: ''
    });
  };

  // Filter Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.barcode.includes(searchQuery);
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    return matchesSearch && matchesCat && matchesBrand;
  });

  // Valuation FIFO/LIFO Summary calculations
  const totalQtyOnHand = products.reduce((sum, p) => sum + p.variants.reduce((vs, v) => vs + v.stock, 0), 0);
  const totalFIFOValuation = products.reduce((sum, p) => sum + p.variants.reduce((vs, v) => vs + (v.stock * v.cost), 0), 0);

  // Demand forecasting AI logic
  const getForecastDetails = (pId, vId) => {
    // Simple mathematical forecast modeling: Base demand + 12% growth - stock risk coefficient
    const movements = stockMovements.filter(m => m.variantId === vId && m.type === 'OUT');
    const totalOut = movements.reduce((acc, curr) => acc + curr.qty, 0);
    const count = movements.length || 1;
    const avgMonthlyVelocity = parseFloat(((totalOut / count) * 4).toFixed(1)); // monthly approximation
    const forecastedDemand = Math.ceil(avgMonthlyVelocity * 1.15); // 15% increase predicted
    const stockOnHand = products.find(p => p.id === pId)?.variants.find(v => v.id === vId)?.stock || 0;
    const recommendedOrder = Math.max(0, forecastedDemand * 1.5 - stockOnHand);

    return {
      avgMonthlyVelocity,
      forecastedDemand,
      recommendedOrder
    };
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>Product & Inventory Control</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage SKUs, scan barcodes, adjust warehouse locations, and run AI forecasts.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleBarcodeScan}>
            <BarcodeIcon size={16} /> Simulate Barcode Scan
          </button>
          <button className="btn btn-primary" onClick={handleAddClick}>
            <PlusIcon size={16} /> Add Product SKU
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Product Catalog</button>
        <button className={`tab-btn ${activeTab === 'adjust' ? 'active' : ''}`} onClick={() => setActiveTab('adjust')}>Stock Adjustments</button>
        <button className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`} onClick={() => setActiveTab('transfer')}>Warehouse Transfers</button>
        <button className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>AI Demand Forecasting</button>
      </div>

      {/* 1. PRODUCT CATALOG TAB */}
      {activeTab === 'products' && (
        <div>
          {/* Filters Bar */}
          <div className="filter-bar">
            <div className="search-input" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by product name, SKU, or barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '36px' }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }}>
                <SearchIcon size={16} />
              </span>
            </div>

            <select className="form-control" style={{ width: '180px' }} value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>

            <select className="form-control" style={{ width: '180px' }} value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
              <option value="All">All Brands</option>
              {brands.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Valuation Overview Widget */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ flex: '1' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valuation Method</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)' }}>FIFO (First In, First Out)</div>
            </div>
            <div style={{ flex: '1', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Qty On Hand</div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>{totalQtyOnHand} units</div>
            </div>
            <div style={{ flex: '1', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset Valuation Total</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--success)' }}>${totalFIFOValuation.toLocaleString()}</div>
            </div>
          </div>

          {/* Products Table */}
          <div className="card" style={{ padding: '0' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Product & Brand</th>
                    <th>SKU & Barcode</th>
                    <th>Category</th>
                    <th>Tracking Rules</th>
                    <th>Variants & Stock Levels</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '14px' }}>{p.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Brand: {p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{p.sku}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>BC: {p.barcode}</div>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                          {p.serialTracking && <span style={{ fontSize: '9px', backgroundColor: 'var(--info-bg)', color: 'var(--info)', padding: '2px 4px', borderRadius: '4px', alignSelf: 'start' }}>Serial Tracked</span>}
                          {p.batchTracking && <span style={{ fontSize: '9px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', padding: '2px 4px', borderRadius: '4px', alignSelf: 'start' }}>Batch & Expiry</span>}
                          {!p.serialTracking && !p.batchTracking && <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>No special tracking</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {p.variants.map((v, vIdx) => (
                            <div key={vIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                              <span style={{ fontWeight: '500' }}>{v.name}</span>
                              <span style={{ fontWeight: '700', color: v.stock <= v.reorderLevel ? 'var(--danger)' : 'var(--text-primary)' }}>
                                {v.stock} pcs (${v.price})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button className="icon-btn" onClick={() => handleEditClick(p)} title="Edit SKU">
                            <EditIcon size={16} />
                          </button>
                          <button className="icon-btn" style={{ color: 'var(--danger)' }} onClick={() => { if(confirm('Delete SKU?')) deleteProduct(p.id); }} title="Delete SKU">
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. STOCK ADJUSTMENTS TAB */}
      {activeTab === 'adjust' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Record Stock Adjustment</h3>
            <form onSubmit={handleStockAdjustmentSubmit}>
              <div className="form-group">
                <label>Select Product Variant</label>
                <select
                  className="form-control"
                  value={adjustData.variantId}
                  onChange={e => setAdjustData({ ...adjustData, variantId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Variant --</option>
                  {products.map(p =>
                    p.variants.map(v => (
                      <option key={v.id} value={v.id}>{p.name} - {v.name} (SKU: {p.sku})</option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Warehouse</label>
                  <select
                    className="form-control"
                    value={adjustData.warehouseId}
                    onChange={e => setAdjustData({ ...adjustData, warehouseId: e.target.value })}
                    required
                  >
                    {warehouses.map(wh => (
                      <option key={wh.id} value={wh.id}>{wh.name} ({wh.code})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity Delta (use negative to decrease)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. -5 or 12"
                    value={adjustData.qty}
                    onChange={e => setAdjustData({ ...adjustData, qty: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Batch No (if applicable)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. BT-9942"
                    value={adjustData.batchNo}
                    onChange={e => setAdjustData({ ...adjustData, batchNo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={adjustData.expiryDate}
                    onChange={e => setAdjustData({ ...adjustData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason / Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Reason for adjustment, e.g. damaged transit, packaging defect, audit count discrepancy..."
                  value={adjustData.notes}
                  onChange={e => setAdjustData({ ...adjustData, notes: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post Stock Adjustment</button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Recent Audit Adjustments Ledger</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
              {stockMovements.filter(m => m.type === 'ADJ').map((m, idx) => {
                const associatedProduct = products.find(p => p.variants.some(v => v.id === m.variantId));
                const associatedVariant = associatedProduct?.variants.find(v => v.id === m.variantId);
                return (
                  <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <div className="flex-between">
                      <span style={{ fontWeight: '700' }}>{associatedProduct?.name} ({associatedVariant?.name})</span>
                      <span className="trend-down" style={{ color: m.qty < 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {m.qty > 0 ? `+${m.qty}` : m.qty} units
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Ref: {m.reference} | Date: {new Date(m.date).toLocaleString()}</p>
                    <p style={{ fontSize: '12px', marginTop: '6px', fontStyle: 'italic' }}>"{m.notes}"</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. WAREHOUSE TRANSFERS TAB */}
      {activeTab === 'transfer' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Initiate Stock Transfer</h3>
            <form onSubmit={handleStockTransferSubmit}>
              <div className="form-group">
                <label>Select Item Variant</label>
                <select
                  className="form-control"
                  value={transferData.variantId}
                  onChange={e => setTransferData({ ...transferData, variantId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Variant --</option>
                  {products.map(p =>
                    p.variants.map(v => (
                      <option key={v.id} value={v.id}>{p.name} - {v.name} (Qty Available: {v.stock})</option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>From Warehouse</label>
                  <select
                    className="form-control"
                    value={transferData.fromWhId}
                    onChange={e => setTransferData({ ...transferData, fromWhId: e.target.value })}
                    required
                  >
                    {warehouses.map(wh => (
                      <option key={wh.id} value={wh.id}>{wh.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>To Warehouse</label>
                  <select
                    className="form-control"
                    value={transferData.toWhId}
                    onChange={e => setTransferData({ ...transferData, toWhId: e.target.value })}
                    required
                  >
                    {warehouses.map(wh => (
                      <option key={wh.id} value={wh.id}>{wh.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Transfer Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 15"
                    value={transferData.qty}
                    onChange={e => setTransferData({ ...transferData, qty: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Transfer Reference # (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. TRSF-0921"
                    value={transferData.reference}
                    onChange={e => setTransferData({ ...transferData, reference: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Execute Transfer Workflow</button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Stock Locations & Rack Layout Matrix</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {warehouses.map(wh => (
                <div key={wh.id} style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--accent)' }}>{wh.name} [{wh.code}]</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Location: {wh.location} | Max Capacity: {wh.capacity} units</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
                    <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px' }}>Rack A: Row 1-4</span>
                    <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px' }}>Rack B: Cold Bin 2</span>
                    <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px' }}>Forklift Area 3</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. AI DEMAND FORECASTING TAB */}
      {activeTab === 'ai' && (
        <div>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              ✨ AI Forecasting & Smart Purchase Recommendations
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Our ML algorithms analyze historical sales velocities and seasonal trend lines to project demand requirements for the upcoming month, automatically recommending purchase quantities.
            </p>
          </div>

          <div className="card" style={{ padding: '0' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Product Variant</th>
                    <th>Current Stock</th>
                    <th>Average Monthly Velocity</th>
                    <th>AI Predicted Demand (30 Days)</th>
                    <th>Reorder Recommendation</th>
                    <th>Action Link</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p =>
                    p.variants.map(v => {
                      const forecast = getForecastDetails(p.id, v.id);
                      return (
                        <tr key={v.id}>
                          <td style={{ fontWeight: '600' }}>
                            {p.name} - {v.name}
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SKU: {p.sku}</div>
                          </td>
                          <td style={{ fontWeight: '600' }}>{v.stock} units</td>
                          <td>{forecast.avgMonthlyVelocity} units/mo</td>
                          <td style={{ fontWeight: '600', color: 'var(--accent)' }}>{forecast.forecastedDemand} units</td>
                          <td>
                            {forecast.recommendedOrder > 0 ? (
                              <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Reorder {forecast.recommendedOrder} units</span>
                            ) : (
                              <span style={{ color: 'var(--success)' }}>Optimal Stock Level</span>
                            )}
                          </td>
                          <td>
                            {forecast.recommendedOrder > 0 ? (
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => alert(`Auto PO generated for ${forecast.recommendedOrder} units of ${p.name}!`)}
                              >
                                Auto PO
                              </button>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>None needed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      {productModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px' }}>{isEditing ? 'Modify Product SKU' : 'Register New Product SKU'}</h3>
            <form onSubmit={handleProductSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SKU Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Barcode / UPC</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.barcode}
                    onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Brand</label>
                  <select
                    className="form-control"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  >
                    {brands.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.taxRate}
                    onChange={e => setFormData({ ...formData, taxRate: e.target.value })}
                  />
                </div>
              </div>

              {/* Variant A Spec */}
              <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '12px', marginBottom: '8px', color: 'var(--accent)' }}>Standard Variant Specs</h4>
                <div className="grid-3">
                  <div className="form-group" style={{ margin: '0' }}>
                    <label>Retail Price ($)</label>
                    <input type="number" step="0.01" className="form-control" value={formData.price1} onChange={e => setFormData({ ...formData, price1: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ margin: '0' }}>
                    <label>Unit Cost ($)</label>
                    <input type="number" step="0.01" className="form-control" value={formData.cost1} onChange={e => setFormData({ ...formData, cost1: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ margin: '0' }}>
                    <label>Opening Stock</label>
                    <input type="number" className="form-control" value={formData.stock1} onChange={e => setFormData({ ...formData, stock1: e.target.value })} required />
                  </div>
                </div>
              </div>

              {/* Variant B Spec */}
              <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '12px', marginBottom: '8px', color: 'var(--accent)' }}>Premium Variant Specs</h4>
                <div className="grid-3">
                  <div className="form-group" style={{ margin: '0' }}>
                    <label>Retail Price ($)</label>
                    <input type="number" step="0.01" className="form-control" value={formData.price2} onChange={e => setFormData({ ...formData, price2: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ margin: '0' }}>
                    <label>Unit Cost ($)</label>
                    <input type="number" step="0.01" className="form-control" value={formData.cost2} onChange={e => setFormData({ ...formData, cost2: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ margin: '0' }}>
                    <label>Opening Stock</label>
                    <input type="number" className="form-control" value={formData.stock2} onChange={e => setFormData({ ...formData, stock2: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Tracking checkboxes */}
              <div style={{ display: 'flex', gap: '16px', margin: '14px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <input type="checkbox" checked={formData.serialTracking} onChange={e => setFormData({ ...formData, serialTracking: e.target.checked })} />
                  Track Individual Serials (SN)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <input type="checkbox" checked={formData.batchTracking} onChange={e => setFormData({ ...formData, batchTracking: e.target.checked })} />
                  Track Batches & Expirations
                </label>
              </div>

              <div className="form-group">
                <label>Warranty Period (Months)</label>
                <input type="number" className="form-control" value={formData.warrantyMonths} onChange={e => setFormData({ ...formData, warrantyMonths: e.target.value })} />
              </div>

              <div className="form-group" style={{ margin: '0' }}>
                <label>Description</label>
                <textarea className="form-control" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Apply Changes' : 'Register SKU'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
