"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/dashboard-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  exportFilename?: string;
  onRowClick?: (row: T) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getNestedValue(obj: object, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
}

// ─── Component ──────────────────────────────────────────────────────────────

export function DataTable<T extends object>({
  data,
  columns,
  loading = false,
  searchable = true,
  exportFilename,
  onRowClick,
}: DataTableProps<T>) {
  const { t, language } = useSettings();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ── Search ──────────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = getNestedValue(row, col.key);
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(q);
      })
    );
  }, [data, searchQuery, columns]);

  // ── Sort ────────────────────────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey);
      const bVal = getNestedValue(b, sortKey);
      const aStr = aVal != null ? String(aVal) : "";
      const bStr = bVal != null ? String(bVal) : "";
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  // ── Pagination ──────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, clampedPage, pageSize]);

  const startEntry = sortedData.length === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
  const endEntry = Math.min(clampedPage * pageSize, sortedData.length);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setPage(1);
    },
    [sortKey]
  );

  const handleExport = useCallback(() => {
    if (!exportFilename) return;
    const exportCols = columns.map((c) => ({ key: c.key, label: c.header }));
    exportToCSV(filteredData as Record<string, unknown>[], exportCols, exportFilename);
  }, [columns, filteredData, exportFilename]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((val: string | null) => {
    if (val) {
      setPageSize(Number(val));
      setPage(1);
    }
  }, []);

  // ── Loading Skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        {searchable && <Skeleton className="h-8 w-64" />}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-4 w-full max-w-[160px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("dashboard.table.search")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="ps-8"
            />
          </div>
        )}
        {exportFilename && (
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="size-3.5" />
            {t("dashboard.table.exportCsv")}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="size-3.5" />
                        ) : (
                          <ArrowDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-muted-foreground/50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Inbox className="size-10 mb-2 opacity-40" />
                    <span className="text-sm">{t("dashboard.table.noResults")}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={(row as Record<string, unknown>)._id as string ?? rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {columns.map((col) => {
                    const val = getNestedValue(row, col.key);
                    return (
                      <TableCell key={col.key}>
                        {col.render ? col.render(val, row) : (val != null ? String(val) : "—")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("dashboard.table.showing")}</span>
            <span className="font-medium text-foreground">{startEntry}–{endEntry}</span>
            <span>{t("dashboard.table.of")}</span>
            <span className="font-medium text-foreground">{sortedData.length}</span>
            <span>{t("dashboard.table.entries")}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page size selector */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">{t("dashboard.table.rowsPerPage")}</span>
              <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="h-7 w-[60px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={clampedPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                title={t("dashboard.table.prev")}
              >
                <ChevronLeft className={cn("size-4", language === "ar" && "rotate-180")} />
              </Button>
              <span className="px-2 text-sm font-medium text-foreground">
                {clampedPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={clampedPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                title={t("dashboard.table.next")}
              >
                <ChevronRight className={cn("size-4", language === "ar" && "rotate-180")} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
