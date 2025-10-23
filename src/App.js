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
  Upload,
  ChevronLeft,
  ChevronRight,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  BarChart3
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

// Data export/import functions
const exportData = () => {
  const data = {
    timelineEvents: JSON.parse(localStorage.getItem('hc.timelineEvents') || '[]'),
    parties: JSON.parse(localStorage.getItem('hc.parties') || '[]'),
    people: JSON.parse(localStorage.getItem('hc.people') || '[]'),
    tasks: JSON.parse(localStorage.getItem('hc.tasks') || '[]'),
    messages: JSON.parse(localStorage.getItem('hc.messages') || '[]'),
    property: JSON.parse(localStorage.getItem('hc.property') || '{}')
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'homeclear-data.json';
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
          if (data.people) localStorage.setItem('hc.people', JSON.stringify(data.people));
          if (data.tasks) localStorage.setItem('hc.tasks', JSON.stringify(data.tasks));
          if (data.messages) localStorage.setItem('hc.messages', JSON.stringify(data.messages));
          if (data.property) localStorage.setItem('hc.property', JSON.stringify(data.property));
          window.location.reload();
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

// Main App Component - Fixed for Vercel deployment
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [timelineEvents, setTimelineEvents] = useLocalStorage('hc.timelineEvents', []);
  const [parties, setParties] = useLocalStorage('hc.parties', [
    { id: 1, role: 'Solicitor', name: 'Emma Wilson', company: 'Wilson & Partners', email: 'emma@wilsonpartners.co.uk', phone: '0161 123 4567', lastContactedISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Specializes in residential conveyancing' },
    { id: 2, role: 'Estate Agent', name: 'James Parker', company: 'Parker & Co Estate Agents', email: 'james@parkerco.co.uk', phone: '0161 234 5678', lastContactedISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Very responsive, good local knowledge' }
  ]);
  const [people, setPeople] = useLocalStorage('hc.people', []);
  const [properties, setProperties] = useLocalStorage('hc.properties', []);
  const [projects, setProjects] = useLocalStorage('hc.projects', []);
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

  // Navigation Structure
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const mainNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, type: 'main' },
    { 
      id: 'people', 
      label: 'People', 
      icon: Users, 
      type: 'section',
      children: [
        { id: 'people-all', label: 'All Contacts', icon: Users },
        { id: 'people-buyers', label: 'Buyers', icon: Users },
        { id: 'people-sellers', label: 'Sellers', icon: Users },
        { id: 'people-tenants', label: 'Tenants', icon: Users },
        { id: 'people-contractors', label: 'Contractors', icon: Wrench },
        { id: 'people-agents', label: 'Agents', icon: Users }
      ]
    },
    { 
      id: 'properties', 
      label: 'Properties', 
      icon: Home, 
      type: 'section',
      children: [
        { id: 'properties-all', label: 'All Properties', icon: Home },
        { id: 'properties-for-sale', label: 'For Sale', icon: Home },
        { id: 'properties-for-rent', label: 'For Rent', icon: Home },
        { id: 'properties-renovation', label: 'In Renovation', icon: Wrench },
        { id: 'properties-sold', label: 'Sold', icon: CheckSquare }
      ]
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: Clock, 
      type: 'section',
      children: [
        { id: 'projects-active', label: 'Active Projects', icon: Clock },
        { id: 'projects-completed', label: 'Completed', icon: CheckSquare },
        { id: 'projects-planned', label: 'Planned', icon: Clock }
      ]
    }
  ];

  const secondNavigation = [
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'reports', label: 'Reports', icon: DollarSign }
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
        <nav className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="logo">Property<span className="logo-accent">Axis</span></div>
            <button 
              className="sidebar-toggle"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Main Menu</div>
            {mainNavigation.map(item => (
              <div key={item.id}>
                <div 
                  className={`nav-item ${currentView === item.id ? 'active' : ''} ${item.type === 'section' ? 'nav-section-header' : ''}`}
                  onClick={() => {
                    if (item.type === 'section') {
                      toggleSection(item.id);
                    } else {
                      setCurrentView(item.id);
                    }
                  }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                  {item.type === 'section' && (
                    <span className={`nav-arrow ${expandedSections[item.id] ? 'expanded' : ''}`}>
                      ▶
                    </span>
                  )}
                </div>
                
                {item.type === 'section' && expandedSections[item.id] && item.children && (
                  <div className="nav-subsection">
                    {item.children.map(child => (
                      <div 
                        key={child.id}
                        className={`nav-subitem ${currentView === child.id ? 'active' : ''}`}
                        onClick={() => setCurrentView(child.id)}
                      >
                        <child.icon size={16} />
                        <span>{child.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Second Menu</div>
            {secondNavigation.map(item => (
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
        </nav>

        {/* Main Content */}
        <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {currentView === 'dashboard' && (
            <DashboardOverview 
              people={people}
              properties={properties}
              projects={projects}
            />
          )}
          
          {/* People Section */}
          {(currentView === 'people' || currentView.startsWith('people-')) && (
            <PeopleSection 
              currentView={currentView}
              people={people}
              setPeople={setPeople}
              properties={properties}
              projects={projects}
            />
          )}
          
          {/* Properties Section */}
          {(currentView === 'properties' || currentView.startsWith('properties-')) && (
            <PropertiesSection 
              currentView={currentView}
              properties={properties}
              setProperties={setProperties}
              people={people}
              projects={projects}
            />
          )}
          
          {/* Projects Section */}
          {(currentView === 'projects' || currentView.startsWith('projects-')) && (
            <ProjectsSection 
              currentView={currentView}
              projects={projects}
              setProjects={setProjects}
              people={people}
              properties={properties}
            />
          )}
          
          {/* Legacy Views */}
          {currentView === 'timeline' && <TimelineView />}
          {currentView === 'documents' && <DocumentsView />}
          {currentView === 'reports' && <ReportsView />}
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

// Dashboard Overview - Three Core Entities
function DashboardOverview({ people, properties, projects }) {
  const totalPeople = people.length;
  const totalProperties = properties.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  
  const peopleByRole = people.reduce((acc, person) => {
    const role = person.role || 'Other';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  
  const propertiesByStatus = properties.reduce((acc, property) => {
    const status = property.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  const projectsByPhase = projects.reduce((acc, project) => {
    const phase = project.phase || 'Planning';
    acc[phase] = (acc[phase] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your property management</p>
      </div>
      
      {/* Main Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon people">
              <Users size={20} />
            </div>
            <div className="stat-title">Total People</div>
          </div>
          <div className="stat-number">{totalPeople}</div>
          <div className="stat-breakdown">
            {Object.entries(peopleByRole).slice(0, 3).map(([role, count]) => (
              <div key={role} className="breakdown-item">
                <span className="breakdown-label">{role}:</span>
                <span className="breakdown-value">{count}</span>
              </div>
            ))}
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <BarChart3 size={16} />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon properties">
              <Building size={20} />
            </div>
            <div className="stat-title">Total Properties</div>
          </div>
          <div className="stat-number">{totalProperties}</div>
          <div className="stat-breakdown">
            {Object.entries(propertiesByStatus).slice(0, 3).map(([status, count]) => (
              <div key={status} className="breakdown-item">
                <span className="breakdown-label">{status}:</span>
                <span className="breakdown-value">{count}</span>
              </div>
            ))}
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <BarChart3 size={16} />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon projects">
              <Clock size={20} />
            </div>
            <div className="stat-title">Active Projects</div>
          </div>
          <div className="stat-number">{activeProjects}</div>
          <div className="stat-breakdown">
            {Object.entries(projectsByPhase).slice(0, 3).map(([phase, count]) => (
              <div key={phase} className="breakdown-item">
                <span className="breakdown-label">{phase}:</span>
                <span className="breakdown-value">{count}</span>
              </div>
            ))}
          </div>
          <div className="stat-chart">
            <div className="mini-chart">
              <BarChart3 size={16} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <button className="action-card" onClick={() => setCurrentView('people-all')}>
            <div className="action-icon">
              <Users size={16} />
            </div>
            <div className="action-title">Add Person</div>
          </button>
          <button className="action-card" onClick={() => setCurrentView('properties-all')}>
            <div className="action-icon">
              <Building size={16} />
            </div>
            <div className="action-title">Add Property</div>
          </button>
          <button className="action-card" onClick={() => setCurrentView('projects-active')}>
            <div className="action-icon">
              <Clock size={16} />
            </div>
            <div className="action-title">Start Project</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Dashboard V2 - Customer-Centric View (Legacy)
function DashboardView({ timelineEvents, tasks, liveUpdates, progressPercentage, upcomingTasks, overdueTasks, property }) {
  const [showLiveUpdates, setShowLiveUpdates] = useState(false);

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">Welcome back, Nick</h1>
        <p className="page-subtitle">Your journey to homeownership</p>
      </div>
      
      {/* REACT POWER: Dynamic alerts based on state */}
      <div className={`alert ${overdueTasks.length > 0 ? 'alert-error' : 'alert-info'}`}>
        <Building size={16} /> <strong>Your purchase:</strong> 45 Oak Avenue, Manchester
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
            <div className="house-icon">
              <Building size={20} />
            </div>
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
                <Mail size={14} /> emma@wilsonpartners.co.uk<br/>
                <Phone size={14} /> 0161 123 4567<br/>
                Last contacted: <span>2 days ago</span>
              </div>
            </div>
            <div className="person-status">Active</div>
          </div>
          <div className="person-actions">
            <button className="btn-small">
              <Phone size={14} /> Log Call
            </button>
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
                <Mail size={14} /> james@parkerco.co.uk<br/>
                <Phone size={14} /> 0161 234 5678<br/>
                Last contacted: <span>1 day ago</span>
              </div>
            </div>
            <div className="person-status">Active</div>
          </div>
          <div className="person-actions">
            <button className="btn-small">
              <Phone size={14} /> Log Call
            </button>
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
        <h3><MapPin size={16} /> Search Properties</h3>
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
        <h3><BarChart3 size={16} /> Market Analysis</h3>
        <div className="market-analysis">
          <div className="market-placeholder">
            Market analysis will appear after property search
          </div>
        </div>
      </div>
    </div>
  );
}

// People Section Component
function PeopleSection({ currentView, people, setPeople, properties, projects }) {
  const getFilteredPeople = () => {
    switch (currentView) {
      case 'people-buyers':
        return people.filter(p => p.role === 'Buyer');
      case 'people-sellers':
        return people.filter(p => p.role === 'Seller');
      case 'people-tenants':
        return people.filter(p => p.role === 'Tenant');
      case 'people-contractors':
        return people.filter(p => p.role === 'Contractor');
      case 'people-agents':
        return people.filter(p => p.role === 'Agent');
      default:
        return people;
    }
  };

  const filteredPeople = getFilteredPeople();
  const sectionTitle = currentView === 'people' ? 'All Contacts' : 
    currentView.replace('people-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">{sectionTitle}</h1>
        <p className="page-subtitle">Manage your contacts and relationships</p>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setCurrentView('add-person')}>
            + Add Person
          </button>
        </div>
      </div>
      
      {currentView === 'add-person' ? (
        <AddPersonView people={people} setPeople={setPeople} />
      ) : (
        <PeopleListView people={filteredPeople} setPeople={setPeople} />
      )}
    </div>
  );
}

// Add Person View Component
function AddPersonView({ people, setPeople }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'Buyer',
    propertyType: 'House to Rent Out',
    budget: '',
    location: '',
    source: 'Website',
    priority: 'Medium',
    stage: 'Lead',
    notes: '',
    status: 'Active',
    lastContact: '',
    nextFollowUp: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPerson = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      lastContactedISO: new Date().toISOString()
    };
    setPeople([...people, newPerson]);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      role: 'Buyer',
      propertyType: 'House to Rent Out',
      budget: '',
      location: '',
      source: 'Website',
      priority: 'Medium',
      stage: 'Lead',
      notes: '',
      status: 'Active',
      lastContact: '',
      nextFollowUp: ''
    });
    alert('Person added successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">Add New Person</h1>
        <p className="page-subtitle">Add someone who is buying a house to rent out</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="person-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Buyer">Buyer</option>
                <option value="Investor">Investor</option>
                <option value="Landlord">Landlord</option>
                <option value="Property Developer">Property Developer</option>
                <option value="Real Estate Agent">Real Estate Agent</option>
                <option value="Property Manager">Property Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="source">Lead Source</label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
              >
                <option value="House to Rent Out">House to Rent Out</option>
                <option value="Apartment to Rent Out">Apartment to Rent Out</option>
                <option value="Commercial Property">Commercial Property</option>
                <option value="Mixed Use Property">Mixed Use Property</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="budget">Budget (£)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter budget amount"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Preferred Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter preferred location"
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stage">Sales Stage</label>
              <select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
              >
                <option value="Lead">Lead</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastContact">Last Contact Date</label>
              <input
                type="date"
                id="lastContact"
                name="lastContact"
                value={formData.lastContact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nextFollowUp">Next Follow-up Date</label>
              <input
                type="date"
                id="nextFollowUp"
                name="nextFollowUp"
                value={formData.nextFollowUp}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any additional notes about this person..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add Person
            </button>
            <button type="button" className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// People List View Component
function PeopleListView({ people, setPeople }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // cards or table

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'All' || person.stage === filterStage;
    const matchesPriority = filterPriority === 'All' || person.priority === filterPriority;
    return matchesSearch && matchesStage && matchesPriority;
  });

  const deletePerson = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      setPeople(people.filter(person => person.id !== id));
    }
  };

  const updatePersonStage = (id, newStage) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, stage: newStage } : person
    ));
  };

  const updatePersonPriority = (id, newPriority) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, priority: newPriority } : person
    ));
  };

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">CRM Dashboard</h1>
        <p className="page-subtitle">Manage your contacts and sales pipeline</p>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              📋 Cards
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <BarChart3 size={16} /> Table
            </button>
          </div>
        </div>
      </div>

      {/* CRM Stats */}
      <div className="crm-stats">
        <div className="stat-card">
          <div className="stat-number">{people.length}</div>
          <div className="stat-label">Total Contacts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{people.filter(p => p.stage === 'Lead').length}</div>
          <div className="stat-label">Leads</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{people.filter(p => p.stage === 'Qualified').length}</div>
          <div className="stat-label">Qualified</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{people.filter(p => p.stage === 'Closed Won').length}</div>
          <div className="stat-label">Closed Won</div>
        </div>
      </div>

      <div className="card">
        <div className="search-filters">
          <div className="search-group">
            <input
              type="text"
              placeholder="Search by name, email, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Stages</option>
              <option value="Lead">Lead</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="people-grid">
          {filteredPeople.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={32} />
              </div>
              <h3>No contacts found</h3>
              <p>Start by adding your first contact using the "Add Person" page.</p>
            </div>
          ) : (
            filteredPeople.map(person => (
              <div key={person.id} className="crm-person-card">
                <div className="card-header">
                  <div className="person-avatar">
                    <div className="avatar-circle">
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="person-info">
                    <div className="person-name">{person.name}</div>
                    <div className="person-company">{person.company || 'No Company'}</div>
                    <div className="person-role">{person.role}</div>
                  </div>
                  <div className="priority-badge priority-{person.priority}">
                    {person.priority}
                  </div>
                </div>
                
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">
                      <Mail size={12} />
                    </span>
                    <span className="contact-value">{person.email}</span>
                  </div>
                  {person.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <Phone size={12} />
                      </span>
                      <span className="contact-value">{person.phone}</span>
                    </div>
                  )}
                  {person.location && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <MapPin size={12} />
                      </span>
                      <span className="contact-value">{person.location}</span>
                    </div>
                  )}
                </div>

                <div className="crm-details">
                  <div className="detail-row">
                    <span className="detail-label">Stage:</span>
                    <select 
                      value={person.stage} 
                      onChange={(e) => updatePersonStage(person.id, e.target.value)}
                      className="stage-select"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Closed Lost">Closed Lost</option>
                    </select>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Source:</span>
                    <span className="detail-value">{person.source}</span>
                  </div>
                  {person.budget && (
                    <div className="detail-row">
                      <span className="detail-label">Budget:</span>
                      <span className="detail-value">£{parseInt(person.budget).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="crm-actions">
                  <button className="action-btn primary">
                    <Phone size={14} /> Call
                  </button>
                  <button className="action-btn secondary">
                    <Mail size={14} /> Email
                  </button>
                  <button className="action-btn secondary">
                    <MessageSquare size={14} /> Message
                  </button>
                  <button className="action-btn secondary">
                    <Calendar size={14} /> Schedule
                  </button>
                  <button className="action-btn danger" onClick={() => deletePerson(person.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="crm-table">
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Company</th>
                <th>Stage</th>
                <th>Priority</th>
                <th>Budget</th>
                <th>Last Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map(person => (
                <tr key={person.id}>
                  <td>
                    <div className="table-contact">
                      <div className="contact-avatar">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="contact-name">{person.name}</div>
                        <div className="contact-email">{person.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{person.company || '-'}</td>
                  <td>
                    <select 
                      value={person.stage} 
                      onChange={(e) => updatePersonStage(person.id, e.target.value)}
                      className="table-select"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Closed Lost">Closed Lost</option>
                    </select>
                  </td>
                  <td>
                    <span className={`priority-badge priority-${person.priority}`}>
                      {person.priority}
                    </span>
                  </td>
                  <td>{person.budget ? `£${parseInt(person.budget).toLocaleString()}` : '-'}</td>
                  <td>{person.lastContact || '-'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-btn">
                        <Phone size={14} />
                      </button>
                      <button className="table-btn">
                        <Mail size={14} />
                      </button>
                      <button className="table-btn">
                        <Edit size={14} />
                      </button>
                      <button className="table-btn danger" onClick={() => deletePerson(person.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Properties Section Component
function PropertiesSection({ currentView, properties, setProperties, people, projects }) {
  const getFilteredProperties = () => {
    switch (currentView) {
      case 'properties-for-sale':
        return properties.filter(p => p.status === 'For Sale');
      case 'properties-for-rent':
        return properties.filter(p => p.status === 'For Rent');
      case 'properties-renovation':
        return properties.filter(p => p.status === 'In Renovation');
      case 'properties-sold':
        return properties.filter(p => p.status === 'Sold');
      default:
        return properties;
    }
  };

  const filteredProperties = getFilteredProperties();
  const sectionTitle = currentView === 'properties' ? 'All Properties' : 
    currentView.replace('properties-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">{sectionTitle}</h1>
        <p className="page-subtitle">Manage your property portfolio</p>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setCurrentView('add-property')}>
            + Add Property
          </button>
        </div>
      </div>
      
      {currentView === 'add-property' ? (
        <AddPropertyView properties={properties} setProperties={setProperties} people={people} />
      ) : (
        <PropertiesListView properties={filteredProperties} setProperties={setProperties} people={people} />
      )}
    </div>
  );
}

// Add Property View Component
function AddPropertyView({ properties, setProperties, people }) {
  const [formData, setFormData] = useState({
    address: '',
    type: 'House',
    status: 'For Sale',
    purchasePrice: '',
    currentValue: '',
    owner: '',
    beds: '',
    baths: '',
    sqft: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProperty = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      tenants: [],
      projects: [],
      documents: [],
      timeline: []
    };
    setProperties([...properties, newProperty]);
    setFormData({
      address: '',
      type: 'House',
      status: 'For Sale',
      purchasePrice: '',
      currentValue: '',
      owner: '',
      beds: '',
      baths: '',
      sqft: '',
      notes: ''
    });
    alert('Property added successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="person-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Property Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter full address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Property Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
              <option value="In Renovation">In Renovation</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="owner">Owner</label>
            <select
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
            >
              <option value="">Select Owner</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>{person.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="purchasePrice">Purchase Price (£)</label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="Enter purchase price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentValue">Current Value (£)</label>
            <input
              type="number"
              id="currentValue"
              name="currentValue"
              value={formData.currentValue}
              onChange={handleChange}
              placeholder="Enter current value"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="beds">Bedrooms</label>
            <input
              type="number"
              id="beds"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              placeholder="Number of bedrooms"
            />
          </div>
          <div className="form-group">
            <label htmlFor="baths">Bathrooms</label>
            <input
              type="number"
              id="baths"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              placeholder="Number of bathrooms"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sqft">Square Footage</label>
          <input
            type="number"
            id="sqft"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            placeholder="Enter square footage"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Add any additional notes about this property..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Property
          </button>
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Properties List View Component
function PropertiesListView({ properties, setProperties, people }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const deleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(property => property.id !== id));
    }
  };

  return (
    <div className="view">
      <div className="card">
        <div className="search-filters">
          <div className="search-group">
            <input
              type="text"
              placeholder="Search by address or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
              <option value="In Renovation">In Renovation</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
            </select>
          </div>
        </div>
      </div>

      <div className="people-grid">
        {filteredProperties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Building size={32} />
            </div>
            <h3>No properties found</h3>
            <p>Start by adding your first property.</p>
          </div>
        ) : (
          filteredProperties.map(property => (
            <div key={property.id} className="crm-person-card">
              <div className="card-header">
                <div className="person-avatar">
                  <div className="avatar-circle">
                    <Building size={16} />
                  </div>
                </div>
                <div className="person-info">
                  <div className="person-name">{property.address}</div>
                  <div className="person-company">{property.type}</div>
                  <div className="person-role">{property.status}</div>
                </div>
                <div className="priority-badge priority-Medium">
                  {property.status}
                </div>
              </div>
              
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">💰</span>
                  <span className="contact-value">
                    {property.purchasePrice ? `£${parseInt(property.purchasePrice).toLocaleString()}` : 'No price set'}
                  </span>
                </div>
                {property.beds && (
                  <div className="contact-item">
                    <span className="contact-icon">🛏️</span>
                    <span className="contact-value">{property.beds} bed{property.beds > 1 ? 's' : ''}</span>
                  </div>
                )}
                {property.sqft && (
                  <div className="contact-item">
                    <span className="contact-icon">📐</span>
                    <span className="contact-value">{property.sqft} sq ft</span>
                  </div>
                )}
              </div>
              
              <div className="crm-actions">
                <button className="action-btn primary">📋 View</button>
                <button className="action-btn secondary">✏️ Edit</button>
                <button className="action-btn secondary">📄 Documents</button>
                <button className="action-btn danger" onClick={() => deleteProperty(property.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Projects Section Component
function ProjectsSection({ currentView, projects, setProjects, people, properties }) {
  const getFilteredProjects = () => {
    switch (currentView) {
      case 'projects-active':
        return projects.filter(p => p.status === 'Active');
      case 'projects-completed':
        return projects.filter(p => p.status === 'Completed');
      case 'projects-planned':
        return projects.filter(p => p.status === 'Planned');
      default:
        return projects;
    }
  };

  const filteredProjects = getFilteredProjects();
  const sectionTitle = currentView === 'projects' ? 'All Projects' : 
    currentView.replace('projects-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="view">
      <div className="page-header">
        <h1 className="page-title">{sectionTitle}</h1>
        <p className="page-subtitle">Track your property projects and transactions</p>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setCurrentView('add-project')}>
            + Start Project
          </button>
        </div>
      </div>
      
      {currentView === 'add-project' ? (
        <AddProjectView projects={projects} setProjects={setProjects} people={people} properties={properties} />
      ) : (
        <ProjectsListView projects={filteredProjects} setProjects={setProjects} people={people} properties={properties} />
      )}
    </div>
  );
}

// Add Project View Component
function AddProjectView({ projects, setProjects, people, properties }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Purchase',
    status: 'Planned',
    phase: 'Planning',
    property: '',
    people: [],
    startDate: '',
    endDate: '',
    budget: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      tasks: [],
      documents: [],
      timeline: []
    };
    setProjects([...projects, newProject]);
    setFormData({
      name: '',
      type: 'Purchase',
      status: 'Planned',
      phase: 'Planning',
      property: '',
      people: [],
      startDate: '',
      endDate: '',
      budget: '',
      notes: ''
    });
    alert('Project created successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="person-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter project name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Project Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Purchase">Purchase/Acquisition</option>
              <option value="Renovation">Renovation/Refurbishment</option>
              <option value="Sale">Sale/Disposal</option>
              <option value="Letting">Letting/Tenancy</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phase">Phase</label>
            <select
              id="phase"
              name="phase"
              value={formData.phase}
              onChange={handleChange}
            >
              <option value="Planning">Planning</option>
              <option value="Execution">Execution</option>
              <option value="Review">Review</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="property">Property</label>
            <select
              id="property"
              name="property"
              value={formData.property}
              onChange={handleChange}
            >
              <option value="">Select Property</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.address}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="budget">Budget (£)</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter project budget"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Add project details and notes..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create Project
          </button>
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Projects List View Component
function ProjectsListView({ projects, setProjects, people, properties }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || project.type === filterType;
    return matchesSearch && matchesType;
  });

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  return (
    <div className="view">
      <div className="card">
        <div className="search-filters">
          <div className="search-group">
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Types</option>
              <option value="Purchase">Purchase</option>
              <option value="Renovation">Renovation</option>
              <option value="Sale">Sale</option>
              <option value="Letting">Letting</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="people-grid">
        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚡</div>
            <h3>No projects found</h3>
            <p>Start by creating your first project.</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div key={project.id} className="crm-person-card">
              <div className="card-header">
                <div className="person-avatar">
                  <div className="avatar-circle">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="person-info">
                  <div className="person-name">{project.name}</div>
                  <div className="person-company">{project.type}</div>
                  <div className="person-role">{project.phase}</div>
                </div>
                <div className={`priority-badge priority-${project.status === 'Active' ? 'High' : project.status === 'Completed' ? 'Low' : 'Medium'}`}>
                  {project.status}
                </div>
              </div>
              
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">
                    <Building size={12} />
                  </span>
                  <span className="contact-value">
                    {project.property ? 
                      properties.find(p => p.id === project.property)?.address || 'Unknown Property' :
                      'No Property'
                    }
                  </span>
                </div>
                {project.budget && (
                  <div className="contact-item">
                    <span className="contact-icon">💰</span>
                    <span className="contact-value">£{parseInt(project.budget).toLocaleString()}</span>
                  </div>
                )}
                {project.startDate && (
                  <div className="contact-item">
                    <span className="contact-icon">📅</span>
                    <span className="contact-value">{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="crm-actions">
                <button className="action-btn primary">📋 View</button>
                <button className="action-btn secondary">✏️ Edit</button>
                <button className="action-btn secondary">📄 Tasks</button>
                <button className="action-btn danger" onClick={() => deleteProject(project.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Other view components (simplified for now)
function DocumentsView() { return <div className="view"><h1>Documents</h1></div>; }
function ReportsView() { return <div className="view"><h1>Reports</h1></div>; }

// Export/Import functions

export default App;
