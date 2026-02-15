import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mail, 
  Users, 
  BarChart3, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Settings,
  ListChecks
} from 'lucide-react';
import { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggleCollapse }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { path: '/campaigns', icon: Mail, label: 'Campaigns', badge: null },
    { path: '/contacts', icon: Users, label: 'Contacts', badge: null },
    { path: '/email-lists', icon: ListChecks, label: 'Email Lists', badge: null },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', badge: null },
    { path: '/settings', icon: Settings, label: 'Settings', badge: null },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <button 
        className="mobile-menu-btn" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleMobileMenu}
        />
      )}

      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon-wrapper">
              <Zap size={22} />
            </div>
            {!collapsed && (
              <div className="logo-text">
                <h2>Globopersona</h2>
                <span>AI Email Platform</span>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">{!collapsed && 'MENU'}</div>
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'nav-item-active' : ''} animate-fadeInUp stagger-${index + 1}`
              }
              onClick={() => setIsMobileMenuOpen(false)}
              title={collapsed ? item.label : ''}
            >
              <div className="nav-icon-wrapper">
                <item.icon size={20} />
              </div>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <button 
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <span>U</span>
            </div>
            {!collapsed && (
              <div className="user-details">
                <p className="user-name">User Account</p>
                <p className="user-email">user@company.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
