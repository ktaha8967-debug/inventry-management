import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PlusIcon, UserIcon } from '../components/Icons';

export default function HRM() {
  const {
    employees,
    attendance,
    leaves,
    setLeaves,
    addEmployee,
    markAttendance,
    salesOrders,
    recordExpense
  } = useAppData();

  const [activeTab, setActiveTab] = useState('employees'); // 'employees', 'attendance', 'leaves', 'payroll'

  // Add Employee Form State
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [empFormData, setEmpFormData] = useState({
    name: '', department: 'Sales & Marketing', designation: '', salary: '', commissionRate: 0, shift: 'Day Shift (9am - 5pm)', phone: '', email: ''
  });

  // Clock-in State
  const [clockInTime, setClockInTime] = useState('');

  // Payroll slip generation State
  const [payrollModalOpen, setPayrollModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [payrollReceipt, setPayrollReceipt] = useState(null);

  // 1. Submit Employee Registration
  const submitEmployee = (e) => {
    e.preventDefault();
    addEmployee({
      ...empFormData,
      salary: parseFloat(empFormData.salary) || 0,
      commissionRate: parseFloat(empFormData.commissionRate) || 0
    });
    setEmpModalOpen(false);
    setEmpFormData({ name: '', department: 'Sales & Marketing', designation: '', salary: '', commissionRate: 0, shift: 'Day Shift (9am - 5pm)', phone: '', email: '' });
  };

  // 2. Attendance Clock-in Trigger
  const handleClockIn = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    markAttendance('emp1', { clockIn: timeStr, status: 'Present' });
    alert(`Success: Sarah Jenkins (CEO) clocked in at ${timeStr}.`);
  };

  // 3. Holiday Leave Workflows
  const updateLeaveStatus = (id, status) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  // 4. Payroll calculations
  const compilePayrollSlip = (e) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === selectedEmpId);
    if (!emp) return;

    // Calculate commission if any
    // Sales associated with their username code: Alice (r6), Bob (emp3/u4/sales_bob)
    // We assume if sales agent is selected, we calculate 2% commission from sales orders total
    const salesTotalVal = salesOrders.reduce((sum, so) => sum + so.total, 0);
    const calculatedCommission = emp.commissionRate > 0 ? parseFloat(((salesTotalVal * emp.commissionRate) / 100).toFixed(2)) : 0;
    const grossTotal = emp.salary + calculatedCommission;
    const taxesAndDeductions = parseFloat((grossTotal * 0.15).toFixed(2)); // 15% standard income tax withholding
    const netTakeHome = grossTotal - taxesAndDeductions;

    const receipt = {
      id: `PAYROLL-${Date.now().toString().slice(-6)}`,
      empName: emp.name,
      department: emp.department,
      designation: emp.designation,
      salary: emp.salary,
      commission: calculatedCommission,
      deductions: taxesAndDeductions,
      net: netTakeHome,
      date: new Date().toISOString().split('T')[0]
    };

    setPayrollReceipt(receipt);
    setPayrollModalOpen(true);

    // Record payroll payment in expense sub-ledgers automatically
    recordExpense({
      category: 'Salaries',
      amount: netTakeHome,
      description: `Payroll slip payout to ${emp.name}`
    });
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>Employee & HR Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Log staff attendance, approve time-off leaves, and run monthly payroll cycles.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleClockIn}>
            ⏰ Punch Daily Attendance
          </button>
          <button className="btn btn-primary" onClick={() => setEmpModalOpen(true)}>
            <PlusIcon size={16} /> Onboard Employee
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>Staff Directory</button>
        <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Attendance Roster</button>
        <button className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`} onClick={() => setActiveTab('leaves')}>Leave Requests</button>
        <button className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`} onClick={() => setActiveTab('payroll')}>Payroll Processing</button>
      </div>

      {/* 1. EMPLOYEES DIRECTORY */}
      {activeTab === 'employees' && (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee Info</th>
                  <th>Department & Role</th>
                  <th>Core Shift</th>
                  <th>Salary Rate</th>
                  <th>Commission Rate</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Date of Joining</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{emp.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{emp.email} | {emp.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{emp.designation}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{emp.department}</div>
                    </td>
                    <td>{emp.shift}</td>
                    <td style={{ fontWeight: '600' }}>${emp.salary.toLocaleString()}/mo</td>
                    <td>{emp.commissionRate}%</td>
                    <td>
                      <span className={`status-pill ${emp.status === 'Active' ? 'active' : 'cancelled'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{emp.joiningDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ATTENDANCE ROSTER */}
      {activeTab === 'attendance' && (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee Profile</th>
                  <th>Clock In Time</th>
                  <th>Clock Out Time</th>
                  <th style={{ textAlign: 'right' }}>Presence Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(att => {
                  const emp = employees.find(e => e.id === att.employeeId);
                  return (
                    <tr key={att.id}>
                      <td style={{ fontWeight: '700' }}>{att.date}</td>
                      <td style={{ fontWeight: '600' }}>{emp ? emp.name : 'Unknown Staff'}</td>
                      <td style={{ color: 'var(--success)', fontWeight: '600' }}>{att.clockIn}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: '600' }}>{att.clockOut}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="status-pill active" style={{ textTransform: 'uppercase' }}>
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. LEAVE REQUESTS */}
      {activeTab === 'leaves' && (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee Profile</th>
                  <th>Leave Reason Details</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Approval State</th>
                  <th style={{ textAlign: 'right' }}>Review Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(lv => {
                  const emp = employees.find(e => e.id === lv.employeeId);
                  return (
                    <tr key={lv.id}>
                      <td style={{ fontWeight: '600' }}>{emp ? emp.name : 'Unknown'}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{lv.leaveType}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>"{lv.reason}"</div>
                      </td>
                      <td>{lv.startDate}</td>
                      <td>{lv.endDate}</td>
                      <td>
                        <span className={`status-pill ${lv.status.toLowerCase()}`}>
                          {lv.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {lv.status === 'Pending' ? (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--success)' }} onClick={() => updateLeaveStatus(lv.id, 'Approved')}>
                              Approve
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)' }} onClick={() => updateLeaveStatus(lv.id, 'Rejected')}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Decision Recorded</span>
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

      {/* 4. PAYROLL PROCESSING TAB */}
      {activeTab === 'payroll' && (
        <div className="grid-2">
          {/* Payroll Generator Form */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Run Monthly Payroll Calculator</h3>
            <form onSubmit={compilePayrollSlip}>
              <div className="form-group">
                <label>Select Target Employee</label>
                <select
                  className="form-control"
                  value={selectedEmpId}
                  onChange={e => setSelectedEmpId(e.target.value)}
                  required
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                  ))}
                </select>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
                <p><strong>Note on Commissions:</strong> Staff commissions are dynamically computed based on real sales figures. If employee's profile has a commission rate, total sales revenue in general ledger is factored in.</p>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Compile Ledger Payroll</button>
            </form>
          </div>

          {/* Quick Payroll Overview Info */}
          <div className="card">
            <h3 style={{ marginBottom: '12px', fontSize: '15px' }}>Payroll SG&A Allocation Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div className="flex-between">
                <span>Standard Staff Salaries</span>
                <span>$33,000.00</span>
              </div>
              <div className="flex-between">
                <span>Average Tax Withholdings (15%)</span>
                <span>$4,950.00</span>
              </div>
              <div className="flex-between" style={{ fontWeight: '700', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                <span>Total Net Direct Cash Payouts</span>
                <span style={{ color: 'var(--success)' }}>$28,050.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAFF ONBOARD MODAL */}
      {empModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px' }}>Onboard New Employee Profile</h3>
            <form onSubmit={submitEmployee}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Full Legal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={empFormData.name}
                    onChange={e => setEmpFormData({ ...empFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Primary Department</label>
                  <select
                    className="form-control"
                    value={empFormData.department}
                    onChange={e => setEmpFormData({ ...empFormData, department: e.target.value })}
                  >
                    <option value="Executive">Executive Office</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Operations & Logistics">Operations & Logistics</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Job Title Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Sales Executive, Logistics Clerk..."
                    value={empFormData.designation}
                    onChange={e => setEmpFormData({ ...empFormData, designation: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Core Shift Schedule</label>
                  <input
                    type="text"
                    className="form-control"
                    value={empFormData.shift}
                    onChange={e => setEmpFormData({ ...empFormData, shift: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Base Salary ($ / Month)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={empFormData.salary}
                    onChange={e => setEmpFormData({ ...empFormData, salary: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sales Commission Rate (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={empFormData.commissionRate}
                    onChange={e => setEmpFormData({ ...empFormData, commissionRate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={empFormData.phone}
                    onChange={e => setEmpFormData({ ...empFormData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Corporate Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={empFormData.email}
                    onChange={e => setEmpFormData({ ...empFormData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEmpModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Onboard Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYROLL VOUCHER SLIP MODAL */}
      {payrollModalOpen && payrollReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', fontFamily: 'monospace' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '4px' }}>PAYROLL SALARY DISBURSEMENT</h3>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
              Ref: {payrollReceipt.id} | Date Issued: {payrollReceipt.date}
            </div>

            <div style={{ textAlign: 'left', margin: '16px 0', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="flex-between">
                <span>Employee Name:</span>
                <span style={{ fontWeight: 'bold' }}>{payrollReceipt.empName}</span>
              </div>
              <div className="flex-between">
                <span>Department:</span>
                <span>{payrollReceipt.department}</span>
              </div>
              <div className="flex-between">
                <span>Job Designation:</span>
                <span>{payrollReceipt.designation}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)' }} />
              <div className="flex-between">
                <span>Monthly Base Salary:</span>
                <span>${payrollReceipt.salary.toFixed(2)}</span>
              </div>
              <div className="flex-between">
                <span>Commission Earnings:</span>
                <span style={{ color: 'var(--success)' }}>+${payrollReceipt.commission.toFixed(2)}</span>
              </div>
              <div className="flex-between">
                <span>Withholding Tax (15%):</span>
                <span style={{ color: 'var(--danger)' }}>-${payrollReceipt.deductions.toFixed(2)}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)' }} />
              <div className="flex-between" style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--accent)' }}>
                <span>Net Direct Take-Home:</span>
                <span>${payrollReceipt.net.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Direct Bank Ledger Transfer Complete. Reconciled in SG&A general accounts.
            </div>

            <button className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={() => setPayrollModalOpen(false)}>
              Reconcile & Close Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
