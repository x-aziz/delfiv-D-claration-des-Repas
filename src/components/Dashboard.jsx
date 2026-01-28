// import React, { useState, useEffect, useRef } from "react";
// import {
//   LayoutDashboard,
//   TrendingUp,
//   Users,
//   Package,
//   CheckCircle,
//   XCircle,
//   Trash2,
//   RefreshCw,
//   Download,
//   Upload,
// } from "lucide-react";
// import { storage } from "../utils/storage";

// const Dashboard = () => { 
//   const [declarations, setDeclarations] = useState([]);
//   const [statistics, setStatistics] = useState({});
//   const [filter, setFilter] = useState("all");
//   const [importMessage, setImportMessage] = useState({ text: '', type: '' });
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = () => {
//     const data = storage.getDeclarations();
//     setDeclarations(data);
//     setStatistics(storage.getStatistics());
//   };

//   const handleApprove = (id) => {
//     storage.updateDeclaration(id, { status: "approved" });
//     loadData();
//   };

//   const handleReject = (id) => {
//     storage.updateDeclaration(id, { status: "rejected" });
//     loadData();
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("هل أنت متأكد من حذف هذا التصريح؟")) {
//       storage.deleteDeclaration(id);
//       loadData();
//     }
//   };

//   // ========== EXPORT FUNCTION ==========
//   const handleExport = () => {
//     const success = storage.exportToJSON();
//     if (success) {
//       setImportMessage({ text: 'تم تصدير البيانات بنجاح!', type: 'success' });
//       setTimeout(() => setImportMessage({ text: '', type: '' }), 3000);
//     } else {
//       setImportMessage({ text: 'فشل تصدير البيانات', type: 'error' });
//     }
//   };

//   // ========== IMPORT FUNCTION ==========
//   const handleImport = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       const result = await storage.importFromJSON(file);
//       setImportMessage({ 
//         text: `تم استيراد ${result.count} تصريح بنجاح!`, 
//         type: 'success' 
//       });
//       loadData();
//       setTimeout(() => setImportMessage({ text: '', type: '' }), 3000);
//     } catch (error) {
//       setImportMessage({ 
//         text: 'فشل استيراد البيانات. تأكد من صحة الملف.', 
//         type: 'error' 
//       });
//     }
    
//     // Reset file input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const filteredDeclarations = declarations.filter((d) => {
//     if (filter === "all") return true;
//     return d.status === filter;
//   });

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString("fr-FR", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       pending: {
//         bg: "rgba(243, 156, 18, 0.1)",
//         color: "#f39c12",
//         text: "قيد الانتظار",
//       },
//       approved: {
//         bg: "rgba(56, 239, 125, 0.1)",
//         color: "#38ef7d",
//         text: "موافق عليه",
//       },
//       rejected: {
//         bg: "rgba(238, 9, 121, 0.1)",
//         color: "#ee0979",
//         text: "مرفوض",
//       },
//     };

//     const style = styles[status] || styles.pending;

//     return (
//       <span
//         style={{
//           padding: "0.25rem 0.75rem",
//           borderRadius: "6px",
//           fontSize: "0.875rem",
//           fontWeight: "600",
//           background: style.bg,
//           color: style.color,
//         }}
//       >
//         {style.text}
//       </span>
//     );
//   };

//   return (
//     <div className="main-content">
//       <div className="stats-grid">
//         <div className="stat-card">
//           <Users size={32} color="#4a90e2" style={{ marginBottom: "0.5rem" }} />
//           <div className="stat-value">{statistics.total || 0}</div>
//           <div className="stat-label">إجمالي التصريحات</div>
//         </div>

//         <div className="stat-card">
//           <Package
//             size={32}
//             color="#f39c12"
//             style={{ marginBottom: "0.5rem" }}
//           />
//           <div className="stat-value">{statistics.pending || 0}</div>
//           <div className="stat-label">قيد الانتظار</div>
//         </div>

//         <div className="stat-card">
//           <CheckCircle
//             size={32}
//             color="#38ef7d"
//             style={{ marginBottom: "0.5rem" }}
//           />
//           <div className="stat-value">{statistics.approved || 0}</div>
//           <div className="stat-label">موافق عليها</div>
//         </div>

//         <div className="stat-card">
//           <TrendingUp
//             size={32}
//             color="#e74c3c"
//             style={{ marginBottom: "0.5rem" }}
//           />
//           <div className="stat-value">
//             {(statistics.totalCategoryA || 0) +
//               (statistics.totalCategoryB || 0) +
//               (statistics.totalCategoryC || 0)}
//           </div>
//           <div className="stat-label">إجمالي البنود</div>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header">
//           <div className="card-icon">
//             <LayoutDashboard size={28} />
//           </div>
//           <h2 className="card-title">لوحة التحكم - جميع التصريحات</h2>
//         </div>

//         {/* ========== IMPORT MESSAGE ========== */}
//         {importMessage.text && (
//           <div className={`alert alert-${importMessage.type}`} style={{ marginBottom: '1rem' }}>
//             {importMessage.type === 'success' ? (
//               <CheckCircle size={20} />
//             ) : (
//               <XCircle size={20} />
//             )}
//             <span>{importMessage.text}</span>
//           </div>
//         )}

//         {/* ========== BUTTONS ROW ========== */}
//         <div
//           style={{
//             display: "flex",
//             gap: "0.5rem",
//             marginBottom: "1.5rem",
//             flexWrap: "wrap",
//           }}
//         >
//           <button
//             onClick={() => setFilter("all")}
//             className={`btn ${filter === "all" ? "btn-primary" : ""}`}
//             style={{ flex: "1", minWidth: "120px" }}
//           >
//             الكل ({statistics.total || 0})
//           </button>
//           <button
//             onClick={() => setFilter("pending")}
//             className={`btn ${filter === "pending" ? "btn-primary" : ""}`}
//             style={{ flex: "1", minWidth: "120px" }}
//           >
//             قيد الانتظار ({statistics.pending || 0})
//           </button>
//           <button
//             onClick={() => setFilter("approved")}
//             className={`btn ${filter === "approved" ? "btn-primary" : ""}`}
//             style={{ flex: "1", minWidth: "120px" }}
//           >
//             موافق عليها ({statistics.approved || 0})
//           </button>
//           <button
//             onClick={() => setFilter("rejected")}
//             className={`btn ${filter === "rejected" ? "btn-primary" : ""}`}
//             style={{ flex: "1", minWidth: "120px" }}
//           >
//             مرفوضة ({statistics.rejected || 0})
//           </button>
//           <button
//             onClick={loadData}
//             className="btn"
//             style={{ minWidth: "120px" }}
//             title="تحديث البيانات"
//           >
//             <RefreshCw size={18} />
//           </button>
//         </div>

//         {/* ========== EXPORT/IMPORT BUTTONS ========== */}
//         <div style={{ 
//           display: 'flex', 
//           gap: '0.5rem', 
//           marginBottom: '1.5rem',
//           padding: '1rem',
//           background: 'var(--bg-secondary)',
//           borderRadius: '10px',
//           border: '1px solid var(--border-color)'
//         }}>
//           <button
//             onClick={handleExport}
//             className="btn btn-success"
//             style={{ flex: 1 }}
//             title="تصدير البيانات"
//           >
//             <Download size={18} />
//             تصدير البيانات
//           </button>
          
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".json"
//             onChange={handleImport}
//             style={{ display: 'none' }}
//             id="import-file"
//           />
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="btn btn-primary"
//             style={{ flex: 1 }}
//             title="استيراد البيانات"
//           >
//             <Upload size={18} />
//             استيراد البيانات
//           </button>
//         </div>

//         {filteredDeclarations.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "3rem",
//               color: "var(--text-secondary)",
//             }}
//           >
//             <Package
//               size={64}
//               style={{ margin: "0 auto 1rem", opacity: 0.3 }}
//             />
//             <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
//               لا توجد تصريحات
//             </p>
//             <p style={{ fontSize: "0.9rem" }}>
//               قم بإنشاء تصريح جديد من القائمة الرئيسية
//             </p>
//           </div>
//         ) : (
//           <div style={{ overflowX: "auto" }}>
//             <table className="declarations-table">
//               <thead>
//                 <tr>
//                   <th>التاريخ</th>
//                   <th>المشتري</th>
//                   <th>البند الأول</th>
//                   <th>البند الثاني</th>
//                   <th>البند الثالث</th>
//                   <th>المجموع</th>
//                   <th>الحالة</th>
//                   <th>الإجراءات</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredDeclarations.map((declaration) => (
//                   <tr key={declaration.id}>
//                     <td style={{ fontSize: "0.85rem" }}>
//                       {formatDate(declaration.timestamp)}
//                     </td>
//                     <td style={{ fontWeight: "600" }}>
//                       {declaration.recipientName}
//                     </td>
//                     <td>{declaration.categoryA || "-"}</td>
//                     <td>{declaration.categoryB || "-"}</td>
//                     <td>{declaration.categoryC || "-"}</td>
//                     <td
//                       style={{ fontWeight: "600", color: "var(--accent-blue)" }}
//                     >
//                       {declaration.totalAmount}
//                     </td>
//                     <td>{getStatusBadge(declaration.status)}</td>
//                     <td>
//                       <div className="action-buttons">
//                         {declaration.status === "pending" && (
//                           <>
//                             <button
//                               onClick={() => handleApprove(declaration.id)}
//                               className="btn btn-success btn-icon"
//                               title="موافقة"
//                             >
//                               <CheckCircle size={18} />
//                             </button>
//                             <button
//                               onClick={() => handleReject(declaration.id)}
//                               className="btn btn-danger btn-icon"
//                               title="رفض"
//                             >
//                               <XCircle size={18} />
//                             </button>
//                           </>
//                         )}
//                         <button
//                           onClick={() => handleDelete(declaration.id)}
//                           className="btn btn-danger btn-icon"
//                           title="حذف"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {filteredDeclarations.length > 0 && (
//           <div
//             style={{
//               marginTop: "2rem",
//               padding: "1.5rem",
//               background: "var(--gradient-delfi)",
//               borderRadius: "12px",
//               color: "white",
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
//               gap: "1rem",
//             }}
//           >
//             <div style={{ textAlign: "center" }}>
//               <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
//                 إجمالي البند الأول
//               </div>
//               <div style={{ fontSize: "1.8rem", fontWeight: "800" }}>
//                 {statistics.totalCategoryA || 0}
//               </div>
//             </div>
//             <div style={{ textAlign: "center" }}>
//               <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
//                 إجمالي البند الثاني
//               </div>
//               <div style={{ fontSize: "1.8rem", fontWeight: "800" }}>
//                 {statistics.totalCategoryB || 0}
//               </div>
//             </div>
//             <div style={{ textAlign: "center" }}>
//               <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
//                 إجمالي البند الثالث
//               </div>
//               <div style={{ fontSize: "1.8rem", fontWeight: "800" }}>
//                 {statistics.totalCategoryC || 0}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;