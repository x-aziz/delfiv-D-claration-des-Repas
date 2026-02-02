import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { storage } from "../utils/storage";

const MealForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientName: "",
    horn: "",
    chocolate: "",
    break: "",
    group: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const recipientOptions = [
    "براهيم دادي بهون",
    "عمر عبد الرحمان",
    "عبد السلام مرحرح",
    "ساليم حبة عينة",
    "سعيد عبد العزيز",
    "منير علواني",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipientName) {
      newErrors.recipientName = "يرجى تحديد اسم المستلم";
    }

    if (!formData.group) {
      newErrors.group = "يرجى إدخال المجموع";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "يرجى ملء جميع الحقول المطلوبة",
      });
      return;
    }

    try {
      storage.saveDeclaration(formData);
      setSubmitStatus({ type: "success", message: "تم حفظ التصريح بنجاح!" });

      setFormData({
        recipientName: "",
        horn: "",
        chocolate: "",
        break: "",
        group: "",
      });

      setTimeout(() => {
        navigate("/kitchen");
      }, 2000);
    } catch (error) {
      setSubmitStatus({ type: "error", message: "حدث خطأ أثناء حفظ التصريح" });
    }
  };

  return (
    <div className="main-content">
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card-header">
          <div className="card-icon">
            <FileText size={28} />
          </div>
          <h2 className="card-title">تصريح مصاريف الإقامة</h2>
        </div>

        {submitStatus && (
          <div className={`alert alert-${submitStatus.type}`}>
            {submitStatus.type === "success" ? (
              <CheckCircle2 size={24} />
            ) : (
              <AlertCircle size={24} />
            )}
            <span>{submitStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span>يُرجى تحديد الاسم</span>
              <span className="required">*</span>
            </label>
            <select
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className={`form-select ${errors.recipientName ? "error" : ""}`}
              required
            >
              <option value="">اختر المستلم</option>
              {recipientOptions.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.recipientName && (
              <span
                style={{
                  color: "var(--accent-red)",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                  display: "block",
                }}
              >
                {errors.recipientName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">عدد الخبز</label>
            <input
              type="number"
              name="horn"
              value={formData.horn}
              onChange={handleChange}
              placeholder="أدخل عدد الخبز"
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label"> ثمن علبة المعجون</label>
            <input
              type="number"
              name="chocolate"
              value={formData.chocolate}
              onChange={handleChange}
              placeholder="أدخل  ثمن علبة المعجون"
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">ثمن الكلي للبيض</label>
            <input
              type="number"
              name="break"
              value={formData.break}
              onChange={handleChange}
              placeholder="أدخل ثمن الكلي للبيض"
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>المجموع ( كليَة استقبل )</span>
              <span className="required">*</span>
            </label>
            <input
              type="text"
              name="group"
              value={formData.group}
              onChange={handleChange}
              placeholder="أدخل المجموع"
              className={`form-input ${errors.group ? "error" : ""}`}
              required
            />
            {errors.group && (
              <span
                style={{
                  color: "var(--accent-red)",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                  display: "block",
                }}
              >
                {errors.group}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            <Send size={20} />
            إرسال التصريح
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "rgba(74, 144, 226, 0.05)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              textAlign: "center",
              margin: 0,
            }}
          >
            <AlertCircle
              size={16}
              style={{ verticalAlign: "middle", marginLeft: "0.5rem" }}
            />
            جميع البيانات محفوظة بشكل آمن في النظام
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealForm;
