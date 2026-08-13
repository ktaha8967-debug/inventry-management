import React, { useState } from 'react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import Dashboard from './modules/Dashboard';
import Inventory from './modules/Inventory';
import SalesPOS from './modules/SalesPOS';
import Purchase from './modules/Purchase';
import CRM from './modules/CRM';
import HRM from './modules/HRM';
import Accounting from './modules/Accounting';
import AssetProduction from './modules/AssetProduction';
import TasksCalendar from './modules/TasksCalendar';
import SettingsIntegrations from './modules/SettingsIntegrations';
import AiAssistant from './modules/AiAssistant';
import GuidedTour from './components/GuidedTour';

import {
  DashboardIcon,
  ProductsIcon,
  InventoryIcon,
  PurchaseIcon,
  SalesIcon,
  CRMIcon,
  SuppliersIcon,
  HRIMIcon,
  AccountingIcon,
  ManufacturingIcon,
  AssetIcon,
  WarrantyIcon,
  DocumentsIcon,
  TasksIcon,
  CalendarIcon,
  CommCenterIcon,
  SettingsIcon,
  NotificationIcon,
  ChatBotIcon,
  DarkModeIcon,
  LightModeIcon
} from './components/Icons';

function NavigationPanel() {
  const {
    currentUser,
    setCurrentUser,
    theme,
    setTheme,
    users,
    roles
  } = useAppData();

  const [activeModule, setActiveModule] = useState('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(() => {
    return !localStorage.getItem('erp_tour_completed');
  });

  const tourSteps = [
    {
      title: 'Welcome to Apex Enterprise! 🚀',
      content: 'Let\'s take a quick 1-minute tour of your redesigned ERP system to help you navigate and master the operations panel.',
      position: 'center'
    },
    {
      target: '#tour-sidebar',
      title: 'Enterprise Sidebar Menu 🏢',
      content: 'Access all business departments from here: Inventory control, Procurement, Sales orders, CRM workflows, Accounting Ledgers, and Payroll Management.',
      position: 'right'
    },
    {
      target: '#tour-role-selector',
      title: 'Dynamic Role Switcher 👤',
      content: 'Switch between user roles instantly to test role-based access permissions. Super Admins see everything, while other personas will have restricted access.',
      position: 'bottom'
    },
    {
      target: '#tour-header-actions',
      title: 'Quick Actions Panel ⚡',
      content: 'Toggle dark or light theme settings instantly, view system-wide alerts, and review notifications on reorder items or sales deal movements.',
      position: 'bottom'
    },
    {
      target: '#tour-content-area',
      title: 'Interactive Board Workspaces 📊',
      content: 'This is where your functional workspaces load. Experience the revamped premium dashboard metrics, trends charts, demand insights, and visual audit logs.',
      position: 'top'
    }
  ];

  const handleTourClose = () => {
    setTourOpen(false);
    localStorage.setItem('erp_tour_completed', 'true');
  };

  // 1. Check Permissions for User Role
  const activeRole = roles.find(r => r.id === currentUser.roleId);

  const hasPermission = (moduleName) => {
    if (!activeRole) return false;
    if (activeRole.permissions.all) return true;
    return !!activeRole.permissions[moduleName];
  };

  // Nav configuration
  const navigationItems = [
    { id: 'dashboard', label: 'Executive Board', icon: <DashboardIcon size={18} />, permissionKey: 'dashboard' },
    { id: 'inventory', label: 'Inventory & SKUs', icon: <InventoryIcon size={18} />, permissionKey: 'inventory' },
    { id: 'sales', label: 'Sales Order & POS', icon: <SalesIcon size={18} />, permissionKey: 'sales' },
    { id: 'purchase', label: 'Procurement (PO)', icon: <PurchaseIcon size={18} />, permissionKey: 'purchase' },
    { id: 'crm', label: 'CRM & Pipelines', icon: <CRMIcon size={18} />, permissionKey: 'crm' },
    { id: 'hrm', label: 'HRM & Payroll', icon: <HRIMIcon size={18} />, permissionKey: 'hrm' },
    { id: 'accounting', label: 'General Ledgers', icon: <AccountingIcon size={18} />, permissionKey: 'accounting' },
    { id: 'ops', label: 'Ops, BOM & Assets', icon: <ManufacturingIcon size={18} />, permissionKey: 'manufacturing' },
    { id: 'tasks', label: 'To-Do & Calendar', icon: <TasksIcon size={18} />, permissionKey: 'documents' }, // map to documents permission for simplicity
    { id: 'ai', label: 'Business AI Copilot', icon: <ChatBotIcon size={18} />, permissionKey: 'dashboard' },
    { id: 'settings', label: 'System Settings', icon: <SettingsIcon size={18} />, permissionKey: 'settings' }
  ];

  // Render active module component
  const renderActiveModule = () => {
    if (!hasPermission(navigationItems.find(n => n.id === activeModule)?.permissionKey)) {
      return (
        <div className="card" style={{ padding: '40px', textAlign: 'center', marginTop: '40px', borderLeft: '4px solid var(--danger)' }}>
          <h2 style={{ color: 'var(--danger)', fontSize: '20px', fontWeight: 'bold' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14px' }}>
            Your active profile persona <strong>({currentUser.name} - {activeRole?.name})</strong> does not hold rights to enter this segment.
          </p>
          <p style={{ fontSize: '12px', marginTop: '12px', color: 'var(--text-muted)' }}>
            Switch user role in the top header selector to Super Admin or Manager to gain permission.
          </p>
        </div>
      );
    }

    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'sales':
        return <SalesPOS />;
      case 'purchase':
        return <Purchase />;
      case 'crm':
        return <CRM />;
      case 'hrm':
        return <HRM />;
      case 'accounting':
        return <Accounting />;
      case 'ops':
        return <AssetProduction />;
      case 'tasks':
        return <TasksCalendar />;
      case 'ai':
        return <AiAssistant />;
      case 'settings':
        return <SettingsIntegrations />;
      default:
        return <Dashboard />;
    }
  };

  const handleUserPersonaChange = (e) => {
    const usr = users.find(u => u.id === e.target.value);
    if (usr) {
      setCurrentUser(usr);
      alert(`User identity switched. Loaded persona: ${usr.name} [Role: ${roles.find(r => r.id === usr.roleId)?.name}]`);
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar" id="tour-sidebar">
        <div className="logo-section">
          <div className="logo-icon">A</div>
          <div>
            <h2 className="logo-text">APEX ENTERPRISE</h2>
            <span className="logo-subtext">ERP + CRM + Accounting v2.1</span>
          </div>
        </div>

        <nav className="nav-menu">
          {navigationItems.map(item => {
            const allowed = hasPermission(item.permissionKey);
            return (
              <div
                key={item.id}
                onClick={() => allowed && setActiveModule(item.id)}
                className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
                style={{
                  opacity: allowed ? 1 : 0.45,
                  cursor: allowed ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                title={allowed ? '' : 'Role-based Access Restricted'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {!allowed && <span style={{ fontSize: '9px', fontWeight: 'bold' }}>🔒</span>}
              </div>
            );
          })}
        </nav>

        {/* PROFILE BADGE FOOTER */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role">{roles.find(r => r.id === currentUser.roleId)?.name}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-panel">
        
        {/* HEADER BAR */}
        <header className="header-bar">
          <div className="header-left">
            <div className="company-selector" id="tour-role-selector">
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '6px', fontWeight: 'bold', textTransform: 'uppercase' }}>Scope Profile:</span>
              <select value={currentUser.id} onChange={handleUserPersonaChange}>
                {users.map(u => (
                  <option key={u.id} value={u.id}>@{u.username} ({roles.find(r => r.id === u.roleId)?.name})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="header-right" id="tour-header-actions">
            {/* Tour trigger button */}
            <button className="btn btn-secondary" onClick={() => setTourOpen(true)} style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', gap: '6px', borderRadius: '8px' }} title="Take a tour of the application">
              <span>✨</span> Tour
            </button>

            {/* Theme switcher */}
            <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Switch styling layout">
              {theme === 'dark' ? <LightModeIcon size={18} /> : <DarkModeIcon size={18} />}
            </button>

            {/* Notification button */}
            <button className="icon-btn" onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <NotificationIcon size={18} />
              <span className="badge">3</span>
            </button>
          </div>
        </header>

        {/* NOTIFICATIONS PANEL */}
        {notificationsOpen && (
          <div style={{
            position: 'absolute',
            top: '75px',
            right: '24px',
            width: '320px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: 'var(--card-shadow)',
            zIndex: '150',
            padding: '16px'
          }}>
            <h4 style={{ fontWeight: '700', fontSize: '13px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '10px' }}>Active Notifications alerts</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ padding: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                <strong>Stock warning:</strong> Apex Pro Phone (p1-v1) is below reorder level (12 units).
              </div>
              <div style={{ padding: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                <strong>PO Update:</strong> Supplier invoice from green textiles processed.
              </div>
              <div style={{ padding: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                <strong>Sales:</strong> Deal Future Retail Group moved to Negotiation stage.
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY MODULE CONTENT */}
        <section className="content-area" id="tour-content-area">
          {renderActiveModule()}
        </section>
      </main>

      {/* Guided Interactive Tour Component */}
      <GuidedTour steps={tourSteps} isOpen={tourOpen} onClose={handleTourClose} />
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <NavigationPanel />
    </AppDataProvider>
  );
}
