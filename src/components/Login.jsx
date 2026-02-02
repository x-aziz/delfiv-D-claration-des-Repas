import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, LogIn, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const session = authService.login(email.trim());
      
      // Force a small delay to ensure localStorage is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger storage event manually for same-tab auth state update
      window.dispatchEvent(new Event('storage'));
      
      // Redirect based on role with replace to prevent back navigation to login
      if (session.isAdmin) {
  navigate('/kitchen', { replace: true });
} else {
  navigate('/', { replace: true });
}
      
      // Force a reload of the page to ensure navbar appears
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-delfiv)',
      padding: '2rem'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--gradient-delfiv)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)'
          }}>
            <Mail size={40} color="white" />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            نظام delfiv
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem'
          }}>
            تسجيل الدخول إلى حسابك
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              البريد الإلكتروني <span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="write: [name].[familyname]@delfiv.com"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <LogIn size={20} />
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(74, 144, 226, 0.05)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            margin: 0
          }}>
            استخدم بريدك الإلكتروني الخاص بالشركة للدخول
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;