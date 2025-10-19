import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SessionCardProps {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
  contentClassName?: string;
}

export function SessionCard({
  title,
  children,
  icon: Icon,
  className,
  contentClassName,
}: SessionCardProps) {
  return (
    <Card className={cn("overflow-hidden rounded-2xl border shadow-sm bg-card", className)}>
      <div className="flex items-center gap-2 bg-[#0B2D5C] px-5 py-3 text-white rounded-t-2xl">
        {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
        <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
      </div>
      <div className={cn("px-5 py-4 space-y-4", contentClassName)}>
        {children}
      </div>
    </Card>
  );
}
