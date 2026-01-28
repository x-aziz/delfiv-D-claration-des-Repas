import React, { useState, useEffect } from "react";
import {
  ChefHat,
  TrendingUp,
  Users,
  Package,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  Cloud,
} from "lucide-react";
import { storage } from "../utils/storage";

const KitchenView = () => {
  const [declarations, setDeclarations] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [filter, setFilter] = useState("all");
  const [syncMessage, setSyncMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allData = storage.getDeclarations();
    // Filter ONLY expense declarations (those with recipientName, not meal declarations)
    const expenseData = allData.filter(d => d.recipientName && !d.hasOwnProperty('lunch'));
    setDeclarations(expenseData);
    setStatistics(storage.getStatistics());
  };

  const handleLoadFromSheets = async () => {
    setSyncMessage({ text: "🔄 جاري التحميل من Google Sheets...", type: "info" });
    try {
      await storage.loadFromGoogleSheets();
      loadData();
      setSyncMessage({ text: "✅ تم التحميل من Google Sheets بنجاح!", type: "success" });
    } catch (error) {
      console.error('Load error:', error);
      setSyncMessage({ text: "❌ فشل التحميل من Google Sheets", type: "error" });
    }
    setTimeout(() => setSyncMessage({ text: "", type: "" }), 4000);
  };

  const handleApprove = (id) => {
    storage.updateDeclaration(id, { status: "approved" });
    loadData();
  };

  const handleReject = (id) => {
    storage.updateDeclaration(id, { status: "rejected" });
    loadData();
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التصريح؟")) {
      storage.deleteDeclaration(id);
      loadData();
    }
  };

  const filteredDeclarations = declarations.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).replace(',', '');
    } catch (e) {
      return '-';
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: {
        bg: "rgba(243, 156, 18, 0.1)",
        color: "#f39c12",
        text: "قيد الانتظار",
      },
      approved: {
        bg: "rgba(56, 239, 125, 0.1)",
        color: "#38ef7d",
        text: "موافق عليه",
      },
      rejected: {
        bg: "rgba(238, 9, 121, 0.1)",
        color: "#ee0979",
        text: "مرفوض",
      },
    };

    const style = styles[status] || styles.pending;

    return (
      <span
        style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "6px",
          fontSize: "0.875rem",
          fontWeight: "600",
          background: style.bg,
          color: style.color,
        }}
      >
        {style.text}
      </span>
    );
  };

  return (
    <div className="main-content">
      <div className="stats-grid">
        <div className="stat-card">
          <Users size={32} color="#4a90e2" style={{ marginBottom: "0.5rem" }} />
          <div className="stat-value">{statistics.total || 0}</div>
          <div className="stat-label">إجمالي التصريحات</div>
        </div>

        <div className="stat-card">
          <Package
            size={32}
            color="#f39c12"
            style={{ marginBottom: "0.5rem" }}
          />
          <div className="stat-value">{statistics.pending || 0}</div>
          <div className="stat-label">قيد الانتظار</div>
        </div>

        <div className="stat-card">
          <CheckCircle
            size={32}
            color="#38ef7d"
            style={{ marginBottom: "0.5rem" }}
          />
          <div className="stat-value">{statistics.approved || 0}</div>
          <div className="stat-label">موافق عليها</div>
        </div>

        <div className="stat-card">
          <TrendingUp
            size={32}
            color="#e74c3c"
            style={{ marginBottom: "0.5rem" }}
          />
          <div className="stat-value">
            {(statistics.totalHorn || 0) +
              (statistics.totalChocolate || 0) +
              (statistics.totalBreak || 0)}
          </div>
          <div className="stat-label">إجمالي المواد</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <ChefHat size={28} />
          </div>
          <h2 className="card-title">عرض المطبخ - جميع التصريحات</h2>
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

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setFilter("all")}
            className={`btn ${filter === "all" ? "btn-primary" : ""}`}
            style={{ flex: "1", minWidth: "120px" }}
          >
            الكل ({statistics.total || 0})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`btn ${filter === "pending" ? "btn-primary" : ""}`}
            style={{ flex: "1", minWidth: "120px" }}
          >
            قيد الانتظار ({statistics.pending || 0})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`btn ${filter === "approved" ? "btn-primary" : ""}`}
            style={{ flex: "1", minWidth: "120px" }}
          >
            موافق عليها ({statistics.approved || 0})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`btn ${filter === "rejected" ? "btn-primary" : ""}`}
            style={{ flex: "1", minWidth: "120px" }}
          >
            مرفوضة ({statistics.rejected || 0})
          </button>
          <button
            onClick={loadData}
            className="btn"
            style={{ minWidth: "120px" }}
            title="تحديث البيانات"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {filteredDeclarations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--text-secondary)",
            }}
          >
            <Package
              size={64}
              style={{ margin: "0 auto 1rem", opacity: 0.3 }}
            />
            <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
              لا توجد تصريحات
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              قم بإنشاء تصريح جديد من القائمة الرئيسية
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="declarations-table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>المشتري</th>
                  <th>الخبز</th>
                  <th>علب المعجون</th>
                  <th>ثمن الكلي للبيض</th>
                  <th>المجموع</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeclarations.map((declaration) => (
                  <tr key={declaration.id}>
                    <td style={{ fontSize: "0.85rem" }}>
                      {formatDate(declaration.timestamp)}
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      {declaration.recipientName || '-'}
                    </td>
                    <td>{declaration.horn || "-"}</td>
                    <td>{declaration.chocolate || "-"}</td>
                    <td>{declaration.break || "-"}</td>
                    <td
                      style={{ fontWeight: "600", color: "var(--accent-blue)" }}
                    >
                      {declaration.group || '-'}
                    </td>
                    <td>{getStatusBadge(declaration.status)}</td>
                    <td>
                      <div className="action-buttons">
                        {declaration.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(declaration.id)}
                              className="btn btn-success btn-icon"
                              title="موافقة"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(declaration.id)}
                              className="btn btn-danger btn-icon"
                              title="رفض"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(declaration.id)}
                          className="btn btn-danger btn-icon"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredDeclarations.length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "var(--gradient-delfiv)",
              borderRadius: "12px",
              color: "white",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                إجمالي الخبز
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800" }}>
                {statistics.totalHorn || 0}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                إجمالي علب المعجون
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800" }}>
                {statistics.totalChocolate || 0}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                إجمالي ثمن البيض
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800" }}>
                {statistics.totalBreak || 0}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenView;