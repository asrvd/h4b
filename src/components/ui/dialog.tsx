"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "./button";

export function DialogComponent({
  isOpen,
  setIsOpen,
  children,
  dialogTitle,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: React.ReactNode;
  dialogTitle: string;
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-black opacity-50" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="lg:w-1/2 w-full relative space-y-2 border rounded-lg bg-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <DialogTitle
                className={"font-bold leading-none"}
                >{dialogTitle}</DialogTitle>
            <Button
              variant={"ghost"}
              className="px-2"
              onClick={() => setIsOpen(false)}
            >
              <XIcon size={20} />
            </Button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
