"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  dashboardApi,
  type AdminPost,
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

function getAuthorName(author: AdminPost["author"]) {
  return typeof author === "object" ? author.username : author;
}

export default function PostsPage() {
  const { t } = useSettings();
  const [data, setData] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewPost, setViewPost] = useState<AdminPost | null>(null);

  // Delete state
  const [deletePost, setDeletePost] = useState<AdminPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const posts = await dashboardApi.getAll<AdminPost>("posts");
      setData(posts);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deletePost) return;
    setDeleting(true);
    try {
      await dashboardApi.deleteOne("posts", deletePost._id);
      setData((prev) => prev.filter((p) => p._id !== deletePost._id));
      setDeletePost(null);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminPost>[] = [
    {
      key: "author",
      header: t("dashboard.posts.author"),
      sortable: true,
      render: (_val, row) => getAuthorName(row.author),
    },
    {
      key: "content",
      header: t("dashboard.posts.content"),
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
      header: t("dashboard.posts.upvotes"),
      sortable: true,
      render: (_val, row) => row.upvotes?.length ?? 0,
    },
    {
      key: "createdAt",
      header: t("dashboard.posts.createdAt"),
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
              setViewPost(row);
            }}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeletePost(row);
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
        {t("dashboard.posts.title")}
      </h1>

      <DataTable<AdminPost>
        data={data}
        columns={columns}
        loading={loading}
        exportFilename="posts"
      />

      {/* View Post Dialog */}
      <Dialog
        open={!!viewPost}
        onOpenChange={(open) => !open && setViewPost(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("dashboard.common.view")}</DialogTitle>
          </DialogHeader>
          {viewPost && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.posts.author")}
                </p>
                <p>{getAuthorName(viewPost.author)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.posts.content")}
                </p>
                <p className="whitespace-pre-wrap">{viewPost.content}</p>
              </div>
              {viewPost.media && (
                <div>
                  <img
                    src={viewPost.media}
                    alt="Post media"
                    className="max-h-64 rounded-lg object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.posts.upvotes")}
                </p>
                <p>{viewPost.upvotes?.length ?? 0}</p>
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
        open={!!deletePost}
        onOpenChange={(open) => !open && setDeletePost(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
