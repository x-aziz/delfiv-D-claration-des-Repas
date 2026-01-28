import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";

const DelfivMealForm = () => {
  const [name, setName] = useState("");
  const [lunch, setLunch] = useState(true);
  const [dinner, setDinner] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [canDeclare, setCanDeclare] = useState(true);

  const tomorrowDate = storage.getTomorrowDate();
  const displayDate = storage.formatDateForDisplay(tomorrowDate);

  useEffect(() => {
    setCanDeclare(storage.isBeforeDeadline());
    const interval = setInterval(() => {
      setCanDeclare(storage.isBeforeDeadline());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage({ text: "الرجاء إدخال الاسم.", type: "error" });
      return;
    }

    if (!canDeclare) {
      setMessage({
        text: "تم إغلاق التصريحات الخاصة بالغد.",
        type: "error",
      });
      return;
    }

    const declaration = {
      name: name.trim(),
      date: tomorrowDate,
      lunch,
      dinner,
      type: "delfiv-meal",
    };

    try {
      storage.saveDeclaration(declaration);
      setMessage({
        text: "تم تسجيل التصريح بنجاح!",
        type: "success",
      });

      setName("");
      setLunch(true);
      setDinner(true);

      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setMessage({
        text: "حدث خطأ أثناء الحفظ.",
        type: "error",
      });
    }
  };

  return (
    <div className="main-content">
      <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="card-header">
          <div className="card-icon">
            <Send size={28} />
          </div>
          <h2 className="card-title">التصريح بالوجبة</h2>
        </div>

        {!canDeclare && (
          <div className="alert alert-error">
            <AlertCircle size={24} />
            <div>
              <p>⏰ تم إغلاق التصريحات الخاصة بالغد.</p>
              <p style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                يرجى المحاولة غدًا قبل الساعة 22:00.
              </p>
            </div>
          </div>
        )}

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
          <span style={{ fontWeight: "500", color: "var(--text-secondary)" }}>
            وجبة يوم :  
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              الاسم الكامل <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك"
              disabled={!canDeclare}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">الغداء</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", border: "2px solid var(--border-color)", borderRadius: "10px", cursor: "pointer", justifyContent: "center" }}>
                <input type="radio" name="lunch" checked={lunch === true} onChange={() => setLunch(true)} disabled={!canDeclare} />
                <span>نعم</span>
              </label>
              <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", border: "2px solid var(--border-color)", borderRadius: "10px", cursor: "pointer", justifyContent: "center" }}>
                <input type="radio" name="lunch" checked={lunch === false} onChange={() => setLunch(false)} disabled={!canDeclare} />
                <span>لا</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">العشاء</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", border: "2px solid var(--border-color)", borderRadius: "10px", cursor: "pointer", justifyContent: "center" }}>
                <input type="radio" name="dinner" checked={dinner === true} onChange={() => setDinner(true)} disabled={!canDeclare} />
                <span>نعم</span>
              </label>
              <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", border: "2px solid var(--border-color)", borderRadius: "10px", cursor: "pointer", justifyContent: "center" }}>
                <input type="radio" name="dinner" checked={dinner === false} onChange={() => setDinner(false)} disabled={!canDeclare} />
                <span>لا</span>
              </label>
            </div>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <span>{message.text}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={!canDeclare}>
            <Send size={20} />
            تأكيد التصريح
          </button>
        </form>
      </div>
    </div>
  );
};

export default DelfivMealForm;
