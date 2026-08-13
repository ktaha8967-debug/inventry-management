import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PlusIcon } from '../components/Icons';

export default function TasksCalendar() {
  const {
    tasks,
    addTask,
    toggleTaskStatus,
    users
  } = useAppData();

  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'calendar'

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskAssignee, setTaskAssignee] = useState(users[0]?.id || '');

  // Calendar State (Current month overview - Mock dates for July 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate) return;

    addTask({
      title: taskTitle,
      description: taskDesc,
      dueDate: taskDueDate,
      priority: taskPriority,
      assignedTo: taskAssignee
    });

    alert('Task assigned successfully.');
    setTaskTitle('');
    setTaskDesc('');
    setTaskDueDate('');
  };

  // Find calendar events/tasks for a specific date
  const getTasksForDate = (dayNum) => {
    const formattedDay = `2026-07-${String(dayNum).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === formattedDay);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0', fontWeight: '800' }}>Calendar & Task Scheduling</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Assign operations to-dos, schedule meetings, and trace deadlines in the calendar grid.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>To-Do Tasks Lists</button>
        <button className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>Operations Calendar</button>
      </div>

      {/* 1. TO-DO TASKS LISTS */}
      {activeTab === 'tasks' && (
        <div className="grid-2">
          {/* Create Task Card */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Register Operations Task</h3>
            <form onSubmit={handleTaskSubmit}>
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Audit NY Warehouse Shelf A..."
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Scope Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    className="form-control"
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Staff Member</label>
                <select
                  className="form-control"
                  value={taskAssignee}
                  onChange={e => setTaskAssignee(e.target.value)}
                >
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} (@{u.username})</option>)}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Task Assignment</button>
            </form>
          </div>

          {/* Active Tasks list */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Active Assignments Ledger</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {tasks.map(t => {
                const staff = users.find(x => x.id === t.assignedTo);
                return (
                  <div key={t.id} style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: `3px solid ${t.priority === 'High' ? 'var(--danger)' : 'var(--warning)'}` }}>
                    <div className="flex-between">
                      <span style={{ fontWeight: '700', textDecoration: t.status === 'Completed' ? 'line-through' : 'none' }}>{t.title}</span>
                      <input
                        type="checkbox"
                        checked={t.status === 'Completed'}
                        onChange={() => toggleTaskStatus(t.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    {t.description && <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{t.description}</p>}
                    <div className="flex-between" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      <span>Due: {t.dueDate} | Assigned to: {staff ? staff.name : 'Unassigned'}</span>
                      <span className="status-pill active" style={{ fontSize: '8px', padding: '1px 4px' }}>{t.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. OPERATIONS CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>JULY 2026</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {/* Blank padding days for alignment (July 2026 starts on Wednesday, so Wednesday is day 1. Sunday, Monday, Tuesday are empty padding) */}
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`pad-${idx}`} style={{ height: '80px', backgroundColor: 'transparent' }}></div>
            ))}

            {daysInMonth.map(dayNum => {
              const dayTasks = getTasksForDate(dayNum);
              return (
                <div key={dayNum} style={{ height: '85px', padding: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', flexDirection: 'column', border: dayTasks.length > 0 ? '1px solid var(--accent)' : '1px solid transparent' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>{dayNum}</div>
                  <div style={{ flexGrow: '1', overflowY: 'auto', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {dayTasks.map(t => (
                      <span key={t.id} style={{ fontSize: '8px', backgroundColor: 'var(--accent)', color: 'white', padding: '1px 3px', borderRadius: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.title}>
                        {t.title}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
