import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PlusIcon, EditIcon, CRMIcon, SearchIcon, SendIcon } from '../components/Icons';

export default function CRM() {
  const {
    customers,
    leads,
    commLogs,
    addCustomer,
    updateCustomer,
    addLead,
    updateLeadStage,
    addCommLog
  } = useAppData();

  const [activeTab, setActiveTab] = useState('customers'); // 'customers', 'leads', 'comm'

  // Search Customer State
  const [custSearch, setCustSearch] = useState('');

  // Customer Edit/Add state
  const [custModalOpen, setCustModalOpen] = useState(false);
  const [editingCustId, setEditingCustId] = useState('');
  const [custFormData, setCustFormData] = useState({
    name: '', contactPerson: '', email: '', phone: '', segment: 'Retail', address: '', birthday: ''
  });

  // Lead Add state
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: '', contactPerson: '', email: '', phone: '', source: 'Web Form', estimatedValue: '', notes: ''
  });

  // Outbound Message Center State
  const [msgFormData, setMsgFormData] = useState({
    customerId: customers[0]?.id || '',
    type: 'Email',
    subject: '',
    body: ''
  });

  // 1. Submit Customer form
  const handleCustSubmit = (e) => {
    e.preventDefault();
    if (editingCustId) {
      updateCustomer(editingCustId, custFormData);
    } else {
      addCustomer(custFormData);
    }
    setCustModalOpen(false);
    setCustFormData({ name: '', contactPerson: '', email: '', phone: '', segment: 'Retail', address: '', birthday: '' });
  };

  const handleEditCustClick = (c) => {
    setEditingCustId(c.id);
    setCustFormData({
      name: c.name,
      contactPerson: c.contactPerson || '',
      email: c.email,
      phone: c.phone || '',
      segment: c.segment || 'Retail',
      address: c.address || '',
      birthday: c.birthday || ''
    });
    setCustModalOpen(true);
  };

  const handleAddCustClick = () => {
    setEditingCustId('');
    setCustFormData({ name: '', contactPerson: '', email: '', phone: '', segment: 'Retail', address: '', birthday: '' });
    setCustModalOpen(true);
  };

  // 2. Submit Lead form
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    addLead({
      ...leadFormData,
      estimatedValue: parseFloat(leadFormData.estimatedValue) || 0
    });
    setLeadModalOpen(false);
    setLeadFormData({ name: '', contactPerson: '', email: '', phone: '', source: 'Web Form', estimatedValue: '', notes: '' });
  };

  // 3. Dispatch manual comm log (WhatsApp / SMS / Email simulator)
  const dispatchMessage = (e) => {
    e.preventDefault();
    addCommLog({
      customerId: msgFormData.customerId,
      type: msgFormData.type,
      subject: msgFormData.subject,
      body: msgFormData.body,
      direction: 'Outgoing'
    });
    alert(`${msgFormData.type} dispatched successfully to client! Activity recorded.`);
    setMsgFormData({ customerId: customers[0]?.id || '', type: 'Email', subject: '', body: '' });
  };

  // Filter customers
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
    c.contactPerson?.toLowerCase().includes(custSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(custSearch.toLowerCase())
  );

  // Kanban setup
  const pipelineStages = ['Discovery', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won'];

  // AI-powered behavior insights calculator
  const getAiCustomerInsight = (c) => {
    if (c.clv > 20000) {
      return { text: 'Key VIP account. Propensity to renew contracts: 94%. Recommendation: Invite to Executive Golf Outing.', class: 'active' };
    }
    if (c.loyaltyPoints > 200) {
      return { text: 'Highly active loyal customer. Recommendation: Send 10% discount promo code VVIP10.', class: 'pending' };
    }
    if (c.clv === 0) {
      return { text: 'Newly onboarded cold profile. Recommendation: Schedule intro product demo.', class: 'info' };
    }
    return { text: 'Standard buyer profile. Steady purchase cycles.', class: 'info' };
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>CRM & Pipeline Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Nurture leads, analyze loyalty points, track communication history, and review AI insights.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={handleAddCustClick}>
            <PlusIcon size={16} /> Register Client Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>Customer Directory & AI Insights</button>
        <button className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>Kanban Sales Pipeline</button>
        <button className={`tab-btn ${activeTab === 'comm' ? 'active' : ''}`} onClick={() => setActiveTab('comm')}>Communication Hub</button>
      </div>

      {/* 1. CUSTOMER DIRECTORY TAB */}
      {activeTab === 'customers' && (
        <div>
          <div className="filter-bar">
            <div className="search-input" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search customers by name, representative, or email..."
                value={custSearch}
                onChange={e => setCustSearch(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '36px' }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }}>
                <SearchIcon size={16} />
              </span>
            </div>
          </div>

          <div className="card" style={{ padding: '0' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Customer Name & Segment</th>
                    <th>Contact Person</th>
                    <th>Wallet Balance</th>
                    <th>Loyalty Points</th>
                    <th>Lifetime Value (CLV)</th>
                    <th>AI Behavioral Insights</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => {
                    const aiInsight = getAiCustomerInsight(c);
                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: '700', fontSize: '14px' }}>{c.name}</div>
                          <span className={`status-pill ${c.segment === 'Enterprise' ? 'active' : c.segment === 'SME' ? 'pending' : 'info'}`} style={{ fontSize: '9px', padding: '2px 6px', marginTop: '2px' }}>
                            {c.segment}
                          </span>
                        </td>
                        <td>
                          <div>{c.contactPerson}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.phone}</div>
                        </td>
                        <td style={{ fontWeight: '600' }}>${c.walletBalance.toLocaleString()}</td>
                        <td style={{ fontWeight: '600', color: 'var(--accent)' }}>{c.loyaltyPoints} pts</td>
                        <td style={{ fontWeight: '700' }}>${c.clv.toLocaleString()}</td>
                        <td style={{ maxWidth: '300px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '8px', fontStyle: 'italic' }}>
                            {aiInsight.text}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="icon-btn" onClick={() => handleEditCustClick(c)}>
                            <EditIcon size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. KANBAN SALES PIPELINE */}
      {activeTab === 'leads' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px' }}>Deals Opportunity Tracker</h3>
            <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setLeadModalOpen(true)}>
              + Add Lead Opportunity
            </button>
          </div>

          <div className="pipeline-container">
            {pipelineStages.map(stage => {
              const stageLeads = leads.filter(l => l.pipelineStage === stage);
              return (
                <div key={stage} className="pipeline-column">
                  <div className="pipeline-column-header">
                    <span>{stage}</span>
                    <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>{stageLeads.length}</span>
                  </div>

                  <div style={{ minHeight: '300px' }}>
                    {stageLeads.map(lead => (
                      <div key={lead.id} className="pipeline-card">
                        <div style={{ fontWeight: '700', fontSize: '13px' }}>{lead.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Value: ${lead.estimatedValue.toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>{lead.notes}</div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 'bold' }}>Lead: {lead.contactPerson}</span>
                          <select
                            value={lead.pipelineStage}
                            onChange={e => updateLeadStage(lead.id, e.target.value)}
                            style={{ fontSize: '10px', padding: '2px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                          >
                            {pipelineStages.map(st => <option key={st} value={st}>{st}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. COMMUNICATION HUB */}
      {activeTab === 'comm' && (
        <div className="grid-2">
          {/* Dispatch Messenger */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Outbound Dispatch Desk</h3>
            <form onSubmit={dispatchMessage}>
              <div className="form-group">
                <label>Target Customer Profile</label>
                <select
                  className="form-control"
                  value={msgFormData.customerId}
                  onChange={e => setMsgFormData({ ...msgFormData, customerId: e.target.value })}
                  required
                >
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Communication Channel</label>
                <select
                  className="form-control"
                  value={msgFormData.type}
                  onChange={e => setMsgFormData({ ...msgFormData, type: e.target.value })}
                >
                  <option value="Email">Email SMTP Relay</option>
                  <option value="WhatsApp">WhatsApp API Template</option>
                  <option value="SMS">SMS Gateway Direct</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subject / Topic Line</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bulk discount offer, shipping update, invoice verification..."
                  value={msgFormData.subject}
                  onChange={e => setMsgFormData({ ...msgFormData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message Content</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Compose text here..."
                  value={msgFormData.body}
                  onChange={e => setMsgFormData({ ...msgFormData, body: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <SendIcon size={16} /> Broadcast Dispatch Message
              </button>
            </form>
          </div>

          {/* Activity Dispatch Logs */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Relay Gateway Traffic Logs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
              {commLogs.map((log, idx) => {
                const customer = customers.find(c => c.id === log.customerId);
                return (
                  <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <div className="flex-between">
                      <span style={{ fontWeight: '700', fontSize: '12px' }}>To: {customer ? customer.name : 'Unknown'}</span>
                      <span className="status-pill active" style={{ fontSize: '9px', backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
                        {log.type}
                      </span>
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '12px', marginTop: '6px' }}>{log.subject}</div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{log.body}</p>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'right' }}>
                      Sent: {new Date(log.date).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER FORM MODAL */}
      {custModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px' }}>{editingCustId ? 'Modify Client Profile' : 'Register Client Profile'}</h3>
            <form onSubmit={handleCustSubmit}>
              <div className="form-group">
                <label>Company / Individual Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={custFormData.name}
                  onChange={e => setCustFormData({ ...custFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Primary Representative</label>
                  <input
                    type="text"
                    className="form-control"
                    value={custFormData.contactPerson}
                    onChange={e => setCustFormData({ ...custFormData, contactPerson: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Market Segment</label>
                  <select
                    className="form-control"
                    value={custFormData.segment}
                    onChange={e => setCustFormData({ ...custFormData, segment: e.target.value })}
                  >
                    <option value="Enterprise">Enterprise Client</option>
                    <option value="SME">SME Partner</option>
                    <option value="Retail">Retail Consumer</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={custFormData.email}
                    onChange={e => setCustFormData({ ...custFormData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={custFormData.phone}
                    onChange={e => setCustFormData({ ...custFormData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Client Birthday</label>
                  <input
                    type="date"
                    className="form-control"
                    value={custFormData.birthday}
                    onChange={e => setCustFormData({ ...custFormData, birthday: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Registered Street Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={custFormData.address}
                    onChange={e => setCustFormData({ ...custFormData, address: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCustModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingCustId ? 'Save Changes' : 'Create Profile'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD FORM MODAL */}
      {leadModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px' }}>Add Sales Lead Opportunity</h3>
            <form onSubmit={handleLeadSubmit}>
              <div className="form-group">
                <label>Company / Organization</label>
                <input
                  type="text"
                  className="form-control"
                  value={leadFormData.name}
                  onChange={e => setLeadFormData({ ...leadFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Contact Representative</label>
                  <input
                    type="text"
                    className="form-control"
                    value={leadFormData.contactPerson}
                    onChange={e => setLeadFormData({ ...leadFormData, contactPerson: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 25000"
                    value={leadFormData.estimatedValue}
                    onChange={e => setLeadFormData({ ...leadFormData, estimatedValue: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={leadFormData.email}
                    onChange={e => setLeadFormData({ ...leadFormData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={leadFormData.phone}
                    onChange={e => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Lead Acquisition Source</label>
                <select
                  className="form-control"
                  value={leadFormData.source}
                  onChange={e => setLeadFormData({ ...leadFormData, source: e.target.value })}
                >
                  <option value="Web Form">Self Onboard Web Form</option>
                  <option value="Cold Call">Cold Outreach</option>
                  <option value="Referral">Strategic Referral</option>
                  <option value="Conference">Industry Conference</option>
                </select>
              </div>

              <div className="form-group">
                <label>Discussion / Scope Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={leadFormData.notes}
                  onChange={e => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                  placeholder="Details of client requirements..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setLeadModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Track Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
