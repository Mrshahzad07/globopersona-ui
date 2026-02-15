import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Sun, Moon, Monitor, Palette, Bell, Shield, User, Globe } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes, great for night' },
  ];

  return (
    <div className="settings-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Customize your Globopersona experience</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-section card animate-fadeInUp stagger-1">
          <div className="settings-section-header">
            <div className="settings-section-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #c084fc)' }}>
              <Palette size={22} color="white" />
            </div>
            <div>
              <h3>Appearance</h3>
              <p className="settings-section-desc">Customize the look and feel</p>
            </div>
          </div>

          <div className="settings-section-body">
            <div className="setting-item">
              <span className="setting-label">Theme</span>
              <div className="theme-picker">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`theme-option ${theme === option.value ? 'theme-option-active' : ''}`}
                    onClick={() => setTheme(option.value)}
                  >
                    <div className={`theme-preview theme-preview-${option.value}`}>
                      <option.icon size={24} />
                    </div>
                    <div className="theme-option-info">
                      <span className="theme-option-label">{option.label}</span>
                      <span className="theme-option-desc">{option.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section card animate-fadeInUp stagger-2">
          <div className="settings-section-header">
            <div className="settings-section-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
              <User size={22} color="white" />
            </div>
            <div>
              <h3>Profile</h3>
              <p className="settings-section-desc">Manage your account information</p>
            </div>
          </div>

          <div className="settings-section-body">
            <div className="setting-item">
              <span className="setting-label">Display Name</span>
              <input type="text" className="form-input" defaultValue={user?.name || 'User'} />
            </div>
            <div className="setting-item">
              <span className="setting-label">Email Address</span>
              <input type="email" className="form-input" defaultValue={user?.email || 'user@infosys.com'} />
            </div>
          </div>
        </div>

        <div className="settings-section card animate-fadeInUp stagger-3">
          <div className="settings-section-header">
            <div className="settings-section-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
              <Bell size={22} color="white" />
            </div>
            <div>
              <h3>Notifications</h3>
              <p className="settings-section-desc">Configure notification preferences</p>
            </div>
          </div>

          <div className="settings-section-body">
            <div className="setting-item setting-toggle-row">
              <div>
                <span className="setting-label">Email Notifications</span>
                <span className="setting-hint">Receive updates about campaign performance</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item setting-toggle-row">
              <div>
                <span className="setting-label">Campaign Alerts</span>
                <span className="setting-hint">Get notified when campaigns need attention</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section card animate-fadeInUp stagger-4">
          <div className="settings-section-header">
            <div className="settings-section-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
              <Globe size={22} color="white" />
            </div>
            <div>
              <h3>Email Defaults</h3>
              <p className="settings-section-desc">Default settings for new campaigns</p>
            </div>
          </div>

          <div className="settings-section-body">
            <div className="setting-item">
              <span className="setting-label">Default Sender Email</span>
              <input type="email" className="form-input" defaultValue="you@infosys.com" />
            </div>
            <div className="setting-item">
              <span className="setting-label">Daily Send Limit</span>
              <input type="number" className="form-input" defaultValue="100" min="1" />
            </div>
            <div className="setting-item">
              <span className="setting-label">Email Gap (minutes)</span>
              <input type="number" className="form-input" defaultValue="5" min="1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
