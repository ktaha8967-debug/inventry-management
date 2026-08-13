import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function SettingsIntegrations() {
  const {
    currentCompany,
    setCurrentCompany,
    currentLanguage,
    setCurrentLanguage,
    theme,
    setTheme,
    companies
  } = useAppData();

  // Integrations states
  const [integrations, setIntegrations] = useState({
    shopify: false,
    woocommerce: true,
    quickbooks: false,
    xero: false,
    stripe: true,
    paypal: false,
    jazzcash: false,
    easypaisa: false,
    gdrive: true,
    dropbox: false
  });

  const toggleIntegration = (key) => {
    setIntegrations(prev => {
      const next = { ...prev, [key]: !prev[key] };
      alert(`Integration for ${key.toUpperCase()} is now ${next[key] ? 'CONNECTED' : 'DISCONNECTED'}.`);
      return next;
    });
  };

  const handleCompanyChange = (e) => {
    const comp = companies.find(c => c.id === e.target.value);
    if (comp) setCurrentCompany(comp);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>System Configuration & Integrations</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage multi-company billing, switch base localization profiles, and connect REST API gateways.</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Company Settings Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Localization & Identity</h3>
            
            <div className="form-group">
              <label>Select Active Corporate Profile</label>
              <select className="form-control" value={currentCompany.id} onChange={handleCompanyChange}>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>System Base Currency</label>
                <select className="form-control" defaultValue={currentCompany.baseCurrency}>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - Pound Sterling (£)</option>
                  <option value="PKR">PKR - Pakistani Rupee (Rs)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Localization Language</label>
                <select className="form-control" value={currentLanguage} onChange={e => setCurrentLanguage(e.target.value)}>
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="ar">العربية (AR)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Theme Aesthetics</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: '1', padding: '8px' }}
                  onClick={() => setTheme('dark')}
                >
                  Dark Mode
                </button>
                <button
                  type="button"
                  className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: '1', padding: '8px' }}
                  onClick={() => setTheme('light')}
                >
                  Light Mode
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Enterprise Security Policies</h3>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="flex-between">
                <span>JWT Web Token Lifetime</span>
                <span style={{ fontWeight: '600' }}>3600s (1 Hour)</span>
              </div>
              <div className="flex-between">
                <span>Enforce 2FA Admin logins</span>
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Active</span>
              </div>
              <div className="flex-between">
                <span>IP Access Restrictions Range</span>
                <span style={{ color: 'var(--text-secondary)' }}>192.168.1.0/24</span>
              </div>
            </div>
          </div>
        </div>

        {/* REST API & Channel Gateways Card */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>REST API & Channel Gateways</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Sync and reconcile transactions from third-party CRM channels, sales registers, and loyalty payment gateways.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Shopify */}
            <div className="flex-between" style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>Shopify Store Sync</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Imports inventory listings and orders.</div>
              </div>
              <button
                type="button"
                className={`btn ${integrations.shopify ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => toggleIntegration('shopify')}
              >
                {integrations.shopify ? 'Connected' : 'Disconnect'}
              </button>
            </div>

            {/* WooCommerce */}
            <div className="flex-between" style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>WooCommerce Channel</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Automates multi-warehouse product feed.</div>
              </div>
              <button
                type="button"
                className={`btn ${integrations.woocommerce ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => toggleIntegration('woocommerce')}
              >
                {integrations.woocommerce ? 'Connected' : 'Disconnect'}
              </button>
            </div>

            {/* QuickBooks */}
            <div className="flex-between" style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>QuickBooks Ledger Sync</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Transfers journal entries for taxes.</div>
              </div>
              <button
                type="button"
                className={`btn ${integrations.quickbooks ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => toggleIntegration('quickbooks')}
              >
                {integrations.quickbooks ? 'Connected' : 'Disconnect'}
              </button>
            </div>

            {/* Stripe */}
            <div className="flex-between" style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>Stripe Webhooks Gateway</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Reconciles credit payments instantly.</div>
              </div>
              <button
                type="button"
                className={`btn ${integrations.stripe ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => toggleIntegration('stripe')}
              >
                {integrations.stripe ? 'Connected' : 'Disconnect'}
              </button>
            </div>

            {/* JazzCash / Easypaisa */}
            <div className="flex-between" style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>JazzCash & Easypaisa API</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Local wallets integration.</div>
              </div>
              <button
                type="button"
                className={`btn ${integrations.jazzcash ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => toggleIntegration('jazzcash')}
              >
                {integrations.jazzcash ? 'Connected' : 'Disconnect'}
              </button>
            </div>

            {/* Google Drive Archive */}
            <div className="flex-between" style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>Google Drive Backups</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Saves daily ledger sheet archives.</div>
              </div>
              <button
                type="button"
                className={`btn ${integrations.gdrive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => toggleIntegration('gdrive')}
              >
                {integrations.gdrive ? 'Connected' : 'Disconnect'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
