"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const DrawerContext = createContext();

function DrawerSlide({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onClose,
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }

    if (!value) {
      onClose?.();
    }
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within DrawerSlide");
  }
  return context;
}

function DrawerTrigger({ children }) {
  const { setOpen } = useDrawer();

  return (
    <div onClick={() => setOpen(true)} className="inline-block">
      {children}
    </div>
  );
}

function DrawerClose({ children }) {
  const { setOpen } = useDrawer();

  return (
    <div onClick={() => setOpen(false)} className="inline-block">
      {children}
    </div>
  );
}

function DrawerContent({
  children,
  className,
  side = "right",
  showCloseButton = true,
}) {
  const { open, setOpen } = useDrawer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed z-51 bg-white shadow-lg transition-transform duration-300 flex overflow-y-auto flex-col",
          side === "right" &&
            `top-0 right-0 h-full transform ${
              open ? "translate-x-0" : "translate-x-full"
            }`,
          side === "left" &&
            `top-0 left-0 h-full transform ${
              open ? "translate-x-0" : "-translate-x-full"
            }`,
          side === "top" &&
            `top-0 left-0 w-full transform ${
              open ? "translate-y-0" : "-translate-y-full"
            }`,
          side === "bottom" &&
            `bottom-0 left-0 w-full transform ${
              open ? "translate-y-0" : "translate-y-full"
            }`,
          className,
        )}
      >
        {children}

        {showCloseButton && (
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 opacity-70 text-red-600 bg-red-200 rounded-xl p-2 hover:opacity-100"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    </>,
    document.body,
  );
}

function DrawerHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />
  );
}

function DrawerFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }) {
  return <h2 className={cn("font-semibold text-lg", className)} {...props} />;
}

function DrawerDescription({ className, ...props }) {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />;
}

export {
  DrawerSlide,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
