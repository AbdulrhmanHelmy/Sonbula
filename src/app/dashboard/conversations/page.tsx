"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  dashboardApi,
  type AdminConversation,
} from "@/lib/dashboard-api";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

function getUserName(user: AdminConversation["user"]) {
  return typeof user === "object" ? user.username : user;
}

export default function ConversationsPage() {
  const { t } = useSettings();
  const [data, setData] = useState<AdminConversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<AdminConversation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const conversations = await dashboardApi.getAll<AdminConversation>(
        "conversations"
      );
      setData(conversations);
    } catch {
      toast.error("Failed to load conversations");
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
      await dashboardApi.deleteOne("conversations", deleteItem._id);
      setData((prev) => prev.filter((c) => c._id !== deleteItem._id));
      setDeleteItem(null);
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminConversation>[] = [
    {
      key: "user",
      header: t("dashboard.conversations.user"),
      sortable: true,
      render: (_val, row) => getUserName(row.user),
    },
    {
      key: "title",
      header: t("dashboard.conversations.titleField"),
      sortable: true,
    },
    {
      key: "createdAt",
      header: t("dashboard.conversations.createdAt"),
      sortable: true,
      render: (_val, row) => formatDate(row.createdAt),
    },
    {
      key: "updatedAt",
      header: t("dashboard.conversations.updatedAt"),
      sortable: true,
      render: (_val, row) => formatDate(row.updatedAt),
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
        {t("dashboard.conversations.title")}
      </h1>

      <DataTable<AdminConversation>
        data={data}
        columns={columns}
        loading={loading}
        exportFilename="conversations"
      />

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
