import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import SideNavBar from "./components/SideNavBar";
import TopAppBar from "./components/TopAppBar";
import { useAuth } from "./hooks/useAuth";
import AccessControl from "./pages/AccessControl";
import CaseDetail from "./pages/CaseDetail";
import CaseManagement from "./pages/CaseManagement";
import DashboardOverview from "./pages/DashboardOverview";
import EvidenceViewer from "./pages/EvidenceViewer";
import LoginPage from "./pages/LoginPage";
import VerificationPanel from "./pages/VerificationPanel";

function ProtectedLayout() {
  const { isAuthorityAuthenticated } = useAuth();

  if (!isAuthorityAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-grid-overlay bg-[size:44px_44px] bg-white">
      <div className="flex min-h-screen">
        <SideNavBar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopAppBar />
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto w-full max-w-[1440px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="/cases" element={<CaseManagement />} />
        <Route path="/cases/:caseId" element={<CaseDetail />} />
        <Route path="/verification" element={<VerificationPanel />} />
        <Route path="/evidence" element={<EvidenceViewer />} />
        <Route path="/access-control" element={<AccessControl />} />
      </Route>
    </Routes>
  );
}
