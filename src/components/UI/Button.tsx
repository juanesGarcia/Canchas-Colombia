import React from "react";
import { DivideIcon as LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline-solid" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: typeof LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900";

  const variantClasses = {
    primary:
      "bg-green-600 text-white hover:bg-green-700  shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:text-green-400 dark:border-green-400 dark:hover:bg-green-400 dark:hover:text-gray-900",
    "outline-solid":
      "border-2 border-green-600 bg-white text-green-600 hover:bg-green-600 hover:text-white dark:bg-gray-900 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-400 dark:hover:text-gray-900",
    ghost:
      "text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-gray-800",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {Icon && iconPosition === "left" && !loading && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
      {Icon && iconPosition === "right" && !loading && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
};
