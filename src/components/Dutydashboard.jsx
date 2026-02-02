import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, Calendar, RefreshCw } from 'lucide-react';
import { dutyService } from '../services/dutyService';
import { authService } from '../services/authService';

const DutyDashboard = () => {
  const [duties, setDuties] = useState([]);
  const [todayDuties, setTodayDuties] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.isCurrentUserAdmin();

  useEffect(() => {
    loadDuties();
    // Initialize daily duties if admin
    if (isAdmin) {
      initializeDuties();
    }
  }, []);

  const loadDuties = () => {
    if (currentUser) {
      const allDuties = dutyService.getEmployeeDuties(currentUser.id);
      const today = dutyService.getEmployeeTodayDuties(currentUser.id);
      
      setDuties(allDuties.reverse()); // Show newest first
      setTodayDuties(today);
    }
  };

  const initializeDuties = () => {
    try {
      const result = dutyService.initializeDailyDuties();
      console.log('Duties initialized:', result);
    } catch (error) {
      console.error('Error initializing duties:', error);
    }
  };

  const handleCompleteDuty = (dutyId) => {
    if (window.confirm('هل أنت متأكد من إتمام هذه المهمة؟')) {
      dutyService.completeDuty(dutyId);
      setMessage({ text: 'تم تسجيل إتمام المهمة!', type: 'success' });
      loadDuties();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const getDutyTypeName = (type) => {
    const types = {
      'daily-cleaning': 'تنظيف الشركة اليومي',
      'bathroom-cleaning': 'تنظيف الحمامات',
      'wash-dishes': 'غسل الأطباق',
      'buy-bread': 'شراء الخبز',
      'clean-kitchen-floor': 'تنظيف أرضية المطبخ'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '600',
          background: 'rgba(56, 239, 125, 0.1)',
          color: '#38ef7d'
        }}>
          مكتملة
        </span>
      );
    }

    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.875rem',
        fontWeight: '600',
        background: 'rgba(243, 156, 18, 0.1)',
        color: '#f39c12'
      }}>
        قيد الانتظار
      </span>
    );
  };

  return (
    <div className="main-content">
      {/* Today's Duties Card */}
      {todayDuties.length > 0 && (
        <div className="card" style={{ 
          marginBottom: '2rem',
          background: 'var(--gradient-delfiv)',
          color: 'white'
        }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Briefcase size={24} />
              مهامك اليوم
            </h2>
            <div style={{ 
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            }}>
              {todayDuties.map(duty => (
                <div key={duty.id} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '1rem',
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    {getDutyTypeName(duty.type)}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {new Date(duty.date).toLocaleDateString('ar-DZ')}
                  </div>
                  {duty.status === 'pending' && (
                    <button
                      onClick={() => handleCompleteDuty(duty.id)}
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem 1rem',
                        background: 'white',
                        color: 'var(--accent-blue)',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <CheckCircle size={16} />
                      تم الإنجاز
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Duties */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Calendar size={28} />
          </div>
          <h2 className="card-title">سجل المهام</h2>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
            {message.type === 'success' ? <CheckCircle size={20} /> : null}
            <span>{message.text}</span>
          </div>
        )}

        <button
          onClick={loadDuties}
          className="btn"
          style={{ marginBottom: '1.5rem' }}
        >
          <RefreshCw size={18} />
          تحديث
        </button>

        <div style={{ overflowX: 'auto' }}>
          {duties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <Briefcase size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                لا توجد مهام مسجلة
              </p>
            </div>
          ) : (
            <table className="declarations-table">
              <thead>
                <tr>
                  <th>نوع المهمة</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {duties.map((duty) => (
                  <tr key={duty.id}>
                    <td style={{ fontWeight: '600' }}>
                      {getDutyTypeName(duty.type)}
                    </td>
                    <td>{new Date(duty.date).toLocaleDateString('ar-DZ')}</td>
                    <td>{getStatusBadge(duty.status)}</td>
                    <td>
                      {duty.status === 'pending' && (
                        <button
                          onClick={() => handleCompleteDuty(duty.id)}
                          className="btn btn-success btn-icon"
                          title="تم الإنجاز"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DutyDashboard;