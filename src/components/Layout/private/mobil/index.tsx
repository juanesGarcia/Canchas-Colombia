import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X as XIcon,
  Home as HomeIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  Volleyball as FootballIcon,
} from "lucide-react";
import { PRIVATE_NAVIGATION_ITEMS } from "../../../../constants";
import { User } from "../../../../types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user?: User | null;
}

interface NavigationItem {
  name: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onLogout,
  user,
}) => {
  const location = useLocation();

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
          : undefined,
    })),
    { name: "Canchas", path: "/fields", icon: FootballIcon },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 w-5/6 max-w-sm bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold">Menú</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
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
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Menu */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/settings"
              className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                location.pathname === "/settings"
                  ? "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={onClose}
            >
              <SettingsIcon className="w-5 h-5 mr-3" />
              Configuración
            </Link>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOutIcon className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
