"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  dashboardApi,
  type AdminComplaint,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

function statusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "reviewed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "";
  }
}

function getUserName(user: AdminComplaint["user"]) {
  return typeof user === "object" ? user.username : user;
}

export default function ComplaintsPage() {
  const { t } = useSettings();
  const [data, setData] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewItem, setViewItem] = useState<AdminComplaint | null>(null);

  // Status edit state
  const [editItem, setEditItem] = useState<AdminComplaint | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editAnswer, setEditAnswer] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<AdminComplaint | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const complaints = await dashboardApi.getAll<AdminComplaint>(
        "complaints"
      );
      setData(complaints);
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      await dashboardApi.update("complaints", editItem._id, {
        status: editStatus,
        answer: editAnswer,
      });
      setData((prev) =>
        prev.map((c) =>
          c._id === editItem._id
            ? { ...c, status: editStatus as AdminComplaint["status"], answer: editAnswer, answeredAt: new Date().toISOString() }
            : c
        )
      );
      setEditItem(null);
      toast.success(t("dashboard.common.success"));
    } catch {
      toast.error(t("dashboard.common.error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await dashboardApi.deleteOne("complaints", deleteItem._id);
      setData((prev) => prev.filter((c) => c._id !== deleteItem._id));
      setDeleteItem(null);
      toast.success("Complaint deleted");
    } catch {
      toast.error("Failed to delete complaint");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminComplaint>[] = [
    {
      key: "user",
      header: t("dashboard.complaints.user"),
      sortable: true,
      render: (_val, row) => getUserName(row.user),
    },
    {
      key: "subject",
      header: t("dashboard.complaints.subject"),
      sortable: true,
    },
    {
      key: "description",
      header: t("dashboard.complaints.description"),
      render: (_val, row) => (
        <span className="block max-w-xs truncate">
          {row.description.slice(0, 50)}
          {row.description.length > 50 ? "…" : ""}
        </span>
      ),
    },
    {
      key: "status",
      header: t("dashboard.complaints.status"),
      sortable: true,
      render: (_val, row) => (
        <Badge variant="outline" className={statusColor(row.status)}>
          {t(`dashboard.status.${row.status}`)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: t("dashboard.complaints.createdAt"),
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
              setEditItem(row);
              setEditStatus(row.status);
              setEditAnswer(row.answer || "");
            }}
          >
            <Pencil className="size-4" />
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
        {t("dashboard.complaints.title")}
      </h1>

      <DataTable<AdminComplaint>
        data={data}
        columns={columns}
        loading={loading}
        exportFilename="complaints"
      />

      {/* View Dialog */}
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
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.complaints.user")}
                </p>
                <p>{getUserName(viewItem.user)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.complaints.subject")}
                </p>
                <p>{viewItem.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.complaints.description")}
                </p>
                <p className="whitespace-pre-wrap">{viewItem.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.complaints.status")}
                </p>
                <Badge
                  variant="outline"
                  className={statusColor(viewItem.status)}
                >
                  {t(`dashboard.status.${viewItem.status}`)}
                </Badge>
              </div>
              
              {viewItem.answer && (
                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-1">Answer</h4>
                  <p className="text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded-lg whitespace-pre-wrap">{viewItem.answer}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("dashboard.common.close")}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => {
          if (!open) setEditItem(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("dashboard.complaints.updateStatus")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={editStatus} onValueChange={(v) => v && setEditStatus(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  {t("dashboard.status.pending")}
                </SelectItem>
                <SelectItem value="reviewed">
                  {t("dashboard.status.reviewed")}
                </SelectItem>
                <SelectItem value="resolved">
                  {t("dashboard.status.resolved")}
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4">
              <label className="text-sm font-semibold mb-2 block">Answer (Optional)</label>
              <textarea 
                className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                placeholder="Write a response to the user..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("dashboard.common.cancel")}
            </DialogClose>
            <Button onClick={handleUpdateStatus} disabled={saving}>
              {saving
                ? t("dashboard.common.loading")
                : t("dashboard.common.save")}
            </Button>
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
