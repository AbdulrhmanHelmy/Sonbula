"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  dashboardApi,
  type AdminComment,
} from "@/lib/dashboard-api";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
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

function getAuthorName(author: AdminComment["author"]) {
  return typeof author === "object" ? author.username : author;
}

export default function CommentsPage() {
  const { t } = useSettings();
  const [data, setData] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewComment, setViewComment] = useState<AdminComment | null>(null);

  // Delete state
  const [deleteComment, setDeleteComment] = useState<AdminComment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const comments = await dashboardApi.getAll<AdminComment>("comments");
      setData(comments);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteComment) return;
    setDeleting(true);
    try {
      await dashboardApi.deleteOne("comments", deleteComment._id);
      setData((prev) => prev.filter((c) => c._id !== deleteComment._id));
      setDeleteComment(null);
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminComment>[] = [
    {
      key: "post",
      header: t("dashboard.comments.post"),
      render: (_val, row) => (
        <span className="font-mono text-xs">{row.post.slice(-6)}</span>
      ),
    },
    {
      key: "author",
      header: t("dashboard.comments.author"),
      sortable: true,
      render: (_val, row) => getAuthorName(row.author),
    },
    {
      key: "content",
      header: t("dashboard.comments.content"),
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
      key: "upvotes",
      header: `${t("dashboard.comments.votes")} ↑`,
      sortable: true,
      render: (_val, row) => row.upvotes?.length ?? 0,
    },
    {
      key: "downvotes",
      header: `${t("dashboard.comments.votes")} ↓`,
      sortable: true,
      render: (_val, row) => row.downvotes?.length ?? 0,
    },
    {
      key: "createdAt",
      header: t("dashboard.comments.createdAt"),
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
              setViewComment(row);
            }}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteComment(row);
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
        {t("dashboard.comments.title")}
      </h1>

      <DataTable<AdminComment>
        data={data}
        columns={columns}
        loading={loading}
        exportFilename="comments"
      />

      {/* View Comment Dialog */}
      <Dialog
        open={!!viewComment}
        onOpenChange={(open) => !open && setViewComment(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("dashboard.common.view")}</DialogTitle>
          </DialogHeader>
          {viewComment && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.comments.post")}
                </p>
                <p className="font-mono text-sm">{viewComment.post}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.comments.author")}
                </p>
                <p>{getAuthorName(viewComment.author)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.comments.content")}
                </p>
                <p className="whitespace-pre-wrap">{viewComment.content}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.comments.votes")} ↑
                  </p>
                  <p>{viewComment.upvotes?.length ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.comments.votes")} ↓
                  </p>
                  <p>{viewComment.downvotes?.length ?? 0}</p>
                </div>
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
        open={!!deleteComment}
        onOpenChange={(open) => !open && setDeleteComment(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
