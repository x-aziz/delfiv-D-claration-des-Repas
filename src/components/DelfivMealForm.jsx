import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { authService } from "../services/authService";
import { mealService } from "../services/mealService";
import { vacationService } from "../services/vacationService";

const DelfivMealForm = () => {
  const currentUser = authService.getCurrentUser();
  const [lunch, setLunch] = useState(currentUser?.defaultLunch || true);
  const [dinner, setDinner] = useState(currentUser?.defaultDinner || true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [canDeclare, setCanDeclare] = useState(true);
  const [isOnVacation, setIsOnVacation] = useState(false);

  const tomorrowDate = storage.getTomorrowDate();
  const displayDate = storage.formatDateForDisplay(tomorrowDate);

  useEffect(() => {
    // Check if user is on vacation
    if (currentUser) {
      const onVacation = vacationService.isEmployeeOnVacation(currentUser.id);
      setIsOnVacation(onVacation);

      if (onVacation) {
        setMessage({
          text: "أنت في إجازة حالياً. لا يمكنك التصريح بالوجبات.",
          type: "error"
        });
      }
    }

    setCanDeclare(storage.isBeforeDeadline());
    const interval = setInterval(() => {
      setCanDeclare(storage.isBeforeDeadline());
    }, 60000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Disable dinner for non-residential employees
  const canHaveDinner = currentUser?.residential;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isOnVacation) {
      setMessage({
        text: "لا يمكنك التصريح بالوجبات أثناء الإجازة.",
        type: "error"
      });
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
      employeeId: currentUser.id,
      name: currentUser.name,
      date: tomorrowDate,
      lunch,
      dinner: canHaveDinner ? dinner : false,
      type: "delfiv-meal",
    };

    try {
      await storage.saveDeclaration(declaration);
      setMessage({
        text: "تم تسجيل التصريح بنجاح!",
        type: "success",
      });

      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setMessage({
        text: "حدث خطأ أثناء الحفظ.",
        type: "error",
      });
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="card-header">
          <div className="card-icon">
            <Send size={28} />
          </div>
          <h2 className="card-title">التصريح بالوجبة</h2>
        </div>

        {/* User Info */}
        <div style={{
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: '10px',
          marginBottom: '1.5rem'
        }}>
          <p style={{ margin: 0, fontWeight: '600' }}>
            الموظف: {currentUser.name}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {currentUser.residential ? 'موظف مقيم' : 'موظف غير مقيم'} 
            {!currentUser.residential && ' (الغداء فقط)'}
          </p>
        </div>

        {(!canDeclare || isOnVacation) && (
          <div className="alert alert-error">
            <AlertCircle size={24} />
            <div>
              <p>
                {isOnVacation 
                  ? 'أنت في إجازة حالياً. لا يمكنك التصريح بالوجبات.' 
                  : '⏰ تم إغلاق التصريحات الخاصة بالغد.'}
              </p>
              {!isOnVacation && (
                <p style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                  يرجى المحاولة غدًا قبل الساعة 22:00.
                </p>
              )}
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
            وجبة يوم:  
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
            <label className="form-label">الغداء</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ 
                flex: 1, 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem", 
                padding: "0.75rem 1.5rem", 
                border: "2px solid var(--border-color)", 
                borderRadius: "10px", 
                cursor: "pointer", 
                justifyContent: "center",
                background: lunch ? 'var(--gradient-delfiv)' : 'transparent',
                color: lunch ? 'white' : 'inherit'
              }}>
                <input 
                  type="radio" 
                  name="lunch" 
                  checked={lunch === true} 
                  onChange={() => setLunch(true)} 
                  disabled={!canDeclare || isOnVacation}
                  style={{ display: 'none' }}
                />
                <span>✓ نعم</span>
              </label>
              <label style={{ 
                flex: 1, 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem", 
                padding: "0.75rem 1.5rem", 
                border: "2px solid var(--border-color)", 
                borderRadius: "10px", 
                cursor: "pointer", 
                justifyContent: "center",
                background: !lunch ? 'rgba(238, 9, 121, 0.1)' : 'transparent',
                color: !lunch ? '#ee0979' : 'inherit'
              }}>
                <input 
                  type="radio" 
                  name="lunch" 
                  checked={lunch === false} 
                  onChange={() => setLunch(false)} 
                  disabled={!canDeclare || isOnVacation}
                  style={{ display: 'none' }}
                />
                <span>✗ لا</span>
              </label>
            </div>
          </div>

          {canHaveDinner && (
            <div className="form-group">
              <label className="form-label">العشاء</label>
              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={{ 
                  flex: 1, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  padding: "0.75rem 1.5rem", 
                  border: "2px solid var(--border-color)", 
                  borderRadius: "10px", 
                  cursor: "pointer", 
                  justifyContent: "center",
                  background: dinner ? 'var(--gradient-delfiv)' : 'transparent',
                  color: dinner ? 'white' : 'inherit'
                }}>
                  <input 
                    type="radio" 
                    name="dinner" 
                    checked={dinner === true} 
                    onChange={() => setDinner(true)} 
                    disabled={!canDeclare || isOnVacation}
                    style={{ display: 'none' }}
                  />
                  <span>✓ نعم</span>
                </label>
                <label style={{ 
                  flex: 1, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  padding: "0.75rem 1.5rem", 
                  border: "2px solid var(--border-color)", 
                  borderRadius: "10px", 
                  cursor: "pointer", 
                  justifyContent: "center",
                  background: !dinner ? 'rgba(238, 9, 121, 0.1)' : 'transparent',
                  color: !dinner ? '#ee0979' : 'inherit'
                }}>
                  <input 
                    type="radio" 
                    name="dinner" 
                    checked={dinner === false} 
                    onChange={() => setDinner(false)} 
                    disabled={!canDeclare || isOnVacation}
                    style={{ display: 'none' }}
                  />
                  <span>✗ لا</span>
                </label>
              </div>
            </div>
          )}

          {!canHaveDinner && (
            <div style={{
              padding: '1rem',
              background: 'rgba(243, 156, 18, 0.1)',
              borderRadius: '10px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              color: '#f39c12'
            }}>
              <AlertCircle size={16} style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }} />
              الموظفون الغير مقيمين يتناولون الغداء فقط
            </div>
          )}

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <span>{message.text}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={!canDeclare || isOnVacation}
          >
            <Send size={20} />
            تأكيد التصريح
          </button>
        </form>
      </div>
    </div>
  );
};

export default DelfivMealForm;