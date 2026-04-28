import { useEffect, useState } from "react";
import type { Toast } from "../../types/toast";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface Props {
  toast: Toast;
  onRemove: (id: string) => void;
}

export const ToastItem = ({ toast, onRemove }: Props) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const config = {
    success: {
      bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      border: "border-emerald-400",
      icon: CheckCircle,
      iconBg: "bg-emerald-600/30",
      ring: "ring-emerald-400/20",
    },
    error: {
      bg: "bg-gradient-to-r from-rose-500 to-red-600",
      border: "border-rose-400",
      icon: AlertCircle,
      iconBg: "bg-rose-600/30",
      ring: "ring-rose-400/20",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
      border: "border-blue-400",
      icon: Info,
      iconBg: "bg-blue-600/30",
      ring: "ring-blue-400/20",
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-500 to-orange-600",
      border: "border-amber-400",
      icon: AlertTriangle,
      iconBg: "bg-amber-600/30",
      ring: "ring-amber-400/20",
    },
  }[toast.type];

  const Icon = config.icon;

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  useEffect(() => {
    if (toast.duration) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 100 / (toast.duration! / 16);
        });
      }, 16);

      return () => clearInterval(interval);
    }
  }, [toast.duration]);

  return (
    <div
      className={`
        relative group
        transform transition-all duration-300 ease-out
        ${isExiting ? "animate-slide-out opacity-0 scale-95" : "animate-slide-in"}
      `}
    >
      <div
        className={`
          flex items-start gap-3
          px-4 py-3 pr-10
          rounded-xl
          backdrop-blur-sm
          shadow-2xl
          border
          min-w-[320px]
          max-w-md
          ${config.bg}
          ${config.border}
          ${config.ring}
          ring-1
          text-white
          transition-all
          hover:scale-105
          hover:shadow-2xl
          cursor-pointer
        `}
        onClick={handleRemove}
      >
        {/* Icon Section */}
        <div
          className={`
          flex-shrink-0
          p-1.5
          rounded-lg
          ${config.iconBg}
          backdrop-blur-sm
        `}
        >
          <Icon size={18} className="text-white" />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">
            {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </p>
          <p className="text-xs mt-0.5 opacity-90 break-words">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className={`
            absolute top-2 right-2
            p-1
            rounded-lg
            opacity-0 group-hover:opacity-100
            transition-all duration-200
            hover:bg-white/20
            focus:outline-none focus:ring-2 focus:ring-white/50
          `}
        >
          <X size={14} className="text-white/80 hover:text-white" />
        </button>

        {/* Progress Bar */}
        {toast.duration && (
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
            <div
              className="h-full bg-white/30 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
