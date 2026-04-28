import { createContext, useReducer, useCallback, useMemo } from "react";
import type { ReactNode } from "react";

import { ToastContainer } from "./ToastContainer";
import type {
  Toast,
  ToastAction,
  ToastState,
  ToastType,
  ToastPosition,
} from "../../types/toast";

interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition; 
}

interface ToastContextProps {
  toast: {
    show: (message: string, type?: ToastType, duration?: number) => void;

    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;

    remove: (id: string) => void;
  };
}

export const ToastContext = createContext<ToastContextProps | null>(null);

const initialState: ToastState = {
  toasts: [],
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
};

const DEFAULT_DURATION = 3000;

export const ToastProvider = ({
  children,
  position = "top-right",
}: ToastProviderProps) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const remove = useCallback((id: string) => {
    dispatch({
      type: "REMOVE_TOAST",
      payload: id,
    });
  }, []);

  const show = useCallback(
    (
      message: string,
      type: ToastType = "info",
      duration = DEFAULT_DURATION,
    ) => {
      const id = crypto.randomUUID();

      const newToast: Toast = {
        id,
        message,
        type,
        duration,
      };

      dispatch({
        type: "ADD_TOAST",
        payload: newToast,
      });

      setTimeout(() => {
        remove(id);
      }, duration);
    },
    [remove],
  );

  const toastAPI = useMemo(
    () => ({
      show,

      success: (msg: string) => show(msg, "success"),

      error: (msg: string) => show(msg, "error"),

      info: (msg: string) => show(msg, "info"),

      warning: (msg: string) => show(msg, "warning"),

      remove,
    }),
    [show, remove],
  );

  return (
    <ToastContext.Provider value={{ toast: toastAPI }}>
      {children}
      <ToastContainer
        toasts={state.toasts}
        remove={remove}
        position={position}
      />
    </ToastContext.Provider>
  );
};
