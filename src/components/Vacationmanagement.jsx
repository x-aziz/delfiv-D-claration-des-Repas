import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle, XCircle } from 'lucide-react';
import { vacationService } from '../services/vacationService';
import { authService } from '../services/authService';

const VacationManagement = () => {
  const [vacations, setVacations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadVacations();
  }, []);

  const loadVacations = () => {
    if (currentUser) {
      const userVacations = vacationService.getEmployeeVacations(currentUser.id);
      setVacations(userVacations);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      vacationService.declareVacation(
        currentUser.id,
        formData.startDate,
        formData.endDate,
        formData.reason
      );

      setMessage({ text: 'تم تسجيل الإجازة بنجاح!', type: 'success' });
      setFormData({ startDate: '', endDate: '', reason: '' });
      setShowForm(false);
      loadVacations();
      
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'حدث خطأ أثناء تسجيل الإجازة', type: 'error' });
    }
  };

  const handleEndVacation = (vacationId) => {
    if (window.confirm('هل أنت متأكد من إنهاء الإجازة؟')) {
      vacationService.endVacation(vacationId);
      setMessage({ text: 'تم إنهاء الإجازة بنجاح!', type: 'success' });
      loadVacations();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const getStatusBadge = (vacation) => {
    if (vacation.status === 'completed') {
      return (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '600',
          background: 'rgba(156, 163, 175, 0.1)',
          color: '#9ca3af'
        }}>
          منتهية
        </span>
      );
    }

    const today = new Date().toISOString().split('T')[0];
    if (today >= vacation.startDate && today <= vacation.endDate) {
      return (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '600',
          background: 'rgba(56, 239, 125, 0.1)',
          color: '#38ef7d'
        }}>
          نشطة
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
        قادمة
      </span>
    );
  };

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Calendar size={28} />
          </div>
          <h2 className="card-title">إدارة الإجازات</h2>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ marginBottom: '1.5rem' }}
        >
          <Plus size={20} />
          {showForm ? 'إلغاء' : 'طلب إجازة جديدة'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ 
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px'
          }}>
            <div className="form-group">
              <label className="form-label">تاريخ البداية *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">تاريخ النهاية *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">السبب (اختياري)</label>
              <textarea
                className="form-input"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="أدخل سبب الإجازة"
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              تأكيد الطلب
            </button>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          {vacations.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <Calendar size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                لا توجد إجازات مسجلة
              </p>
            </div>
          ) : (
            <table className="declarations-table">
              <thead>
                <tr>
                  <th>تاريخ البداية</th>
                  <th>تاريخ النهاية</th>
                  <th>المدة</th>
                  <th>السبب</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {vacations.map((vacation) => {
                  const start = new Date(vacation.startDate);
                  const end = new Date(vacation.endDate);
                  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <tr key={vacation.id}>
                      <td>{new Date(vacation.startDate).toLocaleDateString('ar-DZ')}</td>
                      <td>{new Date(vacation.endDate).toLocaleDateString('ar-DZ')}</td>
                      <td>{days} يوم</td>
                      <td>{vacation.reason || '-'}</td>
                      <td>{getStatusBadge(vacation)}</td>
                      <td>
                        {vacation.status === 'active' && (
                          <button
                            onClick={() => handleEndVacation(vacation.id)}
                            className="btn btn-danger btn-icon"
                            title="إنهاء الإجازة"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacationManagement;