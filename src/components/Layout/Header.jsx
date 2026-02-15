import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Bell, LogOut, Settings, Moon, Sun, Check, Trash2, Mail, TrendingUp, Users, X } from 'lucide-react';
import './Header.css';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'campaign',
    title: 'Campaign Completed',
    message: 'Customer Feedback Survey has finished sending all 500 emails.',
    time: '2 hours ago',
    read: false,
    icon: Mail,
  },
  {
    id: 2,
    type: 'performance',
    title: 'High Open Rate!',
    message: 'Q1 Product Launch Campaign achieved 70.8% open rate — well above average.',
    time: '5 hours ago',
    read: false,
    icon: TrendingUp,
  },
  {
    id: 3,
    type: 'contacts',
    title: 'New Contacts Added',
    message: '75 contacts were uploaded for Partnership Outreach campaign.',
    time: '1 day ago',
    read: false,
    icon: Users,
  },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('globopersona_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const panelRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('globopersona_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('campaigns/create')) return 'Create Campaign';
    if (path.includes('campaigns')) return 'Campaigns';
    if (path.includes('contacts')) return 'Contacts';
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('settings')) return 'Settings';
    return 'Globopersona';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNotifIconColor = (type) => {
    switch (type) {
      case 'campaign': return '#6366f1';
      case 'performance': return '#10b981';
      case 'contacts': return '#8b5cf6';
      default: return '#6366f1';
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="header-right">
        <button 
          className="icon-btn theme-toggle-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="notification-wrapper" ref={panelRef}>
          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-panel">
              <div className="notif-panel-header">
                <h3>Notifications</h3>
                <div className="notif-panel-actions">
                  {unreadCount > 0 && (
                    <button className="notif-action-btn" onClick={markAllRead} title="Mark all read">
                      <Check size={14} /> Mark all
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button className="notif-action-btn notif-action-danger" onClick={clearAll} title="Clear all">
                      <Trash2 size={14} /> Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="notif-panel-body">
                {notifications.length === 0 ? (
                  <div className="notif-empty">
                    <Bell size={32} />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`notif-item ${notif.read ? 'notif-read' : 'notif-unread'}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div
                        className="notif-item-icon"
                        style={{ background: `${getNotifIconColor(notif.type)}20`, color: getNotifIconColor(notif.type) }}
                      >
                        <notif.icon size={16} />
                      </div>
                      <div className="notif-item-content">
                        <span className="notif-item-title">{notif.title}</span>
                        <span className="notif-item-message">{notif.message}</span>
                        <span className="notif-item-time">{notif.time}</span>
                      </div>
                      <button
                        className="notif-item-delete"
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                        title="Delete"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          className="icon-btn" 
          title="Settings"
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} />
        </button>

        <button 
          className="icon-btn logout-btn" 
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
