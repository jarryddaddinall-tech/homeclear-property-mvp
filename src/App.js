import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Clock, 
  Users, 
  DollarSign, 
  MessageSquare, 
  FileText, 
  Wrench, 
  CheckSquare,
  Search,
  Bell,
  Menu,
  Download,
  Upload
} from 'lucide-react';
import './App.css';

// Data management hooks
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [value, setStoredValue];
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [timelineEvents, setTimelineEvents] = useLocalStorage('hc.timelineEvents', []);
  const [parties, setParties] = useLocalStorage('hc.parties', [
    { id: 1, role: 'Solicitor', name: 'Emma Wilson', company: 'Wilson & Partners', email: 'emma@wilsonpartners.co.uk', phone: '0161 123 4567', lastContactedISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Specializes in residential conveyancing' },
    { id: 2, role: 'Estate Agent', name: 'James Parker', company: 'Parker & Co Estate Agents', email: 'james@parkerco.co.uk', phone: '0161 234 5678', lastContactedISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Very responsive, good local knowledge' }
  ]);
  const [tasks, setTasks] = useLocalStorage('hc.tasks', [
    { id: 1, title: 'Review contract terms', dueISO: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), done: false, relatedEventId: null, createdAt: new Date().toISOString() },
    { id: 2, title: 'Submit mortgage documents', dueISO: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), done: false, relatedEventId: null, createdAt: new Date().toISOString() },
    { id: 3, title: 'Book survey appointment', dueISO: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), done: false, relatedEventId: null, createdAt: new Date().toISOString() }
  ]);
  const [messages, setMessages] = useLocalStorage('hc.messages', []);
  const [property, setProperty] = useLocalStorage('hc.property', {
    address: '45 Oak Avenue, Manchester M1 2AB',
    purchasePrice: 285000,
    expectedCompletion: '2025-11-15'
  });
  const [showSaved, setShowSaved] = useState(false);
  
  // REACT POWER: Real-time state management
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date());

  // REACT POWER: useEffect hooks for real-time features
  useEffect(() => {
    // Real-time clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Simulate live updates (in real app, this would be WebSocket/SSE)
    const simulateUpdate = () => {
      const updates = [
        'Emma Wilson is reviewing your contract...',
        'James Parker sent a message about viewing times',
        'Survey report is being prepared',
        'Mortgage application status updated',
        'Legal searches completed'
      ];
      
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      setLiveUpdates(prev => [...prev.slice(-4), {
        id: Date.now(),
        message: randomUpdate,
        timestamp: new Date(),
        type: 'info'
      }]);
    };

    const interval = setInterval(simulateUpdate, 15000); // Every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto-save indicator
  const showSavedIndicator = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // REACT POWER: Dynamic calculations
  const progressPercentage = Math.min(100, (timelineEvents.length * 15) + 20);
  const upcomingTasks = tasks.filter(task => 
    !task.done && new Date(task.dueISO) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const overdueTasks = tasks.filter(task => 
    !task.done && new Date(task.dueISO) < new Date()
  );

  // Navigation
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'timeline', label: 'Live Timeline', icon: Clock },
    { id: 'team', label: 'Your Team', icon: Users },
    { id: 'fees', label: 'Fees & Costs', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'tradespeople', label: 'Find Tradespeople', icon: Wrench },
    { id: 'checklist', label: 'Move-In Checklist', icon: CheckSquare },
    { id: 'property-search', label: 'Property Search', icon: Search }
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">HomeClear</div>
        <div className="user-info">
          {/* REACT POWER: Real-time status indicators */}
          <div className="status-indicators">
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
              <div className="status-dot"></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="live-time">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="notification-badge">
            <Bell size={20} />
            {liveUpdates.length > 0 && <span className="badge-dot"></span>}
          </div>
          
          <div className="data-menu">
            <Menu size={20} />
            <div className="data-menu-dropdown">
              <button onClick={() => exportData()}>
                <Download size={16} />
                Export Data
              </button>
              <button onClick={() => importData()}>
                <Upload size={16} />
                Import Data
              </button>
            </div>
          </div>
          <div className="user-name">Sarah Thompson</div>
        </div>
      </header>

      <div className="layout">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="nav-section">
            <div className="nav-section-title">Purchase Journey</div>
            {navigation.slice(0, 8).map(item => (
              <div 
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Property Search</div>
            <div 
              className={`nav-item ${currentView === 'property-search' ? 'active' : ''}`}
              onClick={() => setCurrentView('property-search')}
            >
              <Search size={20} />
              <span>Property Search</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {currentView === 'dashboard' && (
            <DashboardView 
              timelineEvents={timelineEvents}
              tasks={tasks}
              liveUpdates={liveUpdates}
              progressPercentage={progressPercentage}
              upcomingTasks={upcomingTasks}
              overdueTasks={overdueTasks}
            />
          )}
          {currentView === 'timeline' && <TimelineView />}
          {currentView === 'team' && <TeamView />}
          {currentView === 'fees' && <FeesView />}
          {currentView === 'messages' && <MessagesView />}
          {currentView === 'documents' && <DocumentsView />}
          {currentView === 'tradespeople' && <TradespeopleView />}
          {currentView === 'checklist' && <ChecklistView />}
          {currentView === 'property-search' && <PropertySearchView />}
        </main>
      </div>

      {/* Saved Indicator */}
      {showSaved && (
        <div className="saved-indicator">
          Saved
        </div>
      )}
    </div>
  );
}

// Dashboard View Component - REACT POWER: Dynamic and reactive
function DashboardView({ timelineEvents, tasks, liveUpdates, progressPercentage, upcomingTasks, overdueTasks }) {
  const [showLiveUpdates, setShowLiveUpdates] = useState(false);

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your property purchase overview</p>
      </div>
      
      {/* REACT POWER: Dynamic alerts based on state */}
      <div className={`alert ${overdueTasks.length > 0 ? 'alert-error' : 'alert-info'}`}>
        🏠 <strong>Your purchase:</strong> 45 Oak Avenue, Manchester
        {overdueTasks.length > 0 ? (
          <span> · ⚠️ {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}</span>
        ) : (
          <span> · Review contract by Friday</span>
        )}
      </div>

      {/* REACT POWER: Live updates panel */}
      {liveUpdates.length > 0 && (
        <div className="live-updates-panel">
          <div className="live-updates-header" onClick={() => setShowLiveUpdates(!showLiveUpdates)}>
            <span>🔄 Live Updates ({liveUpdates.length})</span>
            <span className="live-updates-toggle">{showLiveUpdates ? '▼' : '▶'}</span>
          </div>
          {showLiveUpdates && (
            <div className="live-updates-content">
              {liveUpdates.slice(-3).map(update => (
                <div key={update.id} className="live-update-item">
                  <div className="live-update-time">{update.timestamp.toLocaleTimeString()}</div>
                  <div className="live-update-message">{update.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="progress-section">
        <div className="progress-header">
          <h3>Purchase Progress</h3>
          {/* REACT POWER: Dynamic percentage calculation */}
          <span className="progress-percentage">{progressPercentage}% Complete</span>
        </div>
        <div className="progress-bar">
          {/* REACT POWER: Animated progress bar */}
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progressPercentage}%`,
              transition: 'width 0.6s ease'
            }}
          ></div>
        </div>
        <div className="progress-stages">
          <div className="stage-item completed">
            <div className="stage-icon">✓</div>
            <div className="stage-name">Offer Accepted</div>
            <div className="stage-date">8 Oct 2025</div>
          </div>
          <div className="stage-item completed">
            <div className="stage-icon">✓</div>
            <div className="stage-name">Searches Complete</div>
            <div className="stage-date">19 Oct 2025</div>
          </div>
          <div className="stage-item active">
            <div className="stage-icon">⏳</div>
            <div className="stage-name">With Solicitors</div>
            <div className="stage-date">In progress</div>
          </div>
          <div className="stage-item">
            <div className="stage-icon">○</div>
            <div className="stage-name">Exchange</div>
            <div className="stage-date">Expected 5 Nov</div>
          </div>
          <div className="stage-item">
            <div className="stage-icon">○</div>
            <div className="stage-name">Completion</div>
            <div className="stage-date">15 Nov 2025</div>
          </div>
        </div>
      </div>

      {/* REACT POWER: Stunning Property Card */}
      <div className="property-card">
        <div className="property-header">
          <div className="property-avatar">
            <div className="house-icon">🏠</div>
            <div className="property-status">Active</div>
          </div>
          <div className="property-main-info">
            <div className="property-price">£{property.purchasePrice.toLocaleString()}</div>
            <div className="property-address">{property.address}</div>
            <div className="property-details">
              <span className="property-type">3 Bed • 2 Bath</span>
              <span className="property-size">1,200 sq ft</span>
            </div>
          </div>
        </div>
        
        <div className="property-timeline">
          <div className="timeline-item">
            <div className="timeline-icon completed">✅</div>
            <div className="timeline-content">
              <div className="timeline-title">Offer Accepted</div>
              <div className="timeline-date">8 Oct 2025</div>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon active">⏳</div>
            <div className="timeline-content">
              <div className="timeline-title">With Solicitors</div>
              <div className="timeline-date">In Progress</div>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon pending">○</div>
            <div className="timeline-content">
              <div className="timeline-title">Completion</div>
              <div className="timeline-date">{new Date(property.expectedCompletion).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        
        <div className="property-stats">
          <div className="stat-item">
            <div className="stat-label">Days Remaining</div>
            <div className="stat-value">{Math.ceil((new Date(property.expectedCompletion) - new Date()) / (1000 * 60 * 60 * 24))}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Market Value</div>
            <div className="stat-value">£{Math.floor(property.purchasePrice * 0.95).toLocaleString()}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Price/sq ft</div>
            <div className="stat-value">£{Math.floor(property.purchasePrice / 1200)}</div>
          </div>
        </div>
        
        <div className="property-actions">
          <button className="action-btn primary">View Details</button>
          <button className="action-btn secondary">Share Update</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Recent Activity</h3>
          <div className="timeline">
            <div className="timeline-item new">
              <div className="timeline-date">Today, 14:23</div>
              <div className="timeline-title">Contract received</div>
              <div className="timeline-content">Your solicitor has received the draft contract and will review within 48 hours.</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Yesterday, 09:42</div>
              <div className="timeline-title">Message from estate agent</div>
              <div className="timeline-content">Good news - the seller has confirmed they can be flexible on the completion date.</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3>Next Steps</h3>
          <div className="next-steps">
            {/* REACT POWER: Dynamic task rendering */}
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <div key={task.id} className={`next-step ${overdueTasks.includes(task) ? 'overdue' : ''}`}>
                  <strong>{task.title}</strong> - Due {new Date(task.dueISO).toLocaleDateString()}
                  {overdueTasks.includes(task) && <span className="overdue-badge">OVERDUE</span>}
                </div>
              ))
            ) : (
              <div className="next-step success">✅ No upcoming tasks!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline View Component - Trello-style "Where is my order" UI
function TimelineView() {
  const [selectedStage, setSelectedStage] = useState(null);
  
  // REACT POWER: Trello-style stages with cards
  const stages = [
    {
      id: 'offer',
      title: 'Offer Accepted',
      status: 'completed',
      date: '8 Oct 2025',
      cards: [
        {
          id: 1,
          title: 'Offer submitted',
          content: 'Initial offer of £285,000 submitted',
          status: 'done',
          assignee: 'You',
          date: '8 Oct 2025'
        },
        {
          id: 2,
          title: 'Offer accepted',
          content: 'Seller accepted offer with completion date flexibility',
          status: 'done',
          assignee: 'James Parker',
          date: '8 Oct 2025'
        }
      ]
    },
    {
      id: 'searches',
      title: 'Legal Searches',
      status: 'completed',
      date: '19 Oct 2025',
      cards: [
        {
          id: 3,
          title: 'Local authority search',
          content: 'No planning issues or restrictions found',
          status: 'done',
          assignee: 'Emma Wilson',
          date: '15 Oct 2025'
        },
        {
          id: 4,
          title: 'Environmental search',
          content: 'No environmental concerns identified',
          status: 'done',
          assignee: 'Emma Wilson',
          date: '17 Oct 2025'
        }
      ]
    },
    {
      id: 'solicitors',
      title: 'With Solicitors',
      status: 'active',
      date: 'In progress',
      cards: [
        {
          id: 5,
          title: 'Contract received',
          content: 'Draft contract received from seller\'s solicitor',
          status: 'received',
          assignee: 'Emma Wilson',
          date: 'Today, 14:23'
        },
        {
          id: 6,
          title: 'Contract review',
          content: 'Reviewing contract terms and conditions',
          status: 'pending',
          assignee: 'Emma Wilson',
          date: 'Due tomorrow'
        }
      ]
    },
    {
      id: 'exchange',
      title: 'Exchange',
      status: 'pending',
      date: 'Expected 5 Nov',
      cards: [
        {
          id: 7,
          title: 'Final contract review',
          content: 'All parties to review final contract',
          status: 'pending',
          assignee: 'Emma Wilson',
          date: 'Due 3 Nov'
        }
      ]
    },
    {
      id: 'completion',
      title: 'Completion',
      status: 'pending',
      date: '15 Nov 2025',
      cards: [
        {
          id: 8,
          title: 'Completion preparation',
          content: 'Prepare for completion day',
          status: 'pending',
          assignee: 'Emma Wilson',
          date: 'Due 14 Nov'
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return '#22c55e';
      case 'received': return '#f59e0b';
      case 'pending': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return '✅';
      case 'received': return '📥';
      case 'pending': return '⏳';
      default: return '○';
    }
  };

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">Purchase Pipeline</h1>
        <p className="page-subtitle">Track your property purchase like a delivery - see exactly where everything is</p>
        <button className="btn btn-primary">＋ Add Update</button>
      </div>
      
      {/* REACT POWER: Trello-style board */}
      <div className="trello-board">
        {stages.map((stage, index) => (
          <div key={stage.id} className={`trello-column ${stage.status}`}>
            <div className="trello-column-header">
              <div className="stage-title">
                <span className="stage-icon">
                  {stage.status === 'completed' ? '✅' : 
                   stage.status === 'active' ? '⏳' : '○'}
                </span>
                <span>{stage.title}</span>
              </div>
              <div className="stage-date">{stage.date}</div>
            </div>
            
            <div className="trello-cards">
              {stage.cards.map(card => (
                <div 
                  key={card.id} 
                  className={`trello-card ${card.status}`}
                  onClick={() => setSelectedStage(card)}
                >
                  <div className="card-header">
                    <div className="card-status" style={{ backgroundColor: getStatusColor(card.status) }}>
                      {getStatusIcon(card.status)}
                    </div>
                    <div className="card-title">{card.title}</div>
                  </div>
                  
                  <div className="card-content">
                    {card.content}
                  </div>
                  
                  <div className="card-footer">
                    <div className="card-assignee">
                      <span className="assignee-avatar">
                        {card.assignee === 'You' ? '👤' : 
                         card.assignee === 'Emma Wilson' ? '👩‍💼' : '👨‍💼'}
                      </span>
                      <span>{card.assignee}</span>
                    </div>
                    <div className="card-date">{card.date}</div>
                  </div>
                  
                  {/* REACT POWER: Hover actions */}
                  <div className="card-actions">
                    <button className="action-btn">✏️</button>
                    <button className="action-btn">🗑️</button>
                  </div>
                </div>
              ))}
              
              {/* Add new card button */}
              <button className="add-card-btn">
                ＋ Add Update
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* REACT POWER: Card detail modal */}
      {selectedStage && (
        <div className="card-modal-overlay" onClick={() => setSelectedStage(null)}>
          <div className="card-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedStage.title}</h3>
              <button onClick={() => setSelectedStage(null)}>✕</button>
            </div>
            <div className="modal-content">
              <p>{selectedStage.content}</p>
              <div className="modal-details">
                <div><strong>Assignee:</strong> {selectedStage.assignee}</div>
                <div><strong>Date:</strong> {selectedStage.date}</div>
                <div><strong>Status:</strong> 
                  <span style={{ color: getStatusColor(selectedStage.status) }}>
                    {selectedStage.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary">Edit</button>
              <button className="btn btn-primary">Update Status</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Team View Component
function TeamView() {
  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">Your Team</h1>
        <p className="page-subtitle">Everyone involved in your property purchase</p>
        <button className="btn btn-primary">＋ Add Person</button>
      </div>
      
      <div className="team-grid">
        <div className="person-card">
          <div className="person-header">
            <div>
              <div className="person-name">Emma Wilson</div>
              <div className="person-role">Solicitor</div>
              <div className="person-company">Wilson & Partners</div>
              <div className="person-contact">
                📧 emma@wilsonpartners.co.uk<br/>
                📞 0161 123 4567<br/>
                Last contacted: <span>2 days ago</span>
              </div>
            </div>
            <div className="person-status">Active</div>
          </div>
          <div className="person-actions">
            <button className="btn-small">📞 Log Call</button>
            <button className="btn-small">💬 Log Message</button>
            <button className="btn-small">✏️ Edit</button>
          </div>
        </div>
        
        <div className="person-card">
          <div className="person-header">
            <div>
              <div className="person-name">James Parker</div>
              <div className="person-role">Estate Agent</div>
              <div className="person-company">Parker & Co Estate Agents</div>
              <div className="person-contact">
                📧 james@parkerco.co.uk<br/>
                📞 0161 234 5678<br/>
                Last contacted: <span>1 day ago</span>
              </div>
            </div>
            <div className="person-status">Active</div>
          </div>
          <div className="person-actions">
            <button className="btn-small">📞 Log Call</button>
            <button className="btn-small">💬 Log Message</button>
            <button className="btn-small">✏️ Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Property Search View Component
function PropertySearchView() {
  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">🔍 Property Search & Valuation</h1>
        <p className="page-subtitle">Find properties and get instant valuations</p>
      </div>
      
      <div className="card">
        <h3>📍 Search Properties</h3>
        <div className="search-form">
          <input 
            type="text" 
            placeholder="Enter postcode or address (e.g. M1 2AB)"
            className="search-input"
          />
          <button className="btn btn-primary">🔍 Search</button>
        </div>
        <div className="search-results">
          <div className="search-placeholder">
            Enter a postcode to search for properties and get valuations
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>💰 Property Valuation</h3>
        <div className="valuation-results">
          <div className="valuation-placeholder">
            Search for a property to see valuation and market analysis
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>📊 Market Analysis</h3>
        <div className="market-analysis">
          <div className="market-placeholder">
            Market analysis will appear after property search
          </div>
        </div>
      </div>
    </div>
  );
}

// Other view components (simplified for now)
function FeesView() { return <div className="view"><h1>Fees & Costs</h1></div>; }
function MessagesView() { return <div className="view"><h1>Messages</h1></div>; }
function DocumentsView() { return <div className="view"><h1>Documents</h1></div>; }
function TradespeopleView() { return <div className="view"><h1>Find Tradespeople</h1></div>; }
function ChecklistView() { return <div className="view"><h1>Move-In Checklist</h1></div>; }

// Export/Import functions
const exportData = () => {
  const data = {
    timelineEvents: JSON.parse(localStorage.getItem('hc.timelineEvents') || '[]'),
    parties: JSON.parse(localStorage.getItem('hc.parties') || '[]'),
    tasks: JSON.parse(localStorage.getItem('hc.tasks') || '[]'),
    messages: JSON.parse(localStorage.getItem('hc.messages') || '[]'),
    property: JSON.parse(localStorage.getItem('hc.property') || '{}'),
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `homeclear-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const importData = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.timelineEvents) localStorage.setItem('hc.timelineEvents', JSON.stringify(data.timelineEvents));
          if (data.parties) localStorage.setItem('hc.parties', JSON.stringify(data.parties));
          if (data.tasks) localStorage.setItem('hc.tasks', JSON.stringify(data.tasks));
          if (data.messages) localStorage.setItem('hc.messages', JSON.stringify(data.messages));
          if (data.property) localStorage.setItem('hc.property', JSON.stringify(data.property));
          alert('Data imported successfully!');
          window.location.reload();
        } catch (error) {
          alert('Error reading file. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

export default App;
