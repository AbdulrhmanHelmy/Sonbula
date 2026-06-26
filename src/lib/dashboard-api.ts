// Dashboard Admin API Client
// Wraps the /api/admin/:entity CRUD endpoints + analytics

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://planet-ai-backend-gules.vercel.app/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export type EntityType =
  | "users"
  | "posts"
  | "comments"
  | "complaints"
  | "conversations"
  | "messages"
  | "disease-scans";

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  governorate: string;
  role: "USER" | "DOCTOR" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface AdminPost {
  _id: string;
  author: AdminUser | string;
  content: string;
  media?: string;
  upvotes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminComment {
  _id: string;
  post: string;
  author: AdminUser | string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminComplaint {
  _id: string;
  user: AdminUser | string;
  subject: string;
  description: string;
  status: "pending" | "reviewed" | "resolved";
  answer?: string;
  answeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminConversation {
  _id: string;
  user: AdminUser | string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMessage {
  _id: string;
  conversation: string;
  role: "user" | "assistant";
  type: "text" | "image";
  content: string;
  imageUrl?: string;
  source?: "cnn" | "llm";
  createdAt: string;
  updatedAt: string;
}

export interface AdminDiseaseScan {
  _id: string;
  user: AdminUser | string;
  governorate: string;
  imageUrl?: string;
  diseaseName: string;
  confidence: number;
  severity: string;
  isHealthy: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GovernorateDistribution {
  _id: string;
  totalScansInGovernorate: number;
  diseases: { diseaseName: string; casesCount: number }[];
}

export interface DiseaseDistribution {
  _id: string;
  totalCasesOfDisease: number;
  governorates: { governorateName: string; casesCount: number }[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || `Error: ${response.status}`);
  }
  return data;
}

// ─── Admin CRUD API ─────────────────────────────────────────────────────────

export const dashboardApi = {
  // ── Generic CRUD ─────────────────────────────────────────────────────────

  getAll: async <T = unknown>(entity: EntityType): Promise<T[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/${entity}`, {
      headers: authHeaders(),
    });
    const data = await handleResponse<{ success: boolean; data: T[] }>(
      response
    );
    return data.data;
  },

  create: async <T = unknown>(
    entity: EntityType,
    body: Record<string, unknown>
  ): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}/admin/${entity}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const data = await handleResponse<{ success: boolean; data: T }>(response);
    return data.data;
  },

  update: async <T = unknown>(
    entity: EntityType,
    id: string,
    body: Record<string, unknown>
  ): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}/admin/${entity}/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const data = await handleResponse<{ success: boolean; data: T }>(response);
    return data.data;
  },

  deleteOne: async (entity: EntityType, id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/${entity}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handleResponse(response);
  },

  // ── Analytics ────────────────────────────────────────────────────────────

  getGovernorateDistribution: async (): Promise<GovernorateDistribution[]> => {
    const response = await fetch(
      `${API_BASE_URL}/analytics/distribution/governorate`
    );
    const data = await handleResponse<{
      success: boolean;
      data: GovernorateDistribution[];
    }>(response);
    return data.data;
  },

  getDiseaseDistribution: async (): Promise<DiseaseDistribution[]> => {
    const response = await fetch(
      `${API_BASE_URL}/analytics/distribution/disease`
    );
    const data = await handleResponse<{
      success: boolean;
      data: DiseaseDistribution[];
    }>(response);
    return data.data;
  },

  getScans: async (
    page = 1,
    limit = 10,
    governorate?: string,
    diseaseName?: string,
    sortBy = "date"
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    });
    if (governorate) params.append("governorate", governorate);
    if (diseaseName) params.append("diseaseName", diseaseName);

    const response = await fetch(
      `${API_BASE_URL}/analytics/scans?${params.toString()}`
    );
    return handleResponse<{
      success: boolean;
      data: AdminDiseaseScan[];
      total: number;
    }>(response);
  },

  // ── Auth ──────────────────────────────────────────────────────────────────

  signin: async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      _id: string;
      username: string;
      email: string;
      token: string;
      role: string;
      governorate?: string;
    };
  }> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getMe: async (): Promise<{
    success: boolean;
    data?: AdminUser;
  }> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeaders(),
    });
    return response.json();
  },
};

// ─── CSV Export Utility ─────────────────────────────────────────────────────

export function exportToCSV(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[],
  filename: string
) {
  // BOM for Excel Arabic support
  const BOM = "\uFEFF";

  const header = columns.map((c) => `"${c.label}"`).join(",");
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        if (val === null || val === undefined) return '""';
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csv = BOM + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
