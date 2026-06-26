"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  dashboardApi,
  type AdminDiseaseScan,
} from "@/lib/dashboard-api";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

function getUserName(user: AdminDiseaseScan["user"]) {
  return typeof user === "object" ? user.username : user;
}

export default function DiseaseScansPage() {
  const { t } = useSettings();
  const [data, setData] = useState<AdminDiseaseScan[]>([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewItem, setViewItem] = useState<AdminDiseaseScan | null>(null);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<AdminDiseaseScan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const scans = await dashboardApi.getAll<AdminDiseaseScan>(
        "disease-scans"
      );
      setData(scans);
    } catch {
      toast.error("Failed to load disease scans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await dashboardApi.deleteOne("disease-scans", deleteItem._id);
      setData((prev) => prev.filter((s) => s._id !== deleteItem._id));
      setDeleteItem(null);
      toast.success("Scan deleted");
    } catch {
      toast.error("Failed to delete scan");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminDiseaseScan>[] = [
    {
      key: "user",
      header: t("dashboard.scans.user"),
      sortable: true,
      render: (_val, row) => getUserName(row.user),
    },
    {
      key: "governorate",
      header: t("dashboard.scans.governorate"),
      sortable: true,
    },
    {
      key: "diseaseName",
      header: t("dashboard.scans.disease"),
      sortable: true,
    },
    {
      key: "confidence",
      header: t("dashboard.scans.confidence"),
      sortable: true,
      render: (_val, row) => `${(row.confidence * 100).toFixed(1)}%`,
    },
    {
      key: "severity",
      header: t("dashboard.scans.severity"),
      sortable: true,
    },
    {
      key: "isHealthy",
      header: t("dashboard.scans.healthy"),
      sortable: true,
      render: (_val, row) =>
        row.isHealthy ? (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            ✓
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            ✗
          </Badge>
        ),
    },
    {
      key: "createdAt",
      header: t("dashboard.scans.createdAt"),
      sortable: true,
      render: (_val, row) => formatDate(row.createdAt),
    },
    {
      key: "_actions",
      header: t("dashboard.common.actions"),
      render: (_val, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              setViewItem(row);
            }}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteItem(row);
            }}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        {t("dashboard.scans.title")}
      </h1>

      <DataTable<AdminDiseaseScan>
        data={data}
        columns={columns}
        loading={loading}
        exportFilename="disease-scans"
      />

      {/* View Scan Dialog */}
      <Dialog
        open={!!viewItem}
        onOpenChange={(open) => !open && setViewItem(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("dashboard.common.view")}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              {viewItem.imageUrl && (
                <div>
                  <img
                    src={viewItem.imageUrl}
                    alt="Scan image"
                    className="w-full max-h-64 rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.scans.user")}
                  </p>
                  <p>{getUserName(viewItem.user)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.scans.governorate")}
                  </p>
                  <p>{viewItem.governorate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.scans.disease")}
                  </p>
                  <p>{viewItem.diseaseName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.scans.confidence")}
                  </p>
                  <p>{(viewItem.confidence * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.scans.severity")}
                  </p>
                  <p>{viewItem.severity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.scans.healthy")}
                  </p>
                  {viewItem.isHealthy ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      ✓ {t("dashboard.scans.healthy")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 border-red-200"
                    >
                      ✗
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.scans.createdAt")}
                </p>
                <p>{formatDate(viewItem.createdAt)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("dashboard.common.close")}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
