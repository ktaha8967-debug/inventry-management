import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PlusIcon, SearchIcon, SalesIcon, UserIcon } from '../components/Icons';

export default function SalesPOS() {
  const {
    products,
    customers,
    salesOrders,
    createSalesOrder
  } = useAppData();

  const [activeTab, setActiveTab] = useState('pos'); // 'pos', 'orders'

  // POS State
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [posSearch, setPosSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Checkout Receipt state
  const [activeReceipt, setActiveReceipt] = useState(null);

  // 1. Discount Coupon Codes
  const applyCoupon = () => {
    if (discountCode.trim().toUpperCase() === 'SUMMER10') {
      setDiscountPercent(10);
      alert('10% Discount applied successfully!');
    } else if (discountCode.trim().toUpperCase() === 'VIP25') {
      setDiscountPercent(25);
      alert('25% VIP Discount applied successfully!');
    } else {
      alert('Invalid coupon code.');
      setDiscountPercent(0);
    }
  };

  // 2. Cart Operations
  const addToCart = (product, variant) => {
    if (variant.stock <= 0) {
      alert('Error: This variant is completely out of stock.');
      return;
    }

    const existingIndex = cart.findIndex(item => item.variantId === variant.id);
    if (existingIndex > -1) {
      const nextCart = [...cart];
      if (nextCart[existingIndex].qty >= variant.stock) {
        alert(`Cannot add more. Warehouse stock cap reached (${variant.stock} units).`);
        return;
      }
      nextCart[existingIndex].qty += 1;
      setCart(nextCart);
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        qty: 1,
        price: variant.price,
        taxRate: product.taxRate || 0
      }]);
    }
  };

  const updateCartQty = (idx, newQty) => {
    const targetItem = cart[idx];
    const originalProd = products.find(p => p.id === targetItem.productId);
    const originalVar = originalProd?.variants.find(v => v.id === targetItem.variantId);
    
    if (newQty > (originalVar?.stock || 0)) {
      alert('Requested quantity exceeds warehouse stock.');
      return;
    }

    if (newQty <= 0) {
      setCart(prev => prev.filter((_, i) => i !== idx));
    } else {
      setCart(prev => prev.map((item, i) => i === idx ? { ...item, qty: newQty } : item));
    }
  };

  // 3. Calculation breakdown
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = parseFloat(((cartSubtotal * discountPercent) / 100).toFixed(2));
  const postDiscountSubtotal = cartSubtotal - discountAmount;
  const taxAmount = cart.reduce((sum, item) => {
    const itemTotal = (item.price * item.qty);
    const itemShare = (itemTotal / cartSubtotal) * postDiscountSubtotal; // weight adjusted
    return sum + (itemShare * (item.taxRate / 100));
  }, 0);
  const cartTotal = parseFloat((postDiscountSubtotal + taxAmount).toFixed(2));

  // 4. POS Checkout Submit
  const handlePOSCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty.');
      return;
    }

    // Verify wallet balance if chosen
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    if (paymentMethod === 'Wallet' && (selectedCustomer?.walletBalance || 0) < cartTotal) {
      alert(`Insufficient funds in customer's loyalty wallet. Balance: $${selectedCustomer?.walletBalance}`);
      return;
    }

    const orderData = {
      customerId: selectedCustomerId,
      items: cart.map(item => ({
        variantId: item.variantId,
        qty: item.qty,
        price: item.price,
        taxRate: item.taxRate
      })),
      status: 'Delivered',
      paymentStatus: paymentMethod === 'Credit Sale' ? 'Unpaid' : 'Paid',
      paymentMethod,
      total: cartTotal
    };

    const finalOrder = createSalesOrder(orderData);
    setActiveReceipt(finalOrder);

    // Reset checkout states
    setCart([]);
    setDiscountPercent(0);
    setDiscountCode('');
  };

  // Filter pos catalog
  const posProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.sku.toLowerCase().includes(posSearch.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>Sales Operations & POS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fulfill orders, issue invoices, run dynamic coupons, and record payments.</p>
        </div>
        <div className="tabs-container" style={{ margin: '0', border: 'none' }}>
          <button className={`tab-btn ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>Point of Sale (POS)</button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Sales Orders Ledger</button>
        </div>
      </div>

      {/* POS REGISTER INTERFACE */}
      {activeTab === 'pos' && (
        <div className="pos-container">
          
          {/* LEFT: PRODUCTS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="filter-bar" style={{ marginBottom: '0' }}>
              <div className="search-input" style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Quick search products or scan SKU..."
                  value={posSearch}
                  onChange={e => setPosSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '36px' }}
                />
                <span style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }}>
                  <SearchIcon size={16} />
                </span>
              </div>

              <select className="form-control" style={{ width: '150px' }} value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Apparel & Fashion">Fashion</option>
                <option value="Pharmaceuticals">Pharmaceuticals</option>
              </select>
            </div>

            <div className="pos-products">
              {posProducts.map(p =>
                p.variants.map(v => (
                  <div key={v.id} className="pos-product-card" onClick={() => addToCart(p, v)}>
                    <img src={p.images?.[0] || 'https://via.placeholder.com/120'} alt={p.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                    <div style={{ fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{v.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '13px' }}>${v.price}</span>
                      <span style={{ fontSize: '10px', color: v.stock <= v.reorderLevel ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        {v.stock} left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: CART & BILLING */}
          <div className="pos-cart">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ color: 'var(--accent)' }}><UserIcon size={18} /></div>
              <select
                className="form-control"
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                style={{ border: 'none', background: 'none', fontWeight: '700', paddingLeft: '0', fontSize: '14px' }}
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Pts: {c.loyaltyPoints})</option>
                ))}
              </select>
            </div>

            {/* Cart Items Area */}
            <div className="pos-cart-items">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                  <p>POS Cart is empty.</p>
                  <p style={{ fontSize: '11px', marginTop: '6px' }}>Click items on the left to add to sale register.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <div style={{ minWidth: '0', flex: '1' }}>
                      <div style={{ fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.productName}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.variantName}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '12px' }} onClick={() => updateCartQty(idx, item.qty - 1)}>-</button>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.qty}</span>
                      <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '12px' }} onClick={() => updateCartQty(idx, item.qty + 1)}>+</button>
                    </div>
                    <div style={{ minWidth: '60px', textAlign: 'right', fontWeight: '700', fontSize: '12px' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Coupons Promo */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Promo coupon (e.g. SUMMER10, VIP25)"
                className="form-control"
                value={discountCode}
                onChange={e => setDiscountCode(e.target.value)}
              />
              <button className="btn btn-secondary" onClick={applyCoupon}>Apply</button>
            </div>

            {/* Calculations Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Gross Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex-between" style={{ color: 'var(--danger)' }}>
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>VAT / Sales Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex-between" style={{ fontWeight: '800', fontSize: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', color: 'var(--accent)' }}>
                <span>Grand Total Due</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Option */}
            <div style={{ margin: '14px 0' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>Payment Type</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Cash', 'Stripe/Bank', 'Credit Sale', 'Wallet'].map(method => (
                  <button
                    key={method}
                    type="button"
                    className={`btn ${paymentMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: '1', padding: '6px', fontSize: '11px' }}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={handlePOSCheckout} disabled={cart.length === 0}>
              Commit Order & Print Receipt
            </button>
          </div>
        </div>
      )}

      {/* SALES ORDERS LEDGER TAB */}
      {activeTab === 'orders' && (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer Profile</th>
                  <th>Order Date</th>
                  <th>Payment Type</th>
                  <th>Execution Status</th>
                  <th>Billing Status</th>
                  <th style={{ textAlign: 'right' }}>Total Val</th>
                </tr>
              </thead>
              <tbody>
                {salesOrders.map(order => {
                  const cust = customers.find(c => c.id === order.customerId);
                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '700' }}>{order.id}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{cust ? cust.name : 'Walk-in Customer'}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cust?.email}</div>
                      </td>
                      <td>{order.date}</td>
                      <td>{order.paymentMethod || 'Cash'}</td>
                      <td>
                        <span className={`status-pill ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${order.paymentStatus.toLowerCase()}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--accent)' }}>
                        ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {activeReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', fontFamily: 'monospace' }}>
            <h3 style={{ margin: '10px 0' }}>RECEIPT TRANS-INVOICE</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>APEX GLOBAL ENTERPRISES INC.</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
              Ref: {activeReceipt.id} | Date: {activeReceipt.date}
            </div>

            <div style={{ textAlign: 'left', margin: '14px 0', fontSize: '12px' }}>
              {activeReceipt.items.map((item, idx) => {
                const prod = products.find(p => p.variants.some(v => v.id === item.variantId));
                const variant = prod?.variants.find(v => v.id === item.variantId);
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>{prod?.name} ({variant?.name}) x{item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>
              Total Paid ({activeReceipt.paymentMethod}): ${activeReceipt.total.toFixed(2)}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px' }}>
              Thank you for shopping with Apex! Loyalty points credit added to profile.
            </div>

            <button className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={() => setActiveReceipt(null)}>
              Dismiss Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
