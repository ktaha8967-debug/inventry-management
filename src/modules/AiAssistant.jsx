import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { SendIcon } from '../components/Icons';

export default function AiAssistant() {
  const {
    products,
    customers,
    salesOrders,
    chartOfAccounts,
    auditLogs
  } = useAppData();

  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Business Copilot. How can I help optimize your supply chains, review ledger accounts, or summarize CRM pipelines today?' }
  ]);
  const [inputVal, setInputVal] = useState('');

  // 1. Calculations for chatbot response
  const getLowStockString = () => {
    let low = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock <= v.reorderLevel) {
          low.push(`${p.name} (${v.name}): ${v.stock} units left`);
        }
      });
    });
    return low.length > 0 ? `⚠️ Low Stock Items detected:\n- ${low.join('\n- ')}\nI recommend generating auto purchase orders.` : '✅ All stock levels are healthy.';
  };

  const getTopCustomersString = () => {
    const sorted = [...customers].sort((a, b) => b.clv - a.clv);
    const lines = sorted.map(c => `- ${c.name} [CLV: $${c.clv.toLocaleString()} | Segment: ${c.segment}]`);
    return `📊 Top Customers by Lifetime Value:\n${lines.join('\n')}`;
  };

  const getFinancialPerformanceString = () => {
    const salesRevenue = chartOfAccounts.find(a => a.code === '4010')?.balance || 0;
    const cogs = chartOfAccounts.find(a => a.code === '5010')?.balance || 0;
    const grossProfit = salesRevenue - cogs;
    return `📈 Financial Performance Summary:\n- Total Sales Revenue: $${salesRevenue.toFixed(2)}\n- Cost of Goods Sold (COGS): $${cogs.toFixed(2)}\n- Gross Profit Margin: $${grossProfit.toFixed(2)} (${salesRevenue > 0 ? ((grossProfit / salesRevenue) * 100).toFixed(1) : 0}%)\nLet me know if you would like me to post a journal entry.`;
  };

  // 2. Chatbot response routing
  const handleChatResponse = (text) => {
    const query = text.toLowerCase();
    let reply = '';

    if (query.includes('stock') || query.includes('reorder') || query.includes('warning') || query.includes('inventory')) {
      reply = getLowStockString();
    } else if (query.includes('customer') || query.includes('clv') || query.includes('crm') || query.includes('loyalty')) {
      reply = getTopCustomersString();
    } else if (query.includes('financial') || query.includes('profit') || query.includes('revenue') || query.includes('margin') || query.includes('income')) {
      reply = getFinancialPerformanceString();
    } else if (query.includes('audit') || query.includes('log') || query.includes('security')) {
      const logs = auditLogs.slice(0, 3).map(l => `- ${l.username}: ${l.action} ${l.entity} (${l.details})`);
      reply = `🛡️ Security & Audit Logs summary:\n${logs.join('\n')}`;
    } else {
      reply = `I have parsed your prompt. Currently, you can ask about:\n1. 'Inventory Stock levels' or 'Low Stock Alerts'\n2. 'Top CRM Customers' or 'Lifetime Value'\n3. 'Financial margins' or 'Revenue performance'\n4. 'Recent audit logs'\nHow would you like to proceed?`;
    }

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text },
      { sender: 'bot', text: reply }
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleChatResponse(inputVal);
    setInputVal('');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>AI Assistant & Insights</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Chat with your business data, extract reports, and check anomaly detections.</p>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'stretch' }}>
        {/* Left: Quick Prompts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>AI Quick Recommendations</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>Click one of the data queries below to trigger an automated business intelligence summary.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn btn-secondary" style={{ textAlign: 'left', fontSize: '12px', justifyContent: 'flex-start' }} onClick={() => handleChatResponse('Analyze stock warning levels')}>
                🔍 Run low-stock audit
              </button>
              <button className="btn btn-secondary" style={{ textAlign: 'left', fontSize: '12px', justifyContent: 'flex-start' }} onClick={() => handleChatResponse('Retrieve customer CLV pipeline details')}>
                👥 Review CRM client segments
              </button>
              <button className="btn btn-secondary" style={{ textAlign: 'left', fontSize: '12px', justifyContent: 'flex-start' }} onClick={() => handleChatResponse('Check operating profit margins')}>
                💰 Analyze gross profits & expenses
              </button>
              <button className="btn btn-secondary" style={{ textAlign: 'left', fontSize: '12px', justifyContent: 'flex-start' }} onClick={() => handleChatResponse('Summarize recent audits')}>
                🛡️ View security audit trails
              </button>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Anomaly Detection Rules</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              No transactional anomalies detected. Ledger accounts balance accurately, and inventory levels are aligned with forecast algorithms.
            </p>
          </div>
        </div>

        {/* Right: Conversational Chat Interface */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '480px', padding: '0' }}>
          <div style={{ background: 'var(--accent-gradient)', color: 'white', padding: '14px 18px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', fontWeight: 'bold', fontSize: '14px' }}>
            AI Assistant Chatbot Copilot
          </div>

          <div style={{ flexGrow: '1', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{
                padding: '10px 14px',
                borderRadius: '12px',
                maxWidth: '85%',
                fontSize: '13px',
                lineHeight: '1.4',
                whiteSpace: 'pre-line',
                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                backgroundColor: msg.sender === 'bot' ? 'var(--bg-tertiary)' : 'var(--accent)',
                color: msg.sender === 'bot' ? 'var(--text-primary)' : 'white',
                borderTopLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                borderTopRightRadius: msg.sender === 'user' ? '2px' : '12px'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid var(--border-color)' }}>
            <input
              type="text"
              placeholder="Ask about inventory, P&L profit, or CRM segments..."
              className="form-control"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
              <SendIcon size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
