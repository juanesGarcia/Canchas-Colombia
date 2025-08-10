import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut as LogOutIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Calendar as CalendarIcon,
  Menu as MenuIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Volleyball,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { MobileMenu } from "./mobil";
import { PRIVATE_NAVIGATION_ITEMS } from "../../../constants";

interface NavigationItem {
  name: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const PrivateLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const privateNavItems: NavigationItem[] = [
    ...PRIVATE_NAVIGATION_ITEMS.map((item) => ({
      ...item,
      icon:
        item.name === "Mis Reservas"
          ? CalendarIcon
          : item.name === "Perfil"
          ? UserIcon
          : item.name === "Dashboard"
          ? HomeIcon
          : item.name === "Canchas"
          ? Volleyball
          : undefined,
    })),
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold">Dashboard</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            {privateNavItems.map((item) => {
              const Icon = item.icon || HomeIcon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                  <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <Link
              to="/settings"
              className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                location.pathname === "/settings"
                  ? "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <SettingsIcon className="w-5 h-5 mr-3" />
              Configuración
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOutIcon className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
              <Link to="/profile" className="flex items-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
        user={user}
      />
    </div>
  );
};
