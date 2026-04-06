import { Bell, LogOut, Menu, Search, Shield, UserCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSelectedCase } from "../hooks/useSelectedCase";

export default function TopAppBar() {
  const { session, logout } = useAuth();
  const { selectedCaseId } = useSelectedCase();

  return (
    <header className="border-b border-borderline bg-white px-4 py-3 md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-borderline bg-white p-2 text-slate-600 lg:hidden">
            <Menu size={18} />
          </div>
          <label className="flex w-full items-center gap-2 rounded-md border border-borderline bg-white px-3 py-2 text-sm text-slate-700 lg:min-w-[420px]">
            <Search size={16} className="text-state-slate" />
            <input
              placeholder="Search cases, evidence hashes, investigators"
              className="w-full bg-transparent outline-none placeholder:text-state-slate"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3 rounded-md border border-borderline bg-white px-3 py-2">
            <Shield size={16} className="text-state-gold" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-state-slate">Portal</p>
              <p className="text-sm font-medium text-slate-900">Authority</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-borderline bg-white px-3 py-2">
            <Bell size={16} className="text-state-gold" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-state-slate">Active Case</p>
              <p className="text-sm text-slate-900">{selectedCaseId ?? "No case selected"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-borderline bg-white px-3 py-2">
            <UserCircle2 size={28} className="text-state-slate" />
            <div>
              <p className="text-sm font-medium text-slate-900">{session?.user.name ?? "Analyst"}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-state-slate">
                {session?.user.email ?? "No email"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center gap-2 rounded-md border border-borderline bg-white px-3 py-2 text-sm text-slate-700 hover:border-state-gold/30 hover:text-slate-900"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
