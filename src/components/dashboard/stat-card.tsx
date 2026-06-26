"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  loading?: boolean;
}

export function StatCard({ icon: Icon, label, value, loading = false }: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group rounded-xl border border-border bg-white p-5 transition-all duration-200",
        "hover:border-emerald-200 hover:shadow-sm hover:shadow-emerald-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground truncate">{label}</p>
          <p className="text-2xl font-semibold text-foreground tracking-tight">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
