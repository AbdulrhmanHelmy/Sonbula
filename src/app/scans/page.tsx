"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MapPin, Activity, Calendar } from "lucide-react";

// Types definition for the analytics data
interface GovernorateData {
  governorate: string;
  cases: number;
  topDisease: string;
}

interface DiseaseData {
  name: string;
  count: number;
}

interface ScanData {
  id: string;
  date: string;
  governorate: string;
  diseaseName: string;
  confidence: number;
  farmerName?: string;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function DiseasesDashboard() {
  const [govData, setGovData] = useState<GovernorateData[]>([]);
  const [diseaseData, setDiseaseData] = useState<DiseaseData[]>([]);
  const [scans, setScans] = useState<ScanData[]>([]);
  
  const [selectedGov, setSelectedGov] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial dashboard data (Charts & Heatmap)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [govRes, disRes] = await Promise.all([
          api.getGovernorateDistribution(),
          api.getDiseaseDistribution()
        ]);
        
        // التأكد من استخراج المصفوفة (Array) سواء راجعة مباشرة أو داخل خاصية data
        setGovData(Array.isArray(govRes) ? govRes : (govRes?.data || []));
        setDiseaseData(Array.isArray(disRes) ? disRes : (disRes?.data || []));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setGovData([]);
        setDiseaseData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Fetch scans history whenever the selected governorate changes
  useEffect(() => {
    const fetchScans = async () => {
      try {
        const scansRes = await api.getScansHistory(1, 10, selectedGov || undefined, "date");
        // حماية إضافية لسجل الفحوصات
        setScans(Array.isArray(scansRes) ? scansRes : (scansRes?.data || [])); 
      } catch (error) {
        console.error("Error fetching scans:", error);
        setScans([]);
      }
    };
    fetchScans();
  }, [selectedGov]);

  // Helper to determine color based on cases (Heatmap logic)
  const getIntensityColor = (cases: number) => {
    if (cases > 50) return "bg-red-500 text-white"; // High intensity
    if (cases > 20) return "bg-orange-400 text-white"; // Medium
    return "bg-green-500 text-white"; // Safe/Low
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة المراقبة الوبائية</h1>
            <p className="text-gray-600">تحليل فوري لانتشار أمراض النباتات على مستوى الجمهورية</p>
          </div>
          {selectedGov && (
            <button 
              onClick={() => setSelectedGov(null)}
              className="text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              إلغاء فلتر ({selectedGov})
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin text-4xl">🌱</div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. Interactive Heatmap Section (List representation for layout) */}
              <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="text-green-600" />
                  <h2 className="text-xl font-bold">التوزيع الجغرافي (Heatmap)</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Array.isArray(govData) && govData.length > 0 ? (
                    govData.map((gov) => (
                      <div 
                        key={gov.governorate}
                        onClick={() => setSelectedGov(gov.governorate)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all hover:scale-105 ${
                          selectedGov === gov.governorate ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow-sm"
                        } ${getIntensityColor(gov.cases)}`}
                      >
                        <h3 className="font-bold text-lg">{gov.governorate}</h3>
                        <p className="text-sm opacity-90">{gov.cases} حالة فحص</p>
                        <p className="text-xs mt-2 opacity-80 font-medium">المرض الشائع: {gov.topDisease}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 py-4">
                      لا توجد بيانات للمحافظات حالياً.
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Charts Section */}
              <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="text-green-600" />
                  <h2 className="text-xl font-bold">الأمراض الأكثر انتشاراً</h2>
                </div>
                
                {Array.isArray(diseaseData) && diseaseData.length > 0 ? (
                  <>
                    <div className="flex-1 min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={diseaseData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="name"
                          >
                            {diseaseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Custom Legend */}
                    <div className="mt-4 flex flex-wrap gap-3 justify-center">
                      {diseaseData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 text-sm">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          {entry.name}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    لا توجد إحصائيات للأمراض حالياً.
                  </div>
                )}
              </div>

            </div>

            {/* 3. Scans History Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-green-600" />
                <h2 className="text-xl font-bold">سجل الفحوصات الأحدث {selectedGov && `في ${selectedGov}`}</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 border-b">
                      <th className="p-4 font-semibold">التاريخ</th>
                      <th className="p-4 font-semibold">المحافظة</th>
                      <th className="p-4 font-semibold">المرض المكتشف</th>
                      <th className="p-4 font-semibold">نسبة الدقة (AI)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(scans) && scans.length > 0 ? (
                      scans.map((scan, idx) => (
                        <tr key={scan.id || idx} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-gray-700">
                            {scan.date ? new Date(scan.date).toLocaleDateString('ar-EG') : 'غير متوفر'}
                          </td>
                          <td className="p-4"><span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{scan.governorate}</span></td>
                          <td className="p-4 font-medium text-red-600">{scan.diseaseName}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${scan.confidence || 0}%` }}></div>
                              </div>
                              <span className="text-sm text-gray-600">{scan.confidence || 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">
                          لا توجد فحوصات مسجلة {selectedGov && "لهذه المحافظة"}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}