"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plant, Disease as PlantDisease } from "@/lib/types";
import { plantsData } from "@/lib/PlantsData";

const categories = ["الكل", "فاكهة", "خضروات", "حبوب", "أشجار"] as const;

const imageTabs: Array<["fruit", string] | ["leaf", string]> = [
  ["fruit", "🍎 الثمرة"],
  ["leaf", "🍃 الورق"],
];

const severityColor = {
  خفيف: { bg: "rgba(16, 185, 129, 0.12)", text: "#a7f3d0", dot: "#10b981" },
  متوسط: { bg: "rgba(245, 158, 11, 0.12)", text: "#fde047", dot: "#f59e0b" },
  شديد: { bg: "rgba(239, 68, 68, 0.12)", text: "#fca5a5", dot: "#ef4444" },
};

const typeIcon = { فطري: "🍄", فيروسي: "🦠", بكتيري: "🔬" };

export default function PlantsPanel() {
  const router = useRouter();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("الكل");
  const [imageTab, setImageTab] = useState<"fruit" | "leaf">("fruit");
  const [diseaseFilter, setDiseaseFilter] = useState<string>("الكل");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const filtered = plantsData.filter((p: Plant) => {
    const matchCat = category === "الكل" || p.category === category;
    const q = search.trim();
    const matchSearch =
      !q ||
      p.name.includes(q) ||
      p.nameEn.toLowerCase().includes(q.toLowerCase()) ||
      p.diseases.some((d: PlantDisease) => d.name.includes(q));
    return matchCat && matchSearch;
  });

  const selectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setSelectedDisease(0);
    setImageTab("fruit");
    setDiseaseFilter("الكل");
  };

  const filteredDiseases: PlantDisease[] =
    selectedPlant?.diseases.filter((d: PlantDisease) => {
      if (diseaseFilter === "الكل") return true;
      if (diseaseFilter === "أوراق") return d.affectsLeaf;
      if (diseaseFilter === "ثمار") return d.affectsFruit;
      return true;
    }) || [];

  // Reset selected disease index if it exceeds the filtered diseases length
  useEffect(() => {
    if (selectedDisease >= filteredDiseases.length) {
      setSelectedDisease(0);
    }
  }, [filteredDiseases, selectedDisease]);

  useEffect(() => {
    if (filtered.length > 0 && !selectedPlant) setSelectedPlant(filtered[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="plants-container"
      style={{
        fontFamily: "'Noto Naskh Arabic', 'Cairo', serif",
        direction: "rtl",
        display: "flex",
        height: "100vh",
        background: "radial-gradient(circle at 50% 50%, #08150a 0%, #030804 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Cairo:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 2px; }
        
        .plant-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border-right: 3px solid transparent !important;
          border-radius: 8px !important;
          margin: 2px 8px !important;
        }
        .plant-item:hover { 
          background: rgba(16, 185, 129, 0.08) !important; 
          transform: translateX(-2px);
        }
        .plant-item.active { 
          background: linear-gradient(270deg, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.02) 100%) !important; 
          border-right: 3px solid #10b981 !important; 
          color: #a7f3d0 !important;
          box-shadow: inset 3px 0 10px rgba(16, 185, 129, 0.04);
        }
        .plant-item.active div div {
          color: #10b981 !important;
          font-weight: 800 !important;
        }
        
        .cat-pill {
          transition: all 0.2s ease-in-out !important;
          border: 1px solid rgba(16, 185, 129, 0.15) !important;
        }
        .cat-pill:hover { 
          background: rgba(16, 185, 129, 0.12) !important; 
          border-color: rgba(16, 185, 129, 0.3) !important;
          transform: translateY(-1px);
        }
        .cat-pill.active { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important; 
          color: #ffffff !important; 
          border-color: transparent !important;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
        }
        
        .dis-chip { 
          cursor: pointer; 
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; 
          border: 1px solid rgba(16, 185, 129, 0.15) !important;
        }
        .dis-chip:hover { 
          transform: translateY(-2px); 
          background: rgba(16, 185, 129, 0.1) !important; 
          border-color: rgba(16, 185, 129, 0.3) !important;
        }
        .dis-chip.active {
          background: rgba(16, 185, 129, 0.15) !important;
          border-color: #10b981 !important;
          color: #a7f3d0 !important;
        }
        
        .img-tab { 
          cursor: pointer; 
          transition: all 0.2s ease-in-out !important; 
        }
        .img-tab:hover { 
          background: rgba(16, 185, 129, 0.08) !important; 
          color: #a7f3d0 !important;
        }
        .img-tab.active { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important; 
          color: #ffffff !important; 
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);
        }
        
        .toggle-btn { transition: all 0.2s ease-in-out !important; }
        .toggle-btn:hover { background: rgba(16, 185, 129, 0.2) !important; transform: scale(1.05); }
        
        .df-filter { 
          cursor: pointer; 
          transition: all 0.2s ease-in-out !important; 
          padding: 4px 10px !important; 
          border-radius: 20px !important; 
          font-size: 12px !important; 
          font-family: 'Cairo', serif !important; 
          font-weight: 600 !important; 
          color: #8ce095 !important; 
          border: 1px solid rgba(16, 185, 129, 0.2) !important; 
        }
        .df-filter.active { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important; 
          color: #ffffff !important; 
          border-color: transparent !important;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);
        }
        .df-filter:hover { 
          border-color: rgba(16, 185, 129, 0.4) !important; 
          background: rgba(16, 185, 129, 0.05) !important;
        }
        
        .search-input {
          transition: all 0.2s ease !important;
        }
        .search-input:focus {
          border-color: rgba(16, 185, 129, 0.4) !important;
          background: rgba(16, 185, 129, 0.12) !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.1) !important;
        }
        
        .back-btn { transition: all 0.2s ease-in-out !important; }
        .back-btn:hover { background: rgba(16, 185, 129, 0.2) !important; transform: scale(1.08) !important; color: #a7f3d0 !important; border-color: rgba(16, 185, 129, 0.4) !important; }
        .back-btn:active { transform: scale(0.92) !important; }
        
        input::placeholder { color: #4a6b4e; }
        .badge-leaf { background: rgba(52,168,83,0.15); color: #52a853; border: 1px solid rgba(52,168,83,0.3); }
        .badge-fruit { background: rgba(255,111,0,0.12); color: #ff8c3a; border: 1px solid rgba(255,111,0,0.25); }

        @media (max-width: 900px) {
          .plants-container { height: 100vh !important; overflow: hidden !important; flex-direction: row-reverse !important; }
          .sidebar-panel {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: auto !important;
            width: 280px !important;
            min-width: 280px !important;
            height: 100vh !important;
            max-height: none !important;
            z-index: 1000 !important;
            border-left: none !important;
            border-right: 1px solid rgba(16,185,129,0.15) !important;
            transform: translateX(0) !important;
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.5) !important;
          }
          .sidebar-panel.closed {
            transform: translateX(100%) !important;
            width: 280px !important;
            min-width: 280px !important;
            height: 100vh !important;
            border: none !important;
            padding: 0 !important;
          }
          .main-content-panel {
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          .top-grid { grid-template-columns: 1fr !important; }
          .dual-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) {
          .sidebar-overlay { display: none !important; }
        }
      `}</style>

      {/* Overlay Backdrop for Mobile Drawer */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(6, 12, 9, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <div
        className={`sidebar-panel ${!sidebarOpen ? "closed" : ""}`}
        style={{
          width: sidebarOpen ? 280 : 0,
          minWidth: sidebarOpen ? 280 : 0,
          background: "#030704",
          borderLeft: "1px solid rgba(16, 185, 129, 0.15)",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 16px 12px",
            borderBottom: "1px solid rgba(74,180,90,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>🌾</span>
              <span
                style={{
                  fontFamily: "'Cairo', serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#c8f0cc",
                }}
              >
                سنبلة
              </span>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: "rgba(74,180,90,0.1)",
                  border: "1px solid rgba(74,180,90,0.2)",
                  borderRadius: 8,
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "#6baa73",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 13,
                opacity: 0.5,
              }}
            >
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن نبات..."
              className="search-input"
              style={{
                width: "100%",
                padding: "8px 32px 8px 10px",
                background: "rgba(74,180,90,0.08)",
                border: "1px solid rgba(74,180,90,0.15)",
                borderRadius: 10,
                color: "#c8f0cc",
                fontSize: 13,
                fontFamily: "'Cairo', serif",
                outline: "none",
              }}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {categories.map((c) => (
              <button
                key={c}
                className={`cat-pill ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  border: "1px solid rgba(74,180,90,0.2)",
                  background: "transparent",
                  color: "#6baa73",
                  fontSize: 11,
                  fontFamily: "'Cairo', serif",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Plant list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          <div
            style={{
              padding: "8px 16px 4px",
              fontSize: 10,
              color: "#3d6b42",
              fontFamily: "'Cairo', serif",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            النباتات ({filtered.length})
          </div>
          {filtered.map((plant: Plant) => (
            <div
              key={plant.id}
              className={`plant-item ${selectedPlant?.id === plant.id ? "active" : ""}`}
              onClick={() => selectPlant(plant)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                cursor: "pointer",
                borderRight: "3px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 20 }}>{plant.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Cairo', serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#c8f0cc",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {plant.name}
                </div>
                <div style={{ fontSize: 11, color: "#4a7a50" }}>
                  {plant.category} · {plant.diseases.length} أمراض
                </div>
              </div>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: plant.diseases.some(
                    (d: PlantDisease) => d.severity.includes("شديد")
                  )
                    ? "#dc3545"
                    : "#ffc107",
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 16px",
                color: "#3d6b42",
                fontSize: 13,
                fontFamily: "'Cairo', serif",
              }}
            >
              🔍 لا توجد نتائج
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(74,180,90,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => router.push("/settings")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "none",
                border: "none",
                color: "#4a7a50",
                fontFamily: "'Cairo', serif",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <span>⚙️</span>
              <span>الإعدادات</span>
            </button>
            <button
              onClick={() => router.push("/about")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "none",
                border: "none",
                color: "#4a7a50",
                fontFamily: "'Cairo', serif",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <span>ℹ️</span>
              <span>حول</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div
        className="main-content-panel"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            padding: "14px 24px",
            background: "rgba(4, 11, 7, 0.85)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.15)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="back-btn"
              onClick={() => router.push("/")}
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: 8,
                width: 34,
                height: 34,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                transition: "all 0.15s",
                color: "#8ce095",
              }}
              title="رجوع"
            >
              →
            </button>
            <button
              className="toggle-btn"
              onClick={() => setSidebarOpen((v) => !v)}
              style={{
                background: "rgba(74,180,90,0.1)",
                border: "1px solid rgba(74,180,90,0.2)",
                borderRadius: 8,
                width: 34,
                height: 34,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                transition: "all 0.15s",
                color: "#6baa73",
              }}
            >
              {isMobile ? (sidebarOpen ? "✕" : "☰") : (sidebarOpen ? "◀" : "▶")}
            </button>
            {selectedPlant && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{selectedPlant.emoji}</span>
                <span
                  style={{
                    fontFamily: "'Cairo', serif",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#c8f0cc",
                  }}
                >
                  {selectedPlant.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#4a7a50",
                    fontStyle: "italic",
                  }}
                >
                  {selectedPlant.nameEn}
                </span>
              </div>
            )}
          </div>
          {selectedPlant && (
            <div style={{ display: "flex", gap: 6 }}>
              <span
                style={{
                  background: "rgba(74,180,90,0.15)",
                  color: "#6baa73",
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontFamily: "'Cairo', serif",
                  fontWeight: 700,
                }}
              >
                {selectedPlant.category}
              </span>
              <span
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#4a7a50",
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontFamily: "'Cairo', serif",
                }}
              >
                📅 {selectedPlant.season}
              </span>
            </div>
          )}
        </div>

        {/* Content area */}
        {selectedPlant ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {/* Top section: images + info */}
            <div
              className="top-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "340px 1fr",
                gap: 20,
                marginBottom: 24,
              }}
            >
              {/* Images card */}
              <div
                style={{
                  background: "rgba(4, 11, 7, 0.85)",
                  borderRadius: 16,
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.02)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid rgba(74,180,90,0.1)",
                  }}
                >
                  {imageTabs.map(([tab, label]) => (
                    <button
                      key={tab}
                      className={`img-tab ${imageTab === tab ? "active" : ""}`}
                      onClick={() => setImageTab(tab)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "none",
                        background: "transparent",
                        color: "#6baa73",
                        fontFamily: "'Cairo', serif",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div style={{ position: "relative", height: 220 }}>
                  <img
                    src={
                      imageTab === "fruit"
                        ? selectedPlant.image
                        : selectedPlant.leafImage
                    }
                    alt={selectedPlant.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(4px)",
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      color: "#a8f0b0",
                      fontFamily: "'Cairo', serif",
                      fontWeight: 600,
                    }}
                  >
                    {imageTab === "fruit" ? "ثمرة" : "ورقة"}{" "}
                    {selectedPlant.name}
                  </div>
                </div>
              </div>

              {/* Info card */}
              <div
                style={{
                  background: "rgba(4, 11, 7, 0.85)",
                  borderRadius: 16,
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.02)",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: "#8ab88e",
                    lineHeight: 1.8,
                    fontFamily: "'Noto Naskh Arabic', serif",
                  }}
                >
                  {selectedPlant.description}
                </p>
                <div style={{ display: "flex", gap: 20 }}>
                  {[
                    ["📍", "المنطقة", selectedPlant.region],
                    ["📅", "الموسم", selectedPlant.season],
                  ].map(([icon, label, val]) => (
                    <div key={label}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#3d6b42",
                          fontFamily: "'Cairo', serif",
                          fontWeight: 700,
                          marginBottom: 3,
                        }}
                      >
                        {icon} {label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#a8d4ac",
                          fontFamily: "'Cairo', serif",
                          fontWeight: 600,
                        }}
                      >
                        {val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Disease summary chips */}
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#3d6b42",
                      fontFamily: "'Cairo', serif",
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    الأمراض الموثقة ({selectedPlant.diseases.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedPlant.diseases.map((d, i) => {
                      const sc =
                        severityColor[d.severity as keyof typeof severityColor] || severityColor["متوسط"];
                      return (
                        <div
                          key={i}
                          className={`dis-chip ${selectedDisease === i ? "active" : ""}`}
                          onClick={() => setSelectedDisease(i)}
                          style={{
                            background: sc.bg + "22",
                            border: `1px solid ${sc.dot}44`,
                            borderRadius: 20,
                            padding: "4px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: sc.dot,
                              display: "block",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              color: sc.text,
                              fontFamily: "'Cairo', serif",
                              fontWeight: 700,
                            }}
                          >
                            {d.name}
                          </span>
                          <span style={{ fontSize: 10, color: sc.text + "99" }}>
                            {typeIcon[d.type as keyof typeof typeIcon] || "🔬"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Diseases section */}
            <div
              style={{
                background: "rgba(4, 11, 7, 0.85)",
                borderRadius: 16,
                border: "1px solid rgba(16, 185, 129, 0.15)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.02)",
              }}
            >
              {/* Disease section header */}
              <div
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(74,180,90,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🦠</span>
                  <span
                    style={{
                      fontFamily: "'Cairo', serif",
                      fontWeight: 800,
                      fontSize: 15,
                      color: "#c8f0cc",
                    }}
                  >
                    الأمراض والعلاج
                  </span>
                </div>

                {/* Sub-filters for organs affected */}
                <div style={{ display: "flex", gap: 6 }}>
                  {["الكل", "أوراق", "ثمار"].map((df) => (
                    <button
                      key={df}
                      className={`df-filter ${diseaseFilter === df ? "active" : ""}`}
                      onClick={() => {
                        setDiseaseFilter(df);
                        setSelectedDisease(0);
                      }}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        border: "1px solid rgba(74,180,90,0.2)",
                        background: "transparent",
                        fontSize: 11,
                        fontFamily: "'Cairo', serif",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {df === "الكل" ? "الكل" : df === "أوراق" ? "🍃 أوراق" : "🍅 ثمار"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disease Tabs Row */}
              {filteredDiseases.length > 0 ? (
                <div style={{ padding: "16px 20px 0" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, borderBottom: "1px solid rgba(74,180,90,0.08)", paddingBottom: "12px" }}>
                    {filteredDiseases.map((d: PlantDisease, idx: number) => {
                      const isSelected = selectedDisease === idx;
                      const sc = severityColor[d.severity as keyof typeof severityColor] || severityColor["متوسط"];
                      return (
                        <button
                          key={d.name}
                          onClick={() => setSelectedDisease(idx)}
                          className={`dis-chip ${isSelected ? "active" : ""}`}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            border: isSelected ? "2px solid #4ab45a" : "1px solid rgba(74,180,90,0.15)",
                            background: isSelected ? "rgba(74,180,90,0.15)" : "transparent",
                            color: isSelected ? "#a8f0b0" : "#6baa73",
                            fontSize: 12,
                            fontFamily: "'Cairo', serif",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: sc.dot,
                              display: "block",
                            }}
                          />
                          <span>{d.name}</span>
                          <span style={{ fontSize: 10, color: isSelected ? "#a8f0b0" : "#6baa73" }}>
                            {typeIcon[d.type as keyof typeof typeIcon] || "🔬"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Active Disease Content Panels */}
              {filteredDiseases.length > 0 && filteredDiseases[selectedDisease] ? (
                (() => {
                  const disease = filteredDiseases[selectedDisease];
                  const sc = severityColor[disease.severity as keyof typeof severityColor] || severityColor["متوسط"];
                  return (
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Specifications Badges */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <span
                          style={{
                            background: sc.bg + "22",
                            color: sc.text,
                            border: `1px solid ${sc.dot}44`,
                            padding: "4px 12px",
                            borderRadius: 12,
                            fontSize: 12,
                            fontFamily: "'Cairo', serif",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: sc.dot,
                            }}
                          />
                          الخطورة: {disease.severity}
                        </span>

                        <span
                          style={{
                            background: "rgba(52,168,83,0.12)",
                            color: "#c8f0cc",
                            border: "1px solid rgba(52,168,83,0.25)",
                            padding: "4px 12px",
                            borderRadius: 12,
                            fontSize: 12,
                            fontFamily: "'Cairo', serif",
                            fontWeight: 700,
                          }}
                        >
                          {typeIcon[disease.type as keyof typeof typeIcon] || "🔬"} نوع الإصابة: {disease.type}
                        </span>

                        {disease.affectsLeaf && (
                          <span className="badge-leaf" style={{ padding: "4px 12px", borderRadius: 12, fontSize: 12, fontFamily: "'Cairo', serif", fontWeight: 700 }}>
                            🍃 يصيب الأوراق
                          </span>
                        )}

                        {disease.affectsFruit && (
                          <span className="badge-fruit" style={{ padding: "4px 12px", borderRadius: 12, fontSize: 12, fontFamily: "'Cairo', serif", fontWeight: 700 }}>
                            🍅 يصيب الثمار
                          </span>
                        )}
                      </div>

                      {/* Symptoms & Causes Dual Grid */}
                      <div className="dual-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
                        {/* Causes Card */}
                        <div
                          style={{
                            background: "rgba(74,180,90,0.04)",
                            border: "1px solid rgba(74,180,90,0.12)",
                            borderRadius: 12,
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <h4
                            style={{
                              fontSize: 13,
                              color: "#8ab88e",
                              fontFamily: "'Cairo', serif",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span>🔬</span> الأسباب والظروف النشطة
                          </h4>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#a8d4ac",
                              lineHeight: 1.7,
                              fontFamily: "'Noto Naskh Arabic', serif",
                            }}
                          >
                            {disease.causes}
                          </p>
                        </div>

                        {/* Symptoms Card */}
                        <div
                          style={{
                            background: "rgba(74,180,90,0.04)",
                            border: "1px solid rgba(74,180,90,0.12)",
                            borderRadius: 12,
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <h4
                            style={{
                              fontSize: 13,
                              color: "#8ab88e",
                              fontFamily: "'Cairo', serif",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span>🔍</span> الأعراض المميزة
                          </h4>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {disease.symptoms.map((s, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 8,
                                  fontSize: 13,
                                  color: "#a8d4ac",
                                  lineHeight: 1.6,
                                  fontFamily: "'Noto Naskh Arabic', serif",
                                }}
                              >
                                <span style={{ color: "#4ab45a", marginTop: 2 }}>•</span>
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Treatment & Prevention Card (Additional Row) */}
                      <div className="dual-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        {/* Treatment Card */}
                        <div
                          style={{
                            background: "rgba(52,168,83,0.05)",
                            border: "1px solid rgba(52,168,83,0.15)",
                            borderRadius: 12,
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <h4
                            style={{
                              fontSize: 13,
                              color: "#6baa73",
                              fontFamily: "'Cairo', serif",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span>💊</span> العلاج والمكافحة الزراعية
                          </h4>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#a8f0b0",
                              lineHeight: 1.7,
                              fontFamily: "'Noto Naskh Arabic', serif",
                              fontWeight: 600,
                            }}
                          >
                            {disease.treatment}
                          </p>
                        </div>

                        {/* Prevention Card */}
                        <div
                          style={{
                            background: "rgba(255,167,38,0.04)",
                            border: "1px solid rgba(255,167,38,0.15)",
                            borderRadius: 12,
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <h4
                            style={{
                              fontSize: 13,
                              color: "#ffb74d",
                              fontFamily: "'Cairo', serif",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span>🛡</span> الوقاية والتدابير المستدامة
                          </h4>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#ffe082",
                              lineHeight: 1.7,
                              fontFamily: "'Noto Naskh Arabic', serif",
                              fontWeight: 600,
                            }}
                          >
                            {disease.prevention}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#3d6b42", fontFamily: "'Cairo', serif" }}>
                  لا توجد أمراض مسجلة حالياً لهذه الفئة
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#3d6b42",
              fontFamily: "'Cairo', serif",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 40 }}>🌿</span>
            <span>يرجى اختيار نبات من القائمة الجانبية</span>
          </div>
        )}
      </div>
    </div>
  );
}
