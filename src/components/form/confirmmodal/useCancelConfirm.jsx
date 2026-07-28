"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import Button from "../../button/Button";
import NextInput from "../nextinput/NextInput";

export default function CancelConfirmModal() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const resolverRef = useRef(null);

  // 👉 call this like a function
  const askCancel = () => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setReason("");
      setOpen(true);
    });
  };

  const handleClose = () => {
    resolverRef.current?.({
      confirmed: false,
      reason: null,
    });

    setOpen(false);
  };

  const handleConfirm = async () => {
    if (!reason.trim()) return;

    setLoading(true);

    resolverRef.current?.({
      confirmed: true,
      reason,
    });

    setLoading(false);
    setOpen(false);
  };

  return {
    askCancel,
    modal: (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className={`bg-white border-none text-gray-600 text-[16px]`}
        >
          <DialogHeader>
            <DialogTitle className="text-blue-500 uppercase font-bold">
              Cancel Job?
            </DialogTitle>

            <DialogDescription className={`text-[16px] leading-5.5`}>
              This action cannot be undone. Once cancelled, the job cannot be
              reactivated.
            </DialogDescription>
          </DialogHeader>

          <NextInput
            textarea
            textareaRows={2}
            placeholder="Enter cancellation reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <DialogFooter>
            <Button
              click={handleClose}
              name={`No, keep it`}
              bg={`bg-green-500 text-white hover:bg-green-600`}
            />

            <Button
              click={handleConfirm}
              disabled={!reason.trim() || loading}
              name={`Yes, cancel`}
              bg={`bg-red-500 text-white hover:bg-reg-600`}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  };
}
