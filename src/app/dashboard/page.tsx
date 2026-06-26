"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  dashboardApi,
  type AdminUser,
  type AdminPost,
  type AdminComplaint,
  type AdminDiseaseScan,
  type DiseaseDistribution,
  type GovernorateDistribution,
} from "@/lib/dashboard-api";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Users,
  FileText,
  Microscope,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// ─── Chart colors ────────────────────────────────────────────────────────────

const PIE_COLORS = [
  "#059669", // emerald-600
  "#0d9488", // teal-600
  "#10b981", // emerald-500
  "#14b8a6", // teal-500
  "#34d399", // emerald-400
  "#2dd4bf", // teal-400
  "#6ee7b7", // emerald-300
  "#5eead4", // teal-300
  "#a7f3d0", // emerald-200
  "#99f6e4", // teal-200
];

const BAR_COLOR = "#059669";

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Page Component ─────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const { t } = useSettings();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [scans, setScans] = useState<AdminDiseaseScan[]>([]);
  const [diseaseData, setDiseaseData] = useState<DiseaseDistribution[]>([]);
  const [govData, setGovData] = useState<GovernorateDistribution[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [u, p, c, s, dd, gd] = await Promise.all([
          dashboardApi.getAll<AdminUser>("users"),
          dashboardApi.getAll<AdminPost>("posts"),
          dashboardApi.getAll<AdminComplaint>("complaints"),
          dashboardApi.getAll<AdminDiseaseScan>("disease-scans"),
          dashboardApi.getDiseaseDistribution(),
          dashboardApi.getGovernorateDistribution(),
        ]);
        setUsers(u);
        setPosts(p);
        setComplaints(c);
        setScans(s);
        setDiseaseData(dd);
        setGovData(gd);
      } catch {
        // silently fail, data stays empty
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pendingComplaints = complaints.filter(
    (c) => c.status === "pending"
  ).length;

  // Prepare chart data
  const pieData = diseaseData.map((d) => ({
    name: d._id,
    value: d.totalCasesOfDisease,
  }));
  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);
  const barData = govData.map((g) => ({
    name: g._id,
    count: g.totalScansInGovernorate,
  }));

  // Recent items
  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
  const recentPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight">
        {t("dashboard.overview.title")}
      </h1>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label={t("dashboard.overview.totalUsers")}
          value={users.length}
          loading={loading}
        />
        <StatCard
          icon={FileText}
          label={t("dashboard.overview.totalPosts")}
          value={posts.length}
          loading={loading}
        />
        <StatCard
          icon={Microscope}
          label={t("dashboard.overview.totalScans")}
          value={scans.length}
          loading={loading}
        />
        <StatCard
          icon={AlertCircle}
          label={t("dashboard.overview.pendingComplaints")}
          value={pendingComplaints}
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Disease Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("dashboard.overview.diseaseDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : pieData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No data
              </div>
            ) : (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                      dataKey="value"
                      paddingAngle={2}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${value} (${
                          pieTotal ? ((value / pieTotal) * 100).toFixed(1) : 0
                        }%)`,
                        "Scans",
                      ]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom legend with exact counts */}
                <ul className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                  {pieData.map((d, i) => (
                    <li
                      key={d.name}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-sm"
                          style={{
                            backgroundColor:
                              PIE_COLORS[i % PIE_COLORS.length],
                          }}
                        />
                        <span className="truncate text-muted-foreground">
                          {d.name}
                        </span>
                      </span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {d.value}
                        <span className="ml-1 text-muted-foreground">
                          (
                          {pieTotal
                            ? ((d.value / pieTotal) * 100).toFixed(1)
                            : 0}
                          %)
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Governorate Distribution Bar */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("dashboard.overview.governorateDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : barData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 24, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#374151" }}
                    angle={-35}
                    textAnchor="end"
                    height={70}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#374151" }}
                    domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={BAR_COLOR}
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="count"
                      position="top"
                      style={{ fontSize: 11, fill: "#374151" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("dashboard.overview.recentComplaints")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t("dashboard.complaints.subject")}
                    </TableHead>
                    <TableHead>
                      {t("dashboard.complaints.status")}
                    </TableHead>
                    <TableHead>
                      {t("dashboard.complaints.createdAt")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentComplaints.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="max-w-[200px] truncate">
                        {c.subject}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColor(c.status)}
                        >
                          {t(`dashboard.status.${c.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(c.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {recentComplaints.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        No data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.overview.recentPosts")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("dashboard.posts.author")}</TableHead>
                    <TableHead>{t("dashboard.posts.content")}</TableHead>
                    <TableHead>{t("dashboard.posts.createdAt")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPosts.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>
                        {typeof p.author === "object"
                          ? p.author.username
                          : p.author}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {p.content.slice(0, 50)}
                        {p.content.length > 50 ? "…" : ""}
                      </TableCell>
                      <TableCell>{formatDate(p.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {recentPosts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        No data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
