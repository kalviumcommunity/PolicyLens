"use client";

import { useAuth, DEMO_PROFILES } from "@/lib/auth-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function UserProfileModal() {
  const { user, isProfileModalOpen, setIsProfileModalOpen, quickDemoLogin, logout } = useAuth();

  if (!isProfileModalOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => setIsProfileModalOpen(false)}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-extrabold text-white shadow-md shadow-emerald-500/20">
              {user.full_name ? user.full_name.charAt(0) : "U"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {user.full_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Role & Org Info */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-900 dark:bg-slate-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Designation</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.roleTitle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Department</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{user.department}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Organization</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{user.organization}</span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center dark:border-slate-900 dark:bg-slate-900/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Policies</p>
            <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{user.policiesManaged}</p>
            <p className="text-[10px] text-slate-500">Managed</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center dark:border-slate-900 dark:bg-slate-900/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audit Health</p>
            <p className="mt-1 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{user.auditScore}</p>
            <p className="text-[10px] text-slate-500">Passing score</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center dark:border-slate-900 dark:bg-slate-900/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Queue Items</p>
            <p className="mt-1 text-xl font-extrabold text-amber-600 dark:text-amber-400">{user.assignedQueueCount}</p>
            <p className="text-[10px] text-slate-500">Assigned</p>
          </div>
        </div>

        {/* Assigned Permissions */}
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Granted Permissions</p>
          <div className="flex flex-wrap gap-1.5">
            {user.permissions.map((perm) => (
              <span
                key={perm}
                className="rounded-full bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300"
              >
                ✓ {perm}
              </span>
            ))}
          </div>
        </div>

        {/* Switch Persona Shortcuts */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-900">
          <p className="text-xs font-bold text-slate-500 mb-2">Switch Demo Persona</p>
          <div className="grid grid-cols-3 gap-2">
            {(["compliance", "support", "legal"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => quickDemoLogin(role)}
                className={`rounded-xl border p-2 text-xs font-semibold capitalize transition-all text-center ${
                  user.email === DEMO_PROFILES[role].email
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {DEMO_PROFILES[role].full_name.split(" ")[0]} ({role})
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900">
          <button
            type="button"
            onClick={() => {
              logout();
              setIsProfileModalOpen(false);
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-500"
          >
            Sign out of account
          </button>
          <Button size="sm" onClick={() => setIsProfileModalOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
