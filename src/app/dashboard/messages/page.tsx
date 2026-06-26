"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  dashboardApi,
  type AdminMessage,
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

function roleBadgeColor(role: string) {
  return role === "user"
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : "bg-green-100 text-green-800 border-green-200";
}

export default function MessagesPage() {
  const { t } = useSettings();
  const [data, setData] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewItem, setViewItem] = useState<AdminMessage | null>(null);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<AdminMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const messages = await dashboardApi.getAll<AdminMessage>("messages");
      setData(messages);
    } catch {
      toast.error("Failed to load messages");
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
      await dashboardApi.deleteOne("messages", deleteItem._id);
      setData((prev) => prev.filter((m) => m._id !== deleteItem._id));
      setDeleteItem(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminMessage>[] = [
    {
      key: "conversation",
      header: t("dashboard.messages.conversation"),
      render: (_val, row) => (
        <span className="font-mono text-xs">
          {row.conversation.slice(-6)}
        </span>
      ),
    },
    {
      key: "role",
      header: t("dashboard.messages.role"),
      sortable: true,
      render: (_val, row) => (
        <Badge variant="outline" className={roleBadgeColor(row.role)}>
          {row.role}
        </Badge>
      ),
    },
    {
      key: "type",
      header: t("dashboard.messages.type"),
      sortable: true,
    },
    {
      key: "content",
      header: t("dashboard.messages.content"),
      render: (_val, row) => {
        const text = row.content ?? "";
        return (
          <span className="block max-w-xs truncate">
            {text.slice(0, 50)}
            {text.length > 50 ? "…" : ""}
          </span>
        );
      },
    },
    {
      key: "source",
      header: t("dashboard.messages.source"),
      sortable: true,
      render: (_val, row) => row.source ?? "—",
    },
    {
      key: "createdAt",
      header: t("dashboard.messages.createdAt"),
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
        {t("dashboard.messages.title")}
      </h1>

      <DataTable<AdminMessage>
        data={data}
        columns={columns}
        loading={loading}
        exportFilename="messages"
      />

      {/* View Message Dialog */}
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
                  {t("dashboard.messages.conversation")}
                </p>
                <p className="font-mono text-sm">{viewItem.conversation}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.messages.role")}
                  </p>
                  <Badge
                    variant="outline"
                    className={roleBadgeColor(viewItem.role)}
                  >
                    {viewItem.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.messages.type")}
                  </p>
                  <p>{viewItem.type}</p>
                </div>
                {viewItem.source && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("dashboard.messages.source")}
                    </p>
                    <p>{viewItem.source}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.messages.content")}
                </p>
                <p className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm">
                  {viewItem.content}
                </p>
              </div>
              {viewItem.imageUrl && (
                <div>
                  <img
                    src={viewItem.imageUrl}
                    alt="Message media"
                    className="max-h-64 rounded-lg object-cover"
                  />
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
