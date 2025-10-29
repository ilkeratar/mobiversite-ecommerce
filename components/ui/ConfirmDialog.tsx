'use client';

import { ReactNode, useEffect } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? 'confirm-dialog-description' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onCancel}
      />

      <div className="relative mx-4 w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
          <div className="px-6 pt-6">
            <h2 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            {description && (
              <div id="confirm-dialog-description" className="mt-2 text-sm text-gray-600">
                {description}
              </div>
            )}
          </div>

          <div className="px-6 pb-6 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


