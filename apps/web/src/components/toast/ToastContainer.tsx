import { useEffect, useState } from "react";
import type { Toast, ToastPosition } from "../../types/toast";
import { ToastItem } from "./ToastItem";

interface Props {
  toasts: Toast[];
  remove: (id: string) => void;
  position?: ToastPosition;
}

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "top-5 right-5",
  "top-left": "top-5 left-5",
  "bottom-right": "bottom-5 right-5",
  "bottom-left": "bottom-5 left-5",
};

const positionAnimations: Record<ToastPosition, string> = {
  "top-right": "animate-slide-in",
  "top-left": "animate-slide-in-left",
  "bottom-right": "animate-slide-up",
  "bottom-left": "animate-slide-up-left",
};

export const ToastContainer = ({
  toasts,
  remove,
  position = "top-right",
}: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`
      fixed z-50 space-y-3
      ${positionClasses[position]}
    `}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            animationDelay: `${index * 50}ms`,
          }}
          className={positionAnimations[position]}
        >
          <ToastItem toast={toast} onRemove={remove} />
        </div>
      ))}
    </div>
  );
};
