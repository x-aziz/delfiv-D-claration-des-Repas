import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";
import { Calendar, RefreshCw, Cloud } from "lucide-react";
import { getDefaultLunchConsumers, getDefaultDinnerConsumers } from "../services/employeeDatabase";
import { vacationService } from "../services/vacationService.js";
import { useNavigate } from "react-router-dom";
const DelfivKitchenView = () => {
  const navigate = useNavigate();
  const [declarations, setDeclarations] = useState([]);
  const [stats, setStats] = useState({ lunch: 0, dinner: 0 });
  const [syncMessage, setSyncMessage] = useState({ text: "", type: "" });

  const tomorrowDate = storage.getTomorrowDate();
  const displayDate = storage.formatDateForDisplay(tomorrowDate);

  useEffect(() => {
    storage.cleanOldDeclarations();
    loadDeclarations();

    const interval = setInterval(() => {
      loadDeclarations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  
  const loadDeclarations = () => {
    // Filter declarations that have 'lunch' and 'dinner' fields (DELFIV type)
    const allData = storage.getDeclarationsByDate(tomorrowDate);
    const delfivData = allData.filter(d => 
      d.hasOwnProperty('lunch') && d.hasOwnProperty('dinner') && d.name
    );
    
    console.log('Delfiv data filtered:', delfivData);
    setDeclarations(delfivData);

    // Calculate statistics with corrected logic:
    // Start from total default consumers, then subtract those who said "No"
    
    // Get all default lunch consumers (not on vacation)
    const defaultLunchEmployees = getDefaultLunchConsumers().filter(
      emp => !vacationService.isEmployeeOnVacation(emp.id)
    );
    
    // Get all residential employees (not on vacation) for dinner
    const defaultDinnerEmployees = getDefaultDinnerConsumers().filter(
      emp => !vacationService.isEmployeeOnVacation(emp.id)
    );
    
    // Start with total defaults
    let lunchCount = defaultLunchEmployees.length;
    let dinnerCount = defaultDinnerEmployees.length;
    
    // Subtract those who explicitly said NO
    delfivData.forEach((d) => {
      // For lunch: if employee said NO, subtract 1
      if (d.lunch === false) {
        lunchCount--;
      }
      
      // For dinner: if employee said NO, subtract 1
      if (d.dinner === false) {
        dinnerCount--;
      }
    });
    
    // Handle edge case: if someone who defaults to NO said YES, add them
    delfivData.forEach((d) => {
      const employeeDefaultsLunch = defaultLunchEmployees.some(emp => emp.id === d.employeeId);
      const employeeDefaultsDinner = defaultDinnerEmployees.some(emp => emp.id === d.employeeId);
      
      // If employee doesn't default to lunch but said YES
      if (!employeeDefaultsLunch && d.lunch === true) {
        lunchCount++;
      }
      
      // If employee doesn't default to dinner but said YES
      if (!employeeDefaultsDinner && d.dinner === true) {
        dinnerCount++;
      }
    });

    // Ensure counts don't go negative
    lunchCount = Math.max(0, lunchCount);
    dinnerCount = Math.max(0, dinnerCount);

    setStats({ lunch: lunchCount, dinner: dinnerCount });
  };

  const handleLoadFromSheets = async () => {
    setSyncMessage({ text: "🔄 جاري التحميل من Google Sheets...", type: "info" });
    try {
      await storage.loadFromGoogleSheets();
      loadDeclarations();
      setSyncMessage({ text: "✅ تم التحميل من Google Sheets بنجاح!", type: "success" });
    } catch (error) {
      console.error('Load error:', error);
      setSyncMessage({ text: "❌ فشل التحميل من Google Sheets", type: "error" });
    }
    setTimeout(() => setSyncMessage({ text: "", type: "" }), 4000);
  };

  return (
    <div className="main-content">
      <div className="card">
         <button
          onClick={() => navigate(-1)}
          className="btn"
          style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          {/* <ArrowLeft size={18} /> */}
          رجوع
        </button>
        <div className="card-header">
          <div className="card-icon">
            <Calendar size={28} />
          </div>
          <h2 className="card-title">واجهة المطبخ - وجبات يوم الغد</h2>
        </div>

        <div
          style={{
            background: "var(--bg-secondary)",
            padding: "1rem",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "2rem",
            border: "2px solid var(--accent-blue)",
          }}
        >
          <span
            style={{ fontWeight: "500", color: "var(--text-secondary)" }}
          >
            وجبة يوم:{" "}
          </span>
          <span
            style={{
              fontWeight: "700",
              fontSize: "1.25rem",
              color: "var(--text-primary)",
            }}
          >
            {displayDate}
          </span>
        </div>

        {/* Google Sheets Sync Button */}
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={handleLoadFromSheets}
            className="btn btn-primary"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Cloud size={20} />
            📥 تحميل البيانات من Google Sheets
          </button>
          
          {syncMessage.text && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: "600",
                background:
                  syncMessage.type === "success"
                    ? "rgba(56, 239, 125, 0.1)"
                    : syncMessage.type === "error"
                    ? "rgba(238, 9, 121, 0.1)"
                    : "rgba(66, 153, 225, 0.1)",
                color:
                  syncMessage.type === "success"
                    ? "#38ef7d"
                    : syncMessage.type === "error"
                    ? "#ee0979"
                    : "#4299e1",
              }}
            >
              {syncMessage.text}
            </div>
          )}
        </div>

        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              🍽️
            </div>
            <div className="stat-value">{stats.lunch}</div>
            <div className="stat-label">وجبات الغداء</div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              🌙
            </div>
            <div className="stat-value">{stats.dinner}</div>
            <div className="stat-label">وجبات العشاء</div>
          </div>
        </div>

        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={loadDeclarations} className="btn btn-primary">
            <RefreshCw size={18} />
            تحديث
          </button>
        </div>

        {declarations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--text-secondary)",
            }}
          >
            <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
              لا توجد أي تصريحات حالياً.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="declarations-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الغداء</th>
                  <th>العشاء</th>
                </tr>
              </thead>
              <tbody>
                {declarations.map((declaration) => (
                  <tr key={declaration.id}>
                    <td style={{ fontWeight: "600" }}>{declaration.name || '-'}</td>
                    <td>
                      <span
                        style={{
                          padding: "0.375rem 0.875rem",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          background: declaration.lunch
                            ? "rgba(56, 239, 125, 0.15)"
                            : "rgba(231, 76, 60, 0.15)",
                          color: declaration.lunch ? "#11998e" : "#ee0979",
                        }}
                      >
                        {declaration.lunch ? "✓ نعم" : "✗ لا"}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0.375rem 0.875rem",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          background: declaration.dinner
                            ? "rgba(56, 239, 125, 0.15)"
                            : "rgba(231, 76, 60, 0.15)",
                          color: declaration.dinner ? "#11998e" : "#ee0979",
                        }}
                      >
                        {declaration.dinner ? "✓ نعم" : "✗ لا"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {declarations.length > 0 && (
          <button
            className="btn btn-block"
            onClick={() => window.print()}
            style={{ marginTop: "1.5rem" }}
          >
            🖨️ طباعة
          </button>
        )}
      </div>
    </div>
  );
};

export default DelfivKitchenView;