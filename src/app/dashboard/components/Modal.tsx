import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  size?: "small" | "medium" | "large";
}

const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  size = "medium",
}) => {
  const sizeClasses = {
    small: "max-w-sm w-full",
    medium: "max-w-md w-full",
    large: "max-w-lg w-full",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal Overlay */}
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-75"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-all ${sizeClasses[size]}`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
