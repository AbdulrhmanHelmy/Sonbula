"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  title,
  message,
}: DeleteDialogProps) {
  const { t } = useSettings();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {title || t("dashboard.delete.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {message || t("dashboard.delete.message")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t("dashboard.delete.cancel")}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="gap-1.5"
          >
            {loading && <Loader2 className="size-3.5 animate-spin" />}
            {t("dashboard.delete.confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
