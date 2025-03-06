// src/components/Modal.js
import React from "react";
 

/**
 * مكوّن Modal يعرض نافذة منبثقة في منتصف الشاشة
 * @param {boolean} isOpen - هل النافذة مفتوحة أم لا
 * @param {function} onClose - دالة إغلاق النافذة
 * @param {string} title - عنوان النافذة (اختياري)
 * @param {ReactNode} children - محتوى النافذة
 */
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* يمنع إغلاق النافذة إذا نقرنا على المحتوى نفسه */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {title && <h3 className="modal-title">{title}</h3>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
