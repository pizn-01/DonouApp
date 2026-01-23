import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import BriefsPage from './pages/briefs/BriefsPage';
import BriefDetailsPage from './pages/briefs/BriefDetailsPage';
import CreateBriefAIPage from './pages/briefs/CreateBriefAIPage';
import CreateBriefPage from './pages/briefs/CreateBriefPage';
import SettingsPage from './pages/settings/SettingsPage';
import MessagesPage from './pages/messages/MessagesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/briefs" element={<BriefsPage />} />
        <Route path="/briefs/create-ai" element={<CreateBriefAIPage />} />
        <Route path="/briefs/create" element={<CreateBriefPage />} />
        <Route path="/briefs/:id" element={<BriefDetailsPage />} />

        {/* Settings & Messages */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
