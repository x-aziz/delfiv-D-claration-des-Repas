import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ChefHat,
  BarChart3,
  Shield,
  Zap,
  Clock,
  Utensils,
  Calendar,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "تصريح سريع",
      description:
        "قم بإنشاء تصريح مصاريف الإفادة في ثوانٍ معدودة بواجهة سهلة الاستخدام",
    },
    {
      icon: ChefHat,
      title: "إدارة المطبخ",
      description: "تتبع جميع التصريحات والمصاريف من لوحة تحكم واحدة شاملة",
    },
    {
      icon: BarChart3,
      title: "تقارير تفصيلية",
      description: "احصل على إحصائيات دقيقة حول المصاريف والاستهلاك الشهري",
    },
  ];

  const stats = [
    { icon: Zap, label: "سريع وفعال", value: "100%" },
    { icon: Shield, label: "آمن ومضمون", value: "100%" },
    { icon: Clock, label: "متاح دائماً", value: "24/7" },
  ];

  return (
    <div className="main-content">
      <div className="hero">
        <h1 className="hero-title">نظام delfiv المتكامل</h1>
        <p className="hero-subtitle">
          حل متكامل وعصري لإدارة التصريحات والوجبات بكفاءة عالية وواجهة احترافية
        </p>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <feature.icon size={40} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* delfiv System Buttons */}
        <div style={{ marginTop: "3rem" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "var(--text-primary)",
            }}
          >
            نظام تصريح المصاريف
          </h2>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/form")}
              className="btn btn-primary"
              style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}
            >
              <FileText size={20} />
              إنشاء تصريح جديد
            </button>
            <button
              onClick={() => navigate("/kitchen")}
              className="btn btn-primary"
              style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}
            >
              <ChefHat size={20} />
              عرض المطبخ
            </button>
          </div>
        </div>

        {/* delfiv System Buttons */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "2px solid var(--border-color)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "var(--text-primary)",
            }}
          >
            نظام إدارة الوجبات اليومية
          </h2>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/delfiv-declaration")}
              className="btn btn-success"
              style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}
            >
              <Utensils size={20} />
              تصريح الوجبات
            </button>
            <button
              onClick={() => navigate("/delfiv-cuisine")}
              className="btn btn-success"
              style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}
            >
              <Calendar size={20} />
              جدول الوجبات
            </button>
          </div>
        </div>

        {/* <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {stats.map((stat, index) => (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--gradient-delfiv)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white',
                boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)'
              }}>
                <stat.icon size={30} />
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', background: 'var(--gradient-delfiv)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.value}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Home;
