import React from 'react';

/**
 * ConfirmModal – replaces window.confirm() with a premium styled dialog.
 *
 * Props:
 *  open        – boolean – show/hide
 *  title       – string  – bold heading
 *  message     – string  – description text
 *  confirmText – string  – confirm button label (default "Confirm")
 *  cancelText  – string  – cancel button label  (default "Cancel")
 *  variant     – 'danger' | 'warning' | 'info'  (default 'danger')
 *  icon        – ReactNode – optional icon override
 *  onConfirm   – () => void
 *  onCancel    – () => void
 */
const ConfirmModal = ({
  open,
  title       = 'Are you sure?',
  message     = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText  = 'Cancel',
  variant     = 'danger',
  icon,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const colors = {
    danger:  { ring: 'ring-danger-500/20',  bg: 'bg-danger-500/10',  text: 'text-danger-400',  btn: 'bg-danger-600 hover:bg-danger-700 text-white' },
    warning: { ring: 'ring-warning-500/20', bg: 'bg-warning-500/10', text: 'text-warning-400', btn: 'bg-warning-600 hover:bg-warning-700 text-white' },
    info:    { ring: 'ring-info-500/20',    bg: 'bg-info-500/10',    text: 'text-info-400',    btn: 'bg-info-600 hover:bg-info-700 text-white'       },
  };
  const c = colors[variant] || colors.danger;

  const defaultIcons = {
    danger: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  };

  const renderedIcon = icon || defaultIcons[variant] || defaultIcons.danger;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-surface-800 shadow-modal animate-slide-up overflow-hidden"
        style={{ background: 'var(--bg-card)' }}
      >
        {/* Top accent line */}
        <div className={`h-1 w-full ${variant === 'danger' ? 'bg-danger-500' : variant === 'warning' ? 'bg-warning-500' : 'bg-info-500'}`} />

        <div className="px-6 pt-6 pb-2 flex flex-col items-center text-center gap-4">
          {/* Icon circle */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ring-2 ${c.ring} ${c.bg} ${c.text}`}>
            {renderedIcon}
          </div>

          {/* Text */}
          <div>
            <h3 className="text-lg font-bold text-surface-900 tracking-tight">{title}</h3>
            <p className="text-sm text-surface-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary text-sm"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-4 py-2.5 text-sm
                        transition-all duration-200 active:scale-[.97] ${c.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
