import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, ChefHat, Sun, Moon, Utensils, LogOut, Calendar, Briefcase } from "lucide-react";
import { themeStorage } from "../utils/storage";
import { authService } from "../services/authService";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(themeStorage.getTheme());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [isAdmin, setIsAdmin] = useState(authService.isCurrentUserAdmin());

  // Listen to auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
      setIsAdmin(authService.isCurrentUserAdmin());
    };

    // Check auth state on mount and after navigation
    handleAuthChange();

    // Re-check on location change to ensure reactivity
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [location]);

  useEffect(() => {
    themeStorage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = themeStorage.toggleTheme();
    setTheme(newTheme);
  };

  const handleLogout = () => {
  if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    authService.logout();
    navigate('/login', { replace: true }); // Added replace: true
  }
};

  // Define nav links based on role
  const navLinks = [
    { path: "/", icon: Home, label: "الرئيسية", roles: ['admin', 'employee'] },
    // Employee-only forms
    { path: "/form", icon: FileText, label: "تصريح مصاريف", roles: ['employee'] },
    { path: "/delfiv-declaration", icon: Utensils, label: "تصريح الوجبات", roles: ['employee'] },
    { path: "/vacation", icon: Calendar, label: "الإجازات", roles: ['employee'] },
    // Admin-only views
    { path: "/kitchen", icon: ChefHat, label: "عرض المطبخ", roles: ['admin'] },
    { path: "/delfiv-cuisine", icon: Calendar, label: "جدول الوجبات", roles: ['admin'] },
    // Both roles
    { path: "/duties", icon: Briefcase, label: "المناوبات", roles: ['admin', 'employee'] },
  ];

  // Filter links based on user role
  const visibleLinks = navLinks.filter(link => 
    currentUser && link.roles.includes(currentUser.role)
  );

  // Don't render navbar if user is not logged in
  if (!currentUser) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="logo-container">
            <Utensils size={28} color="white" />
          </div>
          <span className="logo-text">delfiv</span>
        </Link>

        <div className="navbar-links">
          {visibleLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="تبديل السمة"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="theme-toggle"
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
            style={{
              background: 'rgba(238, 9, 121, 0.1)',
              color: '#ee0979'
            }}
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* User info - Display English name (nameEn) */}
        <div style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          marginRight: '1rem'
        }}>
          {currentUser?.nameEn || currentUser?.name}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;