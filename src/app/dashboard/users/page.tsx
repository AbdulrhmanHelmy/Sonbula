"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  dashboardApi,
  type AdminUser,
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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

function roleColor(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-800 border-red-200";
    case "DOCTOR":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function UsersPage() {
  const { t } = useSettings();
  const [data, setData] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit role state
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const users = await dashboardApi.getAll<AdminUser>("users");
      setData(users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditRole = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      await dashboardApi.update("users", editUser._id, { role: editRole });
      setData((prev) =>
        prev.map((u) =>
          u._id === editUser._id
            ? { ...u, role: editRole as AdminUser["role"] }
            : u
        )
      );
      setEditUser(null);
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      await dashboardApi.deleteOne("users", deleteUser._id);
      setData((prev) => prev.filter((u) => u._id !== deleteUser._id));
      setDeleteUser(null);
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "username",
      header: t("dashboard.users.username"),
      sortable: true,
    },
    {
      key: "email",
      header: t("dashboard.users.email"),
      sortable: true,
    },
    {
      key: "governorate",
      header: t("dashboard.users.governorate"),
      sortable: true,
    },
    {
      key: "role",
      header: t("dashboard.users.role"),
      sortable: true,
      render: (_val, row) => (
        <Badge variant="outline" className={roleColor(row.role)}>
          {row.role}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: t("dashboard.users.createdAt"),
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
              setEditUser(row);
              setEditRole(row.role);
            }}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteUser(row);
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
        {t("dashboard.users.title")}
      </h1>

      <DataTable<AdminUser>
        data={data}
        columns={columns}
        loading={loading}
        exportFilename="users"
      />

      {/* Edit Role Dialog */}
      <Dialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.users.editRole")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={editRole} onValueChange={(v) => v && setEditRole(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="DOCTOR">DOCTOR</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("dashboard.common.cancel")}
            </DialogClose>
            <Button onClick={handleEditRole} disabled={saving}>
              {saving
                ? t("dashboard.common.loading")
                : t("dashboard.common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
