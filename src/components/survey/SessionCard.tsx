import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SessionCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export function SessionCard({ title, icon: Icon, children }: SessionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 bg-[#0B2D5C] px-5 py-3 text-white">
        {Icon ? <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" /> : null}
        <h3 className="text-sm font-semibold tracking-tight sm:text-base">{title}</h3>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3">{children}</div>
      </div>
    </section>
  );
}
