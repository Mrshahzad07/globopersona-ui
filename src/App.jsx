import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import CampaignList from './pages/Campaigns/CampaignList';
import CampaignDetails from './pages/Campaigns/CampaignDetails';
import CreateCampaign from './pages/Campaigns/CreateCampaign/CampaignCreateChoice';
import ContactList from './pages/Contacts/ContactList';
import EmailListDashboard from './pages/EmailLists/EmailListDashboard';
import EmailListDetails from './pages/EmailLists/EmailListDetails';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="campaigns" element={<CampaignList />} />
              <Route path="campaigns/create" element={<CreateCampaign />} />
              <Route path="campaigns/:id" element={<CampaignDetails />} />
              <Route path="contacts" element={<ContactList />} />
              <Route path="email-lists" element={<EmailListDashboard />} />
              <Route path="email-lists/:id" element={<EmailListDetails />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
