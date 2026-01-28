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
import OnboardingPage from './pages/onboarding/OnboardingPage';
// Manufacturer Pages
import ManufacturerDashboardPage from './pages/manufacturer/DashboardPage';
import BriefsMarketplacePage from './pages/manufacturer/BriefsMarketplacePage';
import BriefDetailPage from './pages/manufacturer/BriefDetailPage';
import SubmitProposalPage from './pages/manufacturer/SubmitProposalPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import BrandDashboardPage from './pages/dashboard/BrandDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes - Brand */}
        <Route
          path="/brand/dashboard"
          element={
            <ProtectedRoute allowedRoles={["brand"]}>
              <BrandDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Generic Dashboard (Redirects based on role) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Manufacturer Routes */}
        <Route
          path="/manufacturer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["manufacturer"]}>
              <ManufacturerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturer/marketplace"
          element={
            <ProtectedRoute allowedRoles={["manufacturer"]}>
              <BriefsMarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturer/briefs/:id"
          element={
            <ProtectedRoute>
              <BriefDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturer/briefs/:id/proposal"
          element={
            <ProtectedRoute>
              <SubmitProposalPage />
            </ProtectedRoute>
          }
        />

        {/* Common Routes */}
        <Route
          path="/briefs"
          element={
            <ProtectedRoute>
              <BriefsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/briefs/create-ai"
          element={
            <ProtectedRoute>
              <CreateBriefAIPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/briefs/create"
          element={
            <ProtectedRoute>
              <CreateBriefPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/briefs/:id"
          element={
            <ProtectedRoute>
              <BriefDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Settings & Messages */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
