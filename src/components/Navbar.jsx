import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, ChefHat, Sun, Moon, Utensils } from "lucide-react";
import { themeStorage } from "../utils/storage";

const Navbar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(themeStorage.getTheme());

  useEffect(() => {
    themeStorage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = themeStorage.toggleTheme();
    setTheme(newTheme);
  };

  const navLinks = [
    { path: "/", icon: Home, label: "الرئيسية" },
    { path: "/form", icon: FileText, label: "تصريح جديد" },
    { path: "/kitchen", icon: ChefHat, label: "عرض المطبخ" },
  ];

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
          {navLinks.map(({ path, icon: Icon, label }) => (
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
