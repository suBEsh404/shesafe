import {
  ShieldCheck,
  LayoutDashboard,
  BriefcaseBusiness,
  Binary,
  FileSearch,
  LockKeyhole,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Cases", to: "/cases", icon: BriefcaseBusiness },
  { label: "Verification", to: "/verification", icon: Binary },
  { label: "Evidence Viewer", to: "/evidence", icon: FileSearch },
  { label: "Access Control", to: "/access-control", icon: LockKeyhole },
];

export default function SideNavBar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-borderline bg-white px-4 py-6 lg:block">
      <div className="mb-8 rounded-md border border-borderline bg-white p-4">
        <div className="mb-4 h-1 w-20 rounded-full bg-state-gold/80" />
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-state-gold/20 bg-state-navy p-3 text-state-gold">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-state-slate">Digital Vault</p>
            <h1 className="text-2xl font-semibold leading-tight text-slate-900">Authority Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Evidence Management Directorate</p>
          </div>
        </div>
      </div>

      <div className="mb-3 px-2 text-[11px] uppercase tracking-[0.24em] text-state-gold">
        Navigation
      </div>
      <nav className="space-y-2">
        {links.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-4 py-3 text-sm transition ${
                isActive
                  ? "border border-state-gold/25 bg-state-navy text-white"
                  : "border border-transparent text-slate-700 hover:border-borderline hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-md border border-borderline bg-slate-50 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-state-gold">System Link</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Connected to authentication, evidence listing, verification, and access log APIs.
        </p>
      </div>
    </aside>
  );
}
