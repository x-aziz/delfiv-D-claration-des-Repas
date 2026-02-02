// Authentication Service
// Handles login, logout, and session management

import { getEmployeeByEmail, isAdmin } from './employeeDatabase';

const AUTH_KEY = 'delfiv_auth_user';
const SESSION_KEY = 'delfiv_session';

export const authService = {
  // Login with email (no password for frontend-only)
  login(email) {
    const user = getEmployeeByEmail(email);
    
    if (!user) {
      throw new Error('البريد الإلكتروني غير مسجل في النظام');
    }

    // Create session
    const session = {
      user: user,
      loginTime: new Date().toISOString(),
      isAdmin: user.role === 'admin'
    };

    // Save to localStorage
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return session;
  },

  // Logout
  logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(AUTH_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get current session
  getCurrentSession() {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  // Check if user is logged in
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Check if current user is admin
  isCurrentUserAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  // Check if current user is employee
  isCurrentUserEmployee() {
    const user = this.getCurrentUser();
    return user && user.role === 'employee';
  },

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  // Check if user can access a route
  canAccessRoute(routePath) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin can access everything
    if (user.role === 'admin') return true;

    // Employees cannot access kitchen view
    if (user.role === 'employee' && routePath === '/kitchen') {
      return false;
    }

    return true;
  }
};